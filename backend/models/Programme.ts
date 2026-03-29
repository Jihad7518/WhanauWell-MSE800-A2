
import mongoose, { Schema, Document } from 'mongoose';

// Define the Programme interface extending Mongoose's Document
export interface IProgramme extends Document {
  title: string;
  description: string; // This will be the legacy field, we'll map it to memberDetails if needed
  publicSummary: string;
  memberDetails: string;
  visibility: 'PUBLIC' | 'ORG_ONLY' | 'GLOBAL';
  organisationId: mongoose.Types.ObjectId;
  coordinatorId: mongoose.Types.ObjectId;
  startDate: Date;
  location?: string;
  category?: string;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProgrammeSchema: Schema = new Schema({
  title: { type: String, required: true },
  publicSummary: { type: String, required: true },
  memberDetails: { type: String, required: true },
  visibility: { type: String, enum: ['PUBLIC', 'ORG_ONLY', 'GLOBAL'], default: 'ORG_ONLY' },
  description: { type: String }, // Keep for compatibility or remove if safe
  organisationId: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true },
  coordinatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  location: { type: String },
  category: { type: String },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IProgramme>('Programme', ProgrammeSchema);
