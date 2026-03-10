
import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalSettings extends Document {
  platformName: string;
  maintenanceMode: boolean;
  allowPublicRegistration: boolean;
  defaultStressCheckInterval: number; // in days
  updatedAt: Date;
}

const GlobalSettingsSchema: Schema = new Schema({
  platformName: { type: String, default: 'WhānauWell' },
  maintenanceMode: { type: Boolean, default: false },
  allowPublicRegistration: { type: Boolean, default: true },
  defaultStressCheckInterval: { type: Number, default: 7 },
}, { timestamps: true });

export default mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
