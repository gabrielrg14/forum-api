import { User as UserModel } from '@prisma/client';

export class UserDTO implements Omit<UserModel, 'password'> {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
