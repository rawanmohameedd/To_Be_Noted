import mongoose, { Schema, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserTask:
 *       type: object
 *       required:
 *         - userId
 *         - taskId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         userId:
 *           type: string
 *           description: ID of the user assigned to the task
 *         taskId:
 *           type: string
 *           description: ID of the task assigned to the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated update timestamp
 */
export interface IUserTask extends Document {
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
}

const UserTaskSchema: Schema<IUserTask> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

export const UserTask = mongoose.model<IUserTask>("UserTask", UserTaskSchema);