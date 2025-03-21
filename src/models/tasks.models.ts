import mongoose, { Schema, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           description: Task title
 *         description:
 *           type: string
 *           description: Task description
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *           default: pending
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           default: medium
 *         dueDate:
 *           type: string
 *           format: date
 *         assignedUsers:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export interface ITask extends Document {
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate: Date;
    assignedUsers: mongoose.Types.ObjectId[];
  }
  
  const TaskSchema: Schema<ITask> = new Schema(
    {
      title: { type: String, required: true },
      description: { type: String },
      status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
      priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
      dueDate: { type: Date },
      assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
  );
  
  export const Task = mongoose.model<ITask>("Task", TaskSchema);
  