
import mongoose, { Schema, Document } from 'mongoose';

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
}

const OrganisationSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
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
  foundedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model<IOrganisation>('Organisation', OrganisationSchema);
