
import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemLog extends Document {
  event: string;
  details: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  organisationId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SystemLogSchema: Schema = new Schema({
  event: { type: String, required: true },
  details: { type: String },
  type: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'], default: 'INFO' },
  organisationId: { type: Schema.Types.ObjectId, ref: 'Organisation' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model<ISystemLog>('SystemLog', SystemLogSchema);
