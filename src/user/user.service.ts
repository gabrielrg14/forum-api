import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/database/prisma.service';
import { ExceptionService } from 'src/exception/exception.service';
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
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
    ) {}

    private readonly hashSalt = 10;
    private readonly userSelect = {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
    };

    async createUser(data: CreateUserDTO): Promise<UserDTO> {
        const { email, password, passwordConfirmation } = data;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user) this.exceptionService.emailConflict(email);

        if (password !== passwordConfirmation)
            this.exceptionService.passwordConfirmationNotMatch();
        delete data.passwordConfirmation;

        const passwordHash = await bcrypt.hashSync(password, this.hashSalt);

        try {
            return await this.prisma.user.create({
                data: { ...data, password: passwordHash },
                select: this.userSelect,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('user', 'created');
        }
    }

    async getUsers(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<UserDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.user.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.userSelect,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('users', 'found');
        }
    }

    async getUser(where: Prisma.UserWhereUniqueInput): Promise<UserDTO> {
        try {
            const userFound = await this.prisma.user.findUnique({
                where,
                select: this.userSelect,
            });
            if (!userFound)
                this.exceptionService.subjectNotFound<Prisma.UserWhereUniqueInput>(
                    'User',
                    where,
                );
            return userFound;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDTO;
    }): Promise<UserDTO> {
        const { where, data } = params;

        const user = await this.prisma.user.findUnique({ where });
        if (!user)
            this.exceptionService.subjectNotFound<Prisma.UserWhereUniqueInput>(
                'User',
                where,
            );

        if (data.email) {
            const userEmail = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (userEmail && userEmail.id !== user.id)
                this.exceptionService.emailConflict(data.email);
        }

        try {
            return await this.prisma.user.update({
                where,
                data,
                select: this.userSelect,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('user', 'updated');
        }
    }

    async updateUserPassword(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserPasswordDTO;
    }): Promise<UserDTO> {
        const { where, data } = params;

        if (data.password !== data.passwordConfirmation)
            this.exceptionService.passwordConfirmationNotMatch();

        const user = await this.prisma.user.findUnique({ where });
        if (!user)
            this.exceptionService.subjectNotFound<Prisma.UserWhereUniqueInput>(
                'User',
                where,
            );

        const isMatch = bcrypt.compareSync(data.currentPassword, user.password);
        if (!isMatch)
            throw new UnauthorizedException('Invalid current password!');

        const passwordHash = await bcrypt.hashSync(
            data.password,
            this.hashSalt,
        );

        try {
            return await this.prisma.user.update({
                where,
                data: { password: passwordHash },
                select: this.userSelect,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('password', 'changed');
        }
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
        const user = await this.prisma.user.findUnique({ where });
        if (!user)
            this.exceptionService.subjectNotFound<Prisma.UserWhereUniqueInput>(
                'User',
                where,
            );

        try {
            await this.prisma.user.delete({ where });
        } catch (error) {
            this.exceptionService.somethingBadHappened('user', 'deleted');
        }
    }
}
