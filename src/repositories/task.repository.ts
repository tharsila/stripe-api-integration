// src/repositories/UserRepository.ts
import { PrismaClient } from '@prisma/client';
import { Task } from '@/models/task.model';

const prisma = new PrismaClient();

export class TaskRepository {
    async create(
        title: string,
        description: string,
        userId: string
    ): Promise<Task> {
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                User: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        return newTask;
    }

    async getAll(): Promise<Task[]> {
        const tasks = await prisma.task.findMany({
            include: {
                User: {},
            },
        });
        return tasks;
    }

    async getById(id: string): Promise<Task | null> {
        const task = await prisma.task.findUnique({
            where: {
                id,
            },
        });
        return task;
    }

    async update(
        id: string,
        title: string,
        description: string
    ): Promise<Task | null> {
        const updatedTask = await prisma.task.update({
            where: {
                id,
            },
            data: {
                title,
                description,
            },
        });
        return updatedTask;
    }

    async remove(id: string): Promise<void> {
        await prisma.task.delete({
            where: {
                id,
            },
        });
    }
}
