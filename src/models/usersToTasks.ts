import mongoose, { Schema, Document } from "mongoose";

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
  