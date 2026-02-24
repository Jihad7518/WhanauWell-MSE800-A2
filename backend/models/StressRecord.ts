
import mongoose, { Schema, Document } from 'mongoose';

export interface IStressRecord extends Document {
  userId: mongoose.Types.ObjectId;
  organisationId: mongoose.Types.ObjectId;
  responses: { questionId: string; value: number }[];
  score: number;
  classification: 'Low' | 'Moderate' | 'High';
  explanation: string;
  consentGiven: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StressRecordSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organisationId: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true },
  responses: [{
    questionId: { type: String, required: true },
    value: { type: Number, required: true }
  }],
  score: { type: Number, required: true },
  classification: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
  explanation: { type: String, required: true },
  consentGiven: { type: Boolean, required: true },
}, { timestamps: true });

export default mongoose.model<IStressRecord>('StressRecord', StressRecordSchema);
