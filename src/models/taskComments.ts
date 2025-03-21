import mongoose, { Schema, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskComment:
 *       type: object
 *       required:
 *         - taskId
 *         - userId
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         taskId:
 *           type: string
 *           description: ID of the associated task
 *         userId:
 *           type: string
 *           description: ID of the user who made the comment
 *         comment:
 *           type: string
 *           description: The content of the comment
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The time when the comment was made
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated update timestamp
 */
export interface ITaskComment extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  comment: string;
  timestamp: Date;
}

const TaskCommentSchema: Schema<ITaskComment> = new Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TaskComment = mongoose.model<ITaskComment>("TaskComment", TaskCommentSchema);