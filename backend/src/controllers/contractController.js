const Contract = require('../models/Contract');
const Escrow = require('../models/Escrow');
const User = require('../models/User');
const { releaseMilestonePayment } = require('../services/escrowService');

function parseMilestones(milestones = []) {
  return milestones.map((milestone) => ({
    title: milestone.title,
    description: milestone.description || '',
    amount: Number(milestone.amount),
    dueDate: milestone.dueDate,
  }));
}

exports.createContract = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can create contracts.' });
    }

    const { title, description, milestones } = req.body;

    if (!title || !Array.isArray(milestones) || milestones.length === 0) {
      return res.status(400).json({ message: 'Title and at least one milestone are required.' });
    }

    const normalizedMilestones = parseMilestones(milestones);
    if (normalizedMilestones.some((ms) => !ms.title || !ms.amount || !ms.dueDate)) {
      return res.status(400).json({ message: 'Each milestone requires title, amount, and dueDate.' });
    }

    const budget = normalizedMilestones.reduce((total, ms) => total + ms.amount, 0);

    const contract = await Contract.create({
      title,
      description,
      manager: req.user.id,
      budget,
      milestones: normalizedMilestones,
      status: 'draft',
    });

    return res.status(201).json({ message: 'Contract created.', contract });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create contract.', error: error.message });
  }
};

exports.fundContract = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can fund contracts.' });
    }

    const { contractId } = req.params;
    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found.' });
    }

    if (String(contract.manager) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Only manager can fund this contract.' });
    }

    if (contract.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft contracts can be funded.' });
    }

    contract.status = 'funded';
    contract.fundedAt = new Date();
    await contract.save();

    await Escrow.findOneAndUpdate(
      { contract: contract._id },
      {
        contract: contract._id,
        manager: contract.manager,
        fundedAmount: contract.budget,
        remainingAmount: contract.budget,
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ message: 'Contract funded and escrow created.', contractId: contract._id });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fund contract.', error: error.message });
  }
};

exports.assignContract = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can assign contracts.' });
    }

    const { contractId } = req.params;
    const { hustlerId } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found.' });
    }

    if (String(contract.manager) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Only manager can assign this contract.' });
    }

    if (contract.status !== 'funded') {
      return res.status(400).json({ message: 'Contract must be funded before assignment.' });
    }

    const hustler = await User.findById(hustlerId);
    if (!hustler) {
      return res.status(404).json({ message: 'Hustler not found.' });
    }

    if (hustler.role !== 'hustler') {
      return res.status(400).json({ message: 'Assignee must be a hustler.' });
    }

    if (hustler.kycStatus !== 'approved') {
      return res.status(400).json({ message: 'Only KYC-approved hustlers can be assigned.' });
    }

    contract.hustler = hustler._id;
    contract.status = 'in_progress';
    await contract.save();

    return res.status(200).json({ message: 'Contract assigned.', contract });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to assign contract.', error: error.message });
  }
};

exports.submitMilestone = async (req, res) => {
  try {
    if (req.user.role !== 'hustler') {
      return res.status(403).json({ message: 'Only hustlers can submit milestones.' });
    }

    const { contractId, milestoneId } = req.params;
    const { description, images = [] } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found.' });
    }

    if (!contract.hustler || String(contract.hustler) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Only assigned hustler can submit milestones.' });
    }

    const milestone = contract.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    if (!['pending', 'rejected'].includes(milestone.status)) {
      return res.status(400).json({ message: 'Milestone is not in a submittable state.' });
    }

    milestone.submission = {
      description: description || '',
      images: images.slice(0, 3),
      submittedAt: new Date(),
    };
    milestone.status = 'submitted';
    milestone.rejectionReason = '';

    await contract.save();

    return res.status(200).json({ message: 'Milestone submitted.', milestone });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to submit milestone.', error: error.message });
  }
};

exports.approveMilestone = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can approve milestones.' });
    }

    const { contractId, milestoneId } = req.params;
    const result = await releaseMilestonePayment({
      contractId,
      milestoneId,
      approverId: req.user.id,
    });

    return res.status(200).json({ message: 'Milestone approved and payment released.', result });
  } catch (error) {
    const notFoundErrors = ['Contract not found.', 'Milestone not found.'];
    const badRequestErrors = [
      'Only the contract manager can approve milestones.',
      'Only submitted milestones can be approved.',
      'Payment already released for this milestone.',
      'Escrow record not found.',
      'Insufficient escrow balance.',
    ];

    if (notFoundErrors.includes(error.message)) {
      return res.status(404).json({ message: error.message });
    }

    if (badRequestErrors.includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Failed to approve milestone.', error: error.message });
  }
};

exports.rejectMilestone = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can reject milestones.' });
    }

    const { contractId, milestoneId } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Rejection reason is required.' });
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found.' });
    }

    if (String(contract.manager) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Only manager can reject milestones.' });
    }

    const milestone = contract.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found.' });
    }

    if (milestone.status !== 'submitted') {
      return res.status(400).json({ message: 'Only submitted milestones can be rejected.' });
    }

    milestone.status = 'rejected';
    milestone.rejectionReason = reason.trim();

    await contract.save();

    return res.status(200).json({ message: 'Milestone rejected.', milestone });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reject milestone.', error: error.message });
  }
};

exports.getContractById = async (req, res) => {
  try {
    const { contractId } = req.params;
    const contract = await Contract.findById(contractId).populate('manager hustler', 'name phone email role kycStatus');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found.' });
    }

    const userId = String(req.user.id);
    const isManager = String(contract.manager._id) === userId;
    const isHustler = contract.hustler && String(contract.hustler._id) === userId;

    if (!isManager && !isHustler) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const escrow = await Escrow.findOne({ contract: contract._id });
    return res.status(200).json({ contract, escrow });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch contract.', error: error.message });
  }
};

exports.listContracts = async (req, res) => {
  try {
    const filter = req.user.role === 'hustler' ? { hustler: req.user.id } : { manager: req.user.id };

    const contracts = await Contract.find(filter)
      .sort({ updatedAt: -1 })
      .populate('manager hustler', 'name role phone kycStatus');

    return res.status(200).json({ contracts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to list contracts.', error: error.message });
  }
};
