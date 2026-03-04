
import mongoose, { Schema, Document } from 'mongoose';

export interface IBroadcast extends Document {
  message: string;
  type: 'ANNOUNCEMENT' | 'MAINTENANCE' | 'ALERT';
  authorId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
}

const BroadcastSchema: Schema = new Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['ANNOUNCEMENT', 'MAINTENANCE', 'ALERT'], default: 'ANNOUNCEMENT' },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IBroadcast>('Broadcast', BroadcastSchema);
