import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  levelNumber: { type: Number, required: true },
  name: { type: String, required: true },
  assignedReviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  blindReview: { type: Boolean, default: false },
  scoringType: { type: String, enum: ['form', 'question'], default: 'form' },
}, { timestamps: true });

levelSchema.index({ formId: 1, levelNumber: 1 }, { unique: true });

export const Level = mongoose.model('Level', levelSchema);
