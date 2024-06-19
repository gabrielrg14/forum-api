import {
    Controller,
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
import { CreateUserDTO, UpdateUserDTO, UpdateUserPasswordDTO } from './dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getUsers(): Promise<UserModel[]> {
        return this.userService.getUsers({});
    }

    @Get('/:id')
    getUserById(@Param('id') userId: string): Promise<UserModel> {
        return this.userService.getUser({ id: userId });
    }

    @Post('/signup')
    signupUser(@Body() userData: CreateUserDTO): Promise<UserModel> {
        return this.userService.createUser(userData);
    }

    @Put('/:id')
    updateUser(
        @Param('id') userId: string,
        @Body() userData: UpdateUserDTO,
    ): Promise<UserModel> {
        return this.userService.updateUser({
            where: { id: userId },
            data: userData,
        });
    }

    @Patch('/:id/password')
    updateUserPassword(
        @Param('id') userId: string,
        @Body() userPasswordData: UpdateUserPasswordDTO,
    ): Promise<UserModel> {
        return this.userService.updateUserPassword({
            where: { id: userId },
            data: userPasswordData,
        });
    }

    @Delete('/:id')
    deleteUser(@Param('id') userId: string): Promise<void> {
        return this.userService.deleteUser({ id: userId });
    }
}
