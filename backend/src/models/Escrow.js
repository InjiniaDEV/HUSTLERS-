const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema(
  {
    contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true, unique: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fundedAmount: { type: Number, required: true, min: 0 },
    remainingAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['active', 'exhausted', 'frozen'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Escrow', escrowSchema);
