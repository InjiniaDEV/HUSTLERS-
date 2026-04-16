const Contract = require('../models/Contract');
const Escrow = require('../models/Escrow');
const Wallet = require('../models/Wallet');

async function releaseMilestonePayment({ contractId, milestoneId, approverId }) {
  const contract = await Contract.findById(contractId);
  if (!contract) {
    throw new Error('Contract not found.');
  }

  if (String(contract.manager) !== String(approverId)) {
    throw new Error('Only the contract manager can approve milestones.');
  }

  const milestone = contract.milestones.id(milestoneId);
  if (!milestone) {
    throw new Error('Milestone not found.');
  }

  if (milestone.status !== 'submitted') {
    throw new Error('Only submitted milestones can be approved.');
  }

  if (milestone.paymentReleased) {
    throw new Error('Payment already released for this milestone.');
  }

  const escrow = await Escrow.findOne({ contract: contract._id });
  if (!escrow) {
    throw new Error('Escrow record not found.');
  }

  if (escrow.remainingAmount < milestone.amount) {
    throw new Error('Insufficient escrow balance.');
  }

  let hustlerWallet = await Wallet.findOne({ user: contract.hustler });
  if (!hustlerWallet) {
    hustlerWallet = new Wallet({ user: contract.hustler, balance: 0, transactions: [] });
  }

  escrow.remainingAmount -= milestone.amount;
  escrow.status = escrow.remainingAmount === 0 ? 'exhausted' : 'active';

  milestone.status = 'approved';
  milestone.paymentReleased = true;
  milestone.rejectionReason = '';

  hustlerWallet.balance += milestone.amount;
  hustlerWallet.transactions.push({
    type: 'escrow_release',
    amount: milestone.amount,
    reference: `MILESTONE-${milestone._id}`,
    description: `Escrow release for milestone '${milestone.title}'`,
  });

  const allApproved = contract.milestones.every((ms) => ms.status === 'approved');
  if (allApproved) {
    contract.status = 'closed';
    contract.closedAt = new Date();
  }

  await Promise.all([escrow.save(), contract.save(), hustlerWallet.save()]);

  return {
    contractId: contract._id,
    milestoneId: milestone._id,
    releasedAmount: milestone.amount,
    remainingEscrow: escrow.remainingAmount,
    hustlerWalletBalance: hustlerWallet.balance,
  };
}

module.exports = {
  releaseMilestonePayment,
};
