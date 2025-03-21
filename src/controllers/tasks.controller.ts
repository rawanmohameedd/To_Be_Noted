import { NextFunction, Request, Response } from 'express';
import { Task } from '../models/tasks.models';
import { TaskHistory } from '../models/tasksHistoy.models';
import { z } from 'zod';

// validate input for create and update task
const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional(),
  assignedUsers: z.array(z.string()).optional(),
});

const updateTaskSchema = createTaskSchema.partial();

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const task = await Task.create(validatedData);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(400).json({ message: error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, dueDate, page = 1, limit = 10 } = req.query;
    const filters: any = { assignedUsers: req.params.userId };
    if (status) filters.status = status;
    if (dueDate) filters.dueDate = { $lte: new Date(dueDate as string) };

    const tasks = await Task.find(filters)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
