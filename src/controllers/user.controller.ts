import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

class UserController {
    constructor(private readonly userService: UserService) {}

    async getAll(req: Request, res: Response): Promise<void> {
        const users = await this.userService.getAllUsers();
        res.json(users);
    }

    async getById(req: Request, res: Response): Promise<void> {
        const user = await this.userService.getUserById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        const user = await this.userService.createUser(req.body);
        res.status(201).json(user);
    }

    async update(req: Request, res: Response): Promise<void> {
        const user = await this.userService.updateUser(req.params.id, req.body);
        res.json(user);
    }

    async delete(req: Request, res: Response): Promise<void> {
        await this.userService.deleteUser(req.params.id);
        res.status(204).send();
    }
}

export default UserController;
