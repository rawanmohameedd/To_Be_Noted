import mongoose, { Schema, Document } from "mongoose";

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
  