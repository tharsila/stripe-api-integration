// src/services/UserService.ts
import { Task } from '@/models/task.model';
import { TaskRepository } from '@/repositories/task.repository';
import { UserRepository } from '@/repositories/user.repository';

/* const userRepository = new UserRepository(); */

export class TaskService {
    constructor(
        private taskRepository: TaskRepository,
        private readonly userRepository: UserRepository
    ) {}

    async getAll(): Promise<Task[] | null> {
        return await this.taskRepository.getAll();
    }

    async getById(id: string): Promise<Task | null> {
        return await this.taskRepository.getById(id);
    }

    async create(userId: string, data: Task): Promise<Task> {
        const { title, description } = data;
        const userExists = await this.userRepository.getById(userId);

        if (!userExists) {
            throw new Error(`User ${userExists} does not exist`);
        }

        const countUserTasks = await this.userRepository.countUserTasks(userId);
        const hasQuotaAvailable = countUserTasks._count.Tasks < 5;
        
        const hasActiveSubscription =
            !!userExists.stripeSubscriptionId &&
            userExists.stripeSubscriptionStatus === 'active';

        console.log({
            hasActiveSubscription,
            hasQuotaAvailable
        })

        if (!hasQuotaAvailable && !hasActiveSubscription) {
            throw new Error('Not quota available. Please upgrade your plan');
        }

        return await this.taskRepository.create(title, description, userId);
    }

    async update(id: string, data: Task): Promise<Task> {
        const { title, description } = data;
        return await this.taskRepository.update(id, title, description);
    }

    async remove(id: string): Promise<void> {
        return await this.taskRepository.remove(id);
    }
}
