import mongoose, { Schema, Document } from "mongoose";

export interface ISystemSetting extends Document {
  key: string;
  value: any;
  category: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SystemSettingsSchema = new Schema<ISystemSetting>(
  {
    key: { type: String, required: true, unique: true, index: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    category: {
      type: String,
      default: "operations",
      index: true,
    },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

SystemSettingsSchema.index({ category: 1, updatedAt: -1 });

const SystemSettings =
  mongoose.models.SystemSettings ||
  mongoose.model<ISystemSetting>("SystemSettings", SystemSettingsSchema);

export default SystemSettings;
