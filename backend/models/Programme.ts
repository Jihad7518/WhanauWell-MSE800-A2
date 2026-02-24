
import mongoose, { Schema, Document } from 'mongoose';

export interface IProgramme extends Document {
  title: string;
  description: string;
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
  description: { type: String, required: true },
  organisationId: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true },
  coordinatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  location: { type: String },
  category: { type: String },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IProgramme>('Programme', ProgrammeSchema);
