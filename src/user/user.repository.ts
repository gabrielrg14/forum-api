import { Prisma } from '@prisma/client';
import {
    UserDTO,
    CreateUserDTO,
    UpdateUserDTO,
    UpdateUserPasswordDTO,
} from './dto';

export abstract class UserRepository {
    abstract createUser(data: CreateUserDTO): Promise<UserDTO>;

    abstract getUsers(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<UserDTO[]>;

    abstract getUser(where: Prisma.UserWhereUniqueInput): Promise<UserDTO>;

    abstract updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDTO;
    }): Promise<UserDTO>;

    abstract updateUserPassword(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserPasswordDTO;
    }): Promise<UserDTO>;

    abstract deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void>;
}
