import { User } from '@/models/user.model';

export class UserCreate implements User {
    name: string;
    email: string;
}
