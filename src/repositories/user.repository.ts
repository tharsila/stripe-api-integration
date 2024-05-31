// src/repositories/UserRepository.ts
import { PrismaClient } from '@prisma/client';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

export class UserRepository {
    async create(
        name: string,
        email: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        stripeSubscriptionStatus: string,
        stripePriceId: string
    ): Promise<User> {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                stripeCustomerId,
                stripeSubscriptionId,
                stripeSubscriptionStatus,
                stripePriceId,
            },
        });

        return newUser;
    }

    async getAll(): Promise<User[]> {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: {
                        Tasks: true,
                    },
                },
                Tasks: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
        return users;
    }

    async getById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) return null;
        return user;
    }

    async update(
        id: string,
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

    async remove(id: string): Promise<void> {
        await prisma.user.delete({
            where: {
                id,
            },
        });
    }

    async findByStripeCustomerId(stripeCustomerId: string) {
        const user = await prisma.user.findFirst({
            where: {
                stripeCustomerId,
            },
        });

        return user;
    }

    async updateStripeFields(
        id: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        stripeSubscriptionStatus?: string | undefined
    ) {
        return await prisma.user.update({
            where: { id },
            data: {
                stripeCustomerId,
                stripeSubscriptionId,
                stripeSubscriptionStatus,
            },
        });
    }

    async countUserTasks(id: string): Promise<{
        id: string;
        _count: {
            Tasks: number;
        };
    }> {
        return await prisma.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                stripeSubscriptionId: true,
                stripeSubscriptionStatus: true,
                _count: {
                    select: {
                        Tasks: true,
                    },
                },
            },
        });
    }
}
