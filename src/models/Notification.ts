import mongoose, { Schema, Document, Types } from "mongoose";

export type NotificationType = 
  | "meal" 
  | "payment" 
  | "gatepass" 
  | "maintenance" 
  | "notice" 
  | "system"
  | "laundry";

export type NotificationPriority = "low" | "normal" | "high";

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  relatedEntity?: {
    type: "maintenance" | "gatepass" | "payment" | "meal" | "laundry";
    id: Types.ObjectId;
  };
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["meal", "payment", "gatepass", "maintenance", "notice", "system", "laundry"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    relatedEntity: {
      type: {
        type: String,
        enum: ["maintenance", "gatepass", "payment", "meal", "laundry"],
      },
      id: {
        type: Schema.Types.ObjectId,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound index for efficient querying
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// Auto-expire old notifications after 30 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.models.Notification || 
  mongoose.model<INotification>("Notification", NotificationSchema);
