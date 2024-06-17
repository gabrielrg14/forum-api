import {
    Controller,
    NotFoundException,
    Param,
    Body,
    Get,
    Post,
    Put,
    Patch,
    Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    async updateUser(
        userId: string,
        userData: UpdateUserDTO,
    ): Promise<UserModel> {
        const userUpdated = await this.userService.updateUser({
            where: { id: userId },
            data: userData,
        });

        if (!userUpdated)
            throw new NotFoundException('User has not been updated.');
        return userUpdated;
    }

    @Get()
    async getUsers(): Promise<UserModel[]> {
        const getUsers = await this.userService.getUsers({});

        if (!getUsers) throw new NotFoundException('Users not found.');
        return getUsers;
    }

    @Get('/:id')
    async getUserById(@Param('id') userId: string): Promise<UserModel> {
        const getUser = await this.userService.getUser({ id: userId });

        if (!getUser) throw new NotFoundException('User not found.');
        return getUser;
    }

    @Post()
    async signupUser(@Body() userData: CreateUserDTO): Promise<UserModel> {
        const userCreated = await this.userService.createUser(userData);

        if (!userCreated)
            throw new NotFoundException('User has not been created.');
        return userCreated;
    }

    @Put('/:id')
    async putUser(
        @Param('id') userId: string,
        @Body() userData: UpdateUserDTO,
    ): Promise<UserModel> {
        return this.updateUser(userId, userData);
    }

    @Patch('/:id')
    async patchUser(
        @Param('id') userId: string,
        @Body() userData: UpdateUserDTO,
    ): Promise<UserModel> {
        return this.updateUser(userId, userData);
    }

    @Delete('/:id')
    async deleteUser(@Param('id') userId: string): Promise<void> {
        const userDeleted = await this.userService.deleteUser({ id: userId });

        if (!userDeleted)
            throw new NotFoundException('The user has not been deleted');
    }
}
