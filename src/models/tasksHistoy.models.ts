import mongoose, { Schema, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskHistory:
 *       type: object
 *       required:
 *         - taskId
 *         - updatedBy
 *         - oldStatus
 *         - newStatus
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         taskId:
 *           type: string
 *           description: ID of the associated task
 *         updatedBy:
 *           type: string
 *           description: ID of the user who updated the task
 *         oldStatus:
 *           type: string
 *           description: The previous status of the task
 *         newStatus:
 *           type: string
 *           description: The new status of the task
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The time when the status was updated
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated update timestamp
 */
export interface ITaskHistory extends Document {
  taskId: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  oldStatus: string;
  newStatus: string;
  timestamp: Date;
}

const TaskHistorySchema: Schema<ITaskHistory> = new Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    oldStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TaskHistory = mongoose.model<ITaskHistory>("TaskHistory", TaskHistorySchema);