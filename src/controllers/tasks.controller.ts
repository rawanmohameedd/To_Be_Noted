import { NextFunction, Request, Response } from 'express';
import { Task } from '../models/tasks.models';
import { TaskHistory } from '../models/tasksHistoy.models';
import { z } from 'zod';
import mongoose from 'mongoose';
import { TaskComment } from '../models/taskComments.models';

// validate input for create and update task
const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, must be YYYY-MM-DD").optional(),
  assignedUsers: z.array(z.string()).optional(),
});

const updateTaskSchema = createTaskSchema.partial();

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const task = await Task.create(validatedData);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({message: (error as Error).message });
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const oldStatus = task.status;
    Object.assign(task, validatedData);
    await task.save();

    if (oldStatus !== task.status) {
      await TaskHistory.create({
        taskId: task._id,
        updatedBy: req.user!.userId,
        oldStatus,
        newStatus: task.status,
      });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Delete associated task history
    await TaskHistory.deleteMany({ taskId: task._id });

    // Delete associated comments
    await TaskComment.deleteMany({ taskId: task._id });

    res.json({ message: 'Task and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const { status, dueDate, page = 1, limit = 10 } = req.query;
    const userId = req.params.userId;

    const matchStage: any = { assignedUsers: new mongoose.Types.ObjectId(userId) };
    if (status) matchStage.status = status;
    if (dueDate) matchStage.dueDate = { $lte: new Date(dueDate as string) };

    const tasks = await Task.aggregate([
      { $match: matchStage },
      { $sort: { dueDate: -1 } }, // Sort by due date (latest first)
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "users",
          localField: "assignedUsers",
          foreignField: "_id",
          as: "assignedUsersDetails",
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          dueDate: 1,
          assignedUsersDetails: { _id: 1, name: 1, email: 1 },
        },
      },
    ]);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addTaskComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    const comment = req.body.comment;
    const userId = req.user!.userId;

    if (!taskId || !comment) {
      res.status(400).json({ message: "Task ID and comment are required" });
      return;
    }

    const newComment = await TaskComment.create({
      taskId: new mongoose.Types.ObjectId(taskId),
      userId,
      comment,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getTaskHistory = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    
    const history = await TaskHistory.aggregate([
      { $match: { taskId: new mongoose.Types.ObjectId(taskId) } },
      { $sort: { timestamp: -1 } }, // Sort by most recent change
      {
      $lookup: { // fetch user details
        from: "users",
        localField: "updatedBy",
        foreignField: "_id",
        as: "updatedByUser",
      },
      },
      {
      $project: {
        oldStatus: 1,
        newStatus: 1,
        timestamp: 1,
        updatedByUser: { _id: 1, name: 1, email: 1 },
      },
      },
    ]);

    const comments = await TaskComment.aggregate([
      { $match: { taskId: new mongoose.Types.ObjectId(taskId) } },
      { $sort: { timestamp: -1 } }, // Sort by most recent comment
      {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
      },
      {
      $project: {
        comment: 1,
        timestamp: 1,
        userDetails: { _id: 1, name: 1, email: 1 },
      },
      },
    ]);

    res.json({ history, comments });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
