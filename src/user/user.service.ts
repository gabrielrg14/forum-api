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
    constructor(private readonly prisma: PrismaService) {}

    private readonly hashSalt = 10;
    private readonly userSelect = {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
    };

    private readonly conflictMessage = (email: string): string => {
        return `A user with the email ${email} is already registered.`;
    };
    private readonly badRequestMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        where: Prisma.UserWhereUniqueInput,
    ): string => {
        return `User ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };

    async createUser(data: CreateUserDTO): Promise<UserDTO> {
        const { email, password } = data;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user) throw new ConflictException(this.conflictMessage(email));

        const passwordHash = await bcrypt.hashSync(password, this.hashSalt);

        const userCreated = await this.prisma.user.create({
            data: { ...data, password: passwordHash },
            select: this.userSelect,
        });
        if (!userCreated)
            throw new BadRequestException(
                this.badRequestMessage('user', 'created'),
            );

        return userCreated;
    }

    async getUsers(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<UserDTO[]> {
        const { skip, take, where, orderBy } = params;

        const usersFound = await this.prisma.user.findMany({
            skip,
            take,
            where,
            orderBy,
            select: this.userSelect,
        });
        if (!usersFound)
            throw new BadRequestException(
                this.badRequestMessage('users', 'found'),
            );

        return usersFound;
    }

    async getUser(where: Prisma.UserWhereUniqueInput): Promise<UserDTO> {
        const userFound = await this.prisma.user.findUnique({
            where,
            select: this.userSelect,
        });
        if (!userFound)
            throw new NotFoundException(this.notFoundMessage(where));
        return userFound;
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDTO;
    }): Promise<UserDTO> {
        const { where, data } = params;

        const user = await this.prisma.user.findUnique({ where });
        if (!user) throw new NotFoundException(this.notFoundMessage(where));

        if (data.email) {
            const userEmail = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (userEmail && userEmail.id !== user.id)
                throw new ConflictException(this.conflictMessage(data.email));
        }

        const updatedUser = await this.prisma.user.update({
            where,
            data,
            select: this.userSelect,
        });
        if (!updatedUser)
            throw new BadRequestException(
                this.badRequestMessage('user', 'updated'),
            );

        return updatedUser;
    }

    async updateUserPassword(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserPasswordDTO;
    }): Promise<UserDTO> {
        const { where, data } = params;

        const user = await this.prisma.user.findUnique({ where });
        if (!user) throw new NotFoundException(this.notFoundMessage(where));

        const passwordHash = await bcrypt.hashSync(
            data.password,
            this.hashSalt,
        );

        const updatedUser = await this.prisma.user.update({
            where,
            data: { password: passwordHash },
            select: this.userSelect,
        });
        if (!updatedUser)
            throw new BadRequestException(
                this.badRequestMessage('password', 'changed'),
            );

        return updatedUser;
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
        const user = await this.prisma.user.findUnique({ where });
        if (!user) throw new NotFoundException(this.notFoundMessage(where));

        const deletedUser = await this.prisma.user.delete({ where });
        if (!deletedUser)
            throw new BadRequestException(
                this.badRequestMessage('user', 'deleted'),
            );
    }
}
