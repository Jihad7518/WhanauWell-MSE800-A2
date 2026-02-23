
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'COORDINATOR' | 'MEMBER';
  organisationId: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'ORG_ADMIN', 'COORDINATOR', 'MEMBER'], 
    default: 'MEMBER' 
  },
  organisationId: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
