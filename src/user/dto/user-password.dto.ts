import { User as UserModel } from '@prisma/client';

export class UserPasswordDTO implements Pick<UserModel, 'id' | 'password'> {
    id: string;
    password: string;
}
