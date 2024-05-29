// src/services/UserService.ts
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { StripeService } from './stripe.service';

/* const userRepository = new UserRepository(); */

export class UserService {
    constructor(
        private userRepository: UserRepository,
        private stripeService: StripeService
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.getAll();
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.getById(id);
    }

    async createUser(data: User): Promise<User> {
        const { name, email } = data;
        const customer = await this.stripeService.createStripeCustomer(email, name);
        return await this.userRepository.create(name, email, customer.id);
    }

    async updateUser(id: string, data: User): Promise<User | null> {
        const { name, email } = data;
        return await this.userRepository.update(id, name, email);
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.remove(id);
    }
}
