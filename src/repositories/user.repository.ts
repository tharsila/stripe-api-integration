// src/repositories/UserRepository.ts
import { PrismaClient } from '@prisma/client';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

export class UserRepository {
    async create(name: string, email: string): Promise<User> {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
            },
        });

        return newUser;
    }

    async getAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users;
    }

    async getById(id: number): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) return null;
        return user;
    }

    async update(
        id: number,
        name: string,
        email: string
    ): Promise<User | null> {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                email,
            },
        });
        if (!updatedUser) return null;
        return updatedUser;
    }

    async remove(id: number): Promise<void> {
        await prisma.user.delete({
            where: {
                id,
            },
        });
    }
}
