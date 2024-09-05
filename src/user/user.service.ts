import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/database/prisma.service';
import { ExceptionService } from 'src/exception/exception.service';
import {
    UserDTO,
    UserPasswordDTO,
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
    public readonly selectUser = {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
    };

    async createUser(data: CreateUserDTO): Promise<UserDTO> {
        const { email, password, passwordConfirmation } = data;

        const user = await this.getFirstUser({ email });
        if (user) this.exceptionService.emailConflict(email);

        if (password !== passwordConfirmation)
            this.exceptionService.passwordConfirmationNotMatch();
        delete data.passwordConfirmation;

        const passwordHash = await bcrypt.hashSync(password, this.hashSalt);

        try {
            return await this.prisma.user.create({
                data: { ...data, password: passwordHash },
                select: this.selectUser,
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
                select: this.selectUser,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('users', 'found');
        }
    }

    async getUniqueUser(where: Prisma.UserWhereUniqueInput): Promise<UserDTO> {
        try {
            const userFound = await this.prisma.user.findUnique({
                where,
                select: this.selectUser,
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

    async getFirstUser(where: Prisma.UserWhereInput): Promise<UserDTO> {
        return await this.prisma.user.findFirst({
            where,
            select: this.selectUser,
        });
    }

    async getUserPassword(
        where: Prisma.UserWhereUniqueInput,
    ): Promise<UserPasswordDTO> {
        return await this.prisma.user.findUnique({
            where,
            select: {
                id: true,
                password: true,
            },
        });
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: UpdateUserDTO;
    }): Promise<UserDTO> {
        const { where, data } = params;

        const user = await this.getUniqueUser(where);

        if (data.email) {
            const userEmail = await this.getFirstUser({ email: data.email });
            if (userEmail && userEmail.id !== user.id)
                this.exceptionService.emailConflict(data.email);
        }

        try {
            return await this.prisma.user.update({
                where,
                data,
                select: this.selectUser,
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

        const user = await this.getUserPassword(where);
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
            return await this.updateUser({
                where,
                data: { password: passwordHash },
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('password', 'changed');
        }
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
        await this.getUniqueUser(where);

        try {
            await this.prisma.user.delete({ where });
        } catch (error) {
            this.exceptionService.somethingBadHappened('user', 'deleted');
        }
    }
}
