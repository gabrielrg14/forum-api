import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserRepository } from './user.repository';
import { Prisma, User } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO, UpdateUserPasswordDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements UserRepository {
    constructor(private prisma: PrismaService) {}

    private readonly hashSalt = 10;

    async getUsers(params: {
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { where, orderBy } = params;

        const users = await this.prisma.user.findMany({ where, orderBy });
        if (!users) throw new NotFoundException('Users not found.');

        return users;
    }

    async getUser(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
        if (!user) throw new NotFoundException('User not found.');
        return user;
    }

    async createUser(data: CreateUserDTO): Promise<User> {
        const passwordHash = await bcrypt.hash(data.password, this.hashSalt);

        const userCreated = await this.prisma.user.create({
            data: { ...data, password: passwordHash },
        });
        if (!userCreated)
            throw new BadRequestException(
                'Something bad happened and the user was not created.',
            );

        return userCreated;
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDTO;
    }): Promise<User> {
        const { where, data } = params;

        const userUpdated = await this.prisma.user.update({ where, data });
        if (!userUpdated)
            throw new BadRequestException(
                'Something bad happened and the user was not updated.',
            );

        return userUpdated;
    }

    async updateUserPassword(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserPasswordDTO;
    }): Promise<User> {
        const { where, data } = params;

        const passwordHash = await bcrypt.hash(data.password, this.hashSalt);
        const userUpdated = await this.prisma.user.update({
            where,
            data: { password: passwordHash },
        });
        if (!userUpdated)
            throw new BadRequestException(
                'Something bad happened and the password was not changed.',
            );

        return userUpdated;
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
        const userDeleted = await this.prisma.user.delete({ where });
        if (!userDeleted)
            throw new BadRequestException(
                'Something bad happened and the user was not deleted.',
            );
    }
}
