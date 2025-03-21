import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    message: string;
    isRead: boolean;
    timestamp: Date;
  }
  
  const NotificationSchema: Schema<INotification> = new Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
  