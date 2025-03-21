import mongoose, { Schema, Document } from "mongoose";

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
  