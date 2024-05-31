// src/routes.ts
import { Router } from 'express';
import TaskController from '@/controllers/task.controller';
import { TaskService } from '@/services/task.service';
import { TaskRepository } from '@/repositories/task.repository';
import { UserRepository } from '@/repositories/user.repository';

const router = Router();
const userRepository = new UserRepository();
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository, userRepository);
const taskController = new TaskController(taskService);

router.get('/tasks', taskController.getAll.bind(taskController));
router.get('/tasks/:id', taskController.getById.bind(taskController));
router.post('/tasks/:userId', taskController.create.bind(taskController));
router.put('/tasks/:id', taskController.update.bind(taskController));
router.delete('/tasks/:id', taskController.remove.bind(taskController));

export default router;
