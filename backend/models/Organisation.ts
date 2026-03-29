
import mongoose, { Schema, Document } from 'mongoose';

// Define the Organisation interface extending Mongoose's Document
export interface IOrganisation extends Document {
  name: string;
  code: string;
  description?: string;
  mission?: string;
  history?: string;
  logo?: string;
  impactStories?: { title: string; content: string; image?: string }[];
  trackRecord?: string;
  foundedAt?: Date;
  adminInviteCode?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'DELETED';
  suspensionEnd?: Date;
  statusReason?: string;
}

const OrganisationSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  adminInviteCode: { type: String, unique: true, sparse: true },
  description: { type: String },
  mission: { type: String },
  history: { type: String },
  logo: { type: String },
  impactStories: [{
    title: { type: String },
    content: { type: String },
    image: { type: String }
  }],
  trackRecord: { type: String },
  foundedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'SUSPENDED', 'BANNED', 'DELETED'], 
    default: 'ACTIVE' 
  },
  suspensionEnd: { type: Date },
  statusReason: { type: String }
}, { timestamps: true });

export default mongoose.model<IOrganisation>('Organisation', OrganisationSchema);
