
import mongoose, { Schema, Document } from 'mongoose';

// Define the Organisation interface extending Mongoose's Document
export interface IOrganisation extends Document {
  name: string;
  code: string;
}

const OrganisationSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model<IOrganisation>('Organisation', OrganisationSchema);
