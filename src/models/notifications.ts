import mongoose, { Schema, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - userId
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         userId:
 *           type: string
 *           description: ID of the user receiving the notification
 *         message:
 *           type: string
 *           description: The content of the notification
 *         isRead:
 *           type: boolean
 *           default: false
 *           description: Whether the notification has been read
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The time when the notification was created
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated update timestamp
 */
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