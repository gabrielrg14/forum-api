import { Prisma, User } from '@prisma/client';

export abstract class UserRepository {
    abstract getUser(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null>;

    abstract getUsers(params: {
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]>;

    abstract createUser(data: Prisma.UserCreateInput): Promise<User>;

    abstract updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User>;

    abstract deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User>;
}
