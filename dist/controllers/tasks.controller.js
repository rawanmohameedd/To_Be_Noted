"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskHistory = exports.addTaskComment = exports.getUserTasks = exports.deleteTask = exports.updateTask = exports.getTask = exports.createTask = void 0;
const tasks_models_1 = require("../models/tasks.models");
const tasksHistoy_models_1 = require("../models/tasksHistoy.models");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const taskComments_models_1 = require("../models/taskComments.models");
// validate input for create and update task
const createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters long'),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['pending', 'in-progress', 'completed']).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high']).optional(),
    dueDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, must be YYYY-MM-DD").optional(),
    assignedUsers: zod_1.z.array(zod_1.z.string()).optional(),
});
const updateTaskSchema = createTaskSchema.partial();
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = createTaskSchema.parse(req.body);
        const task = yield tasks_models_1.Task.create(validatedData);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createTask = createTask;
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield tasks_models_1.Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTask = getTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = updateTaskSchema.parse(req.body);
        const task = yield tasks_models_1.Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        const oldStatus = task.status;
        Object.assign(task, validatedData);
        yield task.save();
        if (oldStatus !== task.status) {
            yield tasksHistoy_models_1.TaskHistory.create({
                taskId: task._id,
                updatedBy: req.user.userId,
                oldStatus,
                newStatus: task.status,
            });
        }
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield tasks_models_1.Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        // Delete associated task history
        yield tasksHistoy_models_1.TaskHistory.deleteMany({ taskId: task._id });
        // Delete associated comments
        yield taskComments_models_1.TaskComment.deleteMany({ taskId: task._id });
        res.json({ message: 'Task and associated data deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTask = deleteTask;
const getUserTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, dueDate, page = 1, limit = 10 } = req.query;
        const userId = req.params.userId;
        const matchStage = { assignedUsers: new mongoose_1.default.Types.ObjectId(userId) };
        if (status)
            matchStage.status = status;
        if (dueDate)
            matchStage.dueDate = { $lte: new Date(dueDate) };
        const tasks = yield tasks_models_1.Task.aggregate([
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserTasks = getUserTasks;
const addTaskComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.id;
        const comment = req.body.comment;
        const userId = req.user.userId;
        if (!taskId || !comment) {
            res.status(400).json({ message: "Task ID and comment are required" });
            return;
        }
        const newComment = yield taskComments_models_1.TaskComment.create({
            taskId: new mongoose_1.default.Types.ObjectId(taskId),
            userId,
            comment,
        });
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
exports.addTaskComment = addTaskComment;
const getTaskHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.id;
        const history = yield tasksHistoy_models_1.TaskHistory.aggregate([
            { $match: { taskId: new mongoose_1.default.Types.ObjectId(taskId) } },
            { $sort: { timestamp: -1 } }, // Sort by most recent change
            {
                $lookup: {
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
        const comments = yield taskComments_models_1.TaskComment.aggregate([
            { $match: { taskId: new mongoose_1.default.Types.ObjectId(taskId) } },
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getTaskHistory = getTaskHistory;
