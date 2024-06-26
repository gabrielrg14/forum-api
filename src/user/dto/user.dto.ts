import { User } from '@prisma/client';

export class UserDTO implements Omit<User, 'password'> {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
