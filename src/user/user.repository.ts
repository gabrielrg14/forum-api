import {
    UserDTO,
    UserPasswordDTO,
    CreateUserDTO,
    UpdateUserDTO,
    UpdateUserPasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';

export abstract class UserRepository {
    abstract createUser(data: CreateUserDTO): Promise<UserDTO>;

    abstract getUsers(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<UserDTO[]>;

    abstract getUniqueUser(
        where: Prisma.UserWhereUniqueInput,
    ): Promise<UserDTO>;

    abstract getFirstUser(where: Prisma.UserWhereInput): Promise<UserDTO>;

    abstract getUserPassword(
        where: Prisma.UserWhereUniqueInput,
    ): Promise<UserPasswordDTO>;

    abstract updateUser(userId: string, data: UpdateUserDTO): Promise<UserDTO>;

    abstract updateUserPassword(
        userId: string,
        data: UpdateUserPasswordDTO,
    ): Promise<UserDTO>;

    abstract deleteUser(userId: string): Promise<void>;
}
