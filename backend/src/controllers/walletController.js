const Wallet = require('../models/Wallet');

exports.getWalletBalance = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user.id, balance: 0, transactions: [] });
    }

    return res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch wallet balance.', error: error.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(200).json({ transactions: [], page, totalPages: 0, total: 0 });
    }

    const sorted = [...wallet.transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);
    const totalPages = Math.ceil(sorted.length / limit);

    return res.status(200).json({
      transactions: paginated,
      page,
      totalPages,
      total: sorted.length,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch transactions.', error: error.message });
  }
};

exports.withdrawFunds = async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    const numericAmount = Number(amount);

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    if (!numericAmount || numericAmount < 50) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is KES 50.' });
    }

    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user.id, balance: 0, transactions: [] });
    }

    if (wallet.balance < numericAmount) {
      return res.status(400).json({ message: 'Insufficient wallet balance.' });
    }

    wallet.balance -= numericAmount;
    wallet.transactions.push({
      type: 'withdrawal',
      amount: numericAmount,
      reference: `WD-${Date.now()}`,
      description: `Withdrawal request to ${phoneNumber}`,
    });

    await wallet.save();

    return res.status(202).json({
      message: 'Withdrawal initiated (provider integration scaffold).',
      balance: wallet.balance,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to process withdrawal.', error: error.message });
  }
};
