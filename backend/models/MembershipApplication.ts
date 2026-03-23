import mongoose from 'mongoose';

const MembershipApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  organisationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', required: true },
  message: { type: String },
  documentId: { type: String },
  idType: { type: String },
  reason: { type: String },
  howDidYouHear: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  rejectedReason: { type: String },
  inviteCodeSent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MembershipApplication', MembershipApplicationSchema);
