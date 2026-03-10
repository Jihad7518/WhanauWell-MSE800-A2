
import mongoose from 'mongoose';

const organisationApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  reason: { type: String },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('OrganisationApplication', organisationApplicationSchema);
