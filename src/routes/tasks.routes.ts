import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { createTask, getTask, updateTask, deleteTask, getUserTasks } from '../controllers/tasks.controller';

const router = express.Router();

router.post('/tasks', authenticateUser, authorizeRoles(['admin', 'manager']), createTask);
router.get('/tasks/:id', authenticateUser, getTask);
router.put('/tasks/:id', authenticateUser, authorizeRoles(['admin', 'manager']), updateTask);
router.delete('/tasks/:id', authenticateUser, authorizeRoles(['admin']), deleteTask);
router.get('/tasks/user/:userId', authenticateUser, getUserTasks);

export default router;
