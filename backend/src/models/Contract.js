const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    amount: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'approved', 'rejected'],
      default: 'pending',
    },
    submission: {
      description: { type: String, default: '' },
      images: [{ type: String }],
      submittedAt: { type: Date },
    },
    rejectionReason: { type: String, default: '' },
    paymentReleased: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const contractSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hustler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    budget: { type: Number, required: true, min: 1 },
    milestones: {
      type: [milestoneSchema],
      validate: {
        validator(milestones) {
          return Array.isArray(milestones) && milestones.length > 0;
        },
        message: 'At least one milestone is required.',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'funded', 'in_progress', 'closed'],
      default: 'draft',
    },
    fundedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contract', contractSchema);
