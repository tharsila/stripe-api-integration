// src/services/UserService.ts
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';

/* const userRepository = new UserRepository(); */

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.getAll();
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.getById(id);
    }

    async createUser(data: User): Promise<User> {
        const { name, email } = data;
        return await this.userRepository.create(name, email);
    }

    async updateUser(id: number, data: User): Promise<User | null> {
        const { name, email } = data;
        return await this.userRepository.update(id, name, email);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.remove(id);
    }
}
