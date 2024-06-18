import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserRepository } from './user.repository';
import { Prisma, User } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO, UpdateUserPasswordDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements UserRepository {
    constructor(private prisma: PrismaService) {}

    private readonly hashSalt = 10;

    getUser(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        return this.prisma.user.findUnique({ where: userWhereUniqueInput });
    }

    getUsers(params: {
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { where, orderBy } = params;
        return this.prisma.user.findMany({ where, orderBy });
    }

    async createUser(data: CreateUserDTO): Promise<User> {
        const passwordHash = await bcrypt.hash(data.password, this.hashSalt);
        return this.prisma.user.create({
            data: { ...data, password: passwordHash },
        });
    }

    updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDTO;
    }): Promise<User> {
        const { where, data } = params;
        return this.prisma.user.update({ where, data });
    }

    async updateUserPassword(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserPasswordDTO;
    }): Promise<User> {
        const { where, data } = params;
        const passwordHash = await bcrypt.hash(data.password, this.hashSalt);
        return this.prisma.user.update({
            where,
            data: { password: passwordHash },
        });
    }

    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({ where });
    }
}
