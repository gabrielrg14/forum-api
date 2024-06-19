import { Prisma, User } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO, UpdateUserPasswordDTO } from './dto';

export abstract class UserRepository {
    abstract getUser(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User>;

    abstract getUsers(params: {
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]>;

    abstract createUser(data: CreateUserDTO): Promise<User>;

    abstract updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDTO;
    }): Promise<User>;

    abstract updateUserPassword(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserPasswordDTO;
    }): Promise<User>;

    abstract deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void>;
}
