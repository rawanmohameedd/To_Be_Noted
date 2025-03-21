import mongoose, { Schema, Document } from "mongoose";

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
  