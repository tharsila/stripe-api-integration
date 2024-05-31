import { Request, Response } from 'express';
import { TaskService } from '@/services/task.service';

class TaskController {
    constructor(private readonly taskService: TaskService) {}

    async getAll(req: Request, res: Response): Promise<void> {
        const users = await this.taskService.getAll();
        res.json(users);
    }

    async getById(req: Request, res: Response): Promise<void> {
        const user = await this.taskService.getById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.taskService.create(
                req.params.userId,
                req.body
            );
            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        const user = await this.taskService.update(req.params.id, req.body);
        res.json(user);
    }

    async remove(req: Request, res: Response): Promise<void> {
        await this.taskService.remove(req.params.id);
        res.status(204).send();
    }
}

export default TaskController;
