const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['credit', 'debit', 'withdrawal', 'escrow_funding', 'escrow_release'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    reference: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    balance: { type: Number, default: 0, min: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
