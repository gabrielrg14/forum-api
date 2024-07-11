import {
    Injectable,
    ConflictException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    UserDTO,
    CreateUserDTO,
    UpdateUserDTO,
    UpdateUserPasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements UserRepository {
    constructor(private prisma: PrismaService) {}

    private readonly hashSalt = 10;
    private readonly userSelect = {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
    };

    async createUser(data: CreateUserDTO): Promise<UserDTO> {
        const { email } = data;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user)
            throw new ConflictException(
                `A user with the email ${email} is already registered.`,
            );

        const passwordHash = await bcrypt.hashSync(
            data.password,
            this.hashSalt,
        );

        const userCreated = await this.prisma.user.create({
            data: { ...data, password: passwordHash },
            select: this.userSelect,
        });
        if (!userCreated)
            throw new BadRequestException(
                'Something bad happened and the user was not created.',
            );

        return userCreated;
    }

    async getUsers(params: {
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<UserDTO[]> {
        const { where, orderBy } = params;

        const users = await this.prisma.user.findMany({
            where,
            orderBy,
            select: this.userSelect,
        });
        if (!users)
            throw new BadRequestException(
                'Something bad happened and the users was not found.',
            );

        return users;
    }

    async getUser(where: Prisma.UserWhereUniqueInput): Promise<UserDTO> {
        const user = await this.prisma.user.findUnique({
            where,
            select: this.userSelect,
        });
        if (!user)
            throw new NotFoundException(
                `User ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );
        return user;
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDTO;
    }): Promise<UserDTO> {
        const { where, data } = params;

        const user = await this.prisma.user.findUnique({ where });
        if (!user)
            throw new NotFoundException(
                `User ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );

        if (data.email) {
            const emailUser = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (emailUser && emailUser.id !== user.id)
                throw new ConflictException(
                    `A user with the email ${data.email} is already registered.`,
                );
        }

        const userUpdated = await this.prisma.user.update({
            where,
            data,
            select: this.userSelect,
        });
        if (!userUpdated)
            throw new BadRequestException(
                'Something bad happened and the user was not updated.',
            );

        return userUpdated;
    }

    async updateUserPassword(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserPasswordDTO;
    }): Promise<UserDTO> {
        const { where, data } = params;

        const user = await this.prisma.user.findUnique({ where });
        if (!user)
            throw new NotFoundException(
                `User ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );

        const passwordHash = await bcrypt.hashSync(
            data.password,
            this.hashSalt,
        );

        const userUpdated = await this.prisma.user.update({
            where,
            data: { password: passwordHash },
            select: this.userSelect,
        });
        if (!userUpdated)
            throw new BadRequestException(
                'Something bad happened and the password was not changed.',
            );

        return userUpdated;
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
        const user = await this.prisma.user.findUnique({ where });
        if (!user)
            throw new NotFoundException(
                `User ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );

        const userDeleted = await this.prisma.user.delete({ where });
        if (!userDeleted)
            throw new BadRequestException(
                'Something bad happened and the user was not deleted.',
            );
    }
}
