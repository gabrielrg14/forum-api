import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getUsers(): Promise<UserModel[]> {
        const getUsers = await this.userService.getUsers({});

        if (!getUsers) throw new Error('User not found.');
        return getUsers;
    }

    @Get('/:id')
    async getUserById(@Param('id') userId: string): Promise<UserModel> {
        const getUser = await this.userService.getUser({ id: userId });

        if (!getUser) throw new Error('User not found.');
        return getUser;
    }

    @Post()
    async signupUser(@Body() userData: UserModel): Promise<UserModel> {
        const userCreated = await this.userService.createUser(userData);

        if (!userCreated) throw new Error('User has not been created.');
        return userCreated;
    }

    @Patch('/:id')
    async updateUser(
        @Param('id') userId: string,
        @Body() userData: UserModel,
    ): Promise<UserModel> {
        const userUpdated = await this.userService.updateUser({
            where: { id: userId },
            data: userData,
        });

        if (!userUpdated) throw new Error('User has not been created.');
        return userUpdated;
    }

    @Delete('/:id')
    async deleteUser(@Param('id') userId: string): Promise<void> {
        const userDeleted = await this.userService.deleteUser({ id: userId });

        if (!userDeleted) throw new Error('The user has not been deleted');
    }
}
