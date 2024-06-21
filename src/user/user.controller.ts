import {
    Controller,
    UseGuards,
    Param,
    Body,
    Get,
    Post,
    Put,
    Patch,
    Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    UserDTO,
    CreateUserDTO,
    UpdateUserDTO,
    UpdateUserPasswordDTO,
} from './dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard)
    getUsers(): Promise<UserDTO[]> {
        return this.userService.getUsers({});
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    getUserById(@Param('id') userId: string): Promise<UserDTO> {
        return this.userService.getUser({ id: userId });
    }

    @Post('/signup')
    signupUser(@Body() userData: CreateUserDTO): Promise<UserDTO> {
        return this.userService.createUser(userData);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    updateUser(
        @Param('id') userId: string,
        @Body() userData: UpdateUserDTO,
    ): Promise<UserDTO> {
        return this.userService.updateUser({
            where: { id: userId },
            data: userData,
        });
    }

    @Patch('/password/:id')
    @UseGuards(AuthGuard)
    updateUserPassword(
        @Param('id') userId: string,
        @Body() userPasswordData: UpdateUserPasswordDTO,
    ): Promise<UserDTO> {
        return this.userService.updateUserPassword({
            where: { id: userId },
            data: userPasswordData,
        });
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteUser(@Param('id') userId: string): Promise<void> {
        return this.userService.deleteUser({ id: userId });
    }
}
