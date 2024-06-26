import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
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

    @Post('/signup')
    signUpUser(@Body() userData: CreateUserDTO): Promise<UserDTO> {
        return this.userService.createUser(userData);
    }

    @Get()
    getAllUsers(): Promise<UserDTO[]> {
        return this.userService.getUsers({});
    }

    @Get('/:uuid')
    getOneUser(@Param('uuid', ParseUUIDPipe) userId: string): Promise<UserDTO> {
        return this.userService.getUser({ id: userId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateUser(
        @Param('uuid', ParseUUIDPipe) userId: string,
        @Body() userData: UpdateUserDTO,
    ): Promise<UserDTO> {
        return this.userService.updateUser({
            where: { id: userId },
            data: userData,
        });
    }

    @Patch('/password/:uuid')
    @UseGuards(AuthGuard)
    updateUserPassword(
        @Param('uuid', ParseUUIDPipe) userId: string,
        @Body() userPasswordData: UpdateUserPasswordDTO,
    ): Promise<UserDTO> {
        return this.userService.updateUserPassword({
            where: { id: userId },
            data: userPasswordData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteUser(@Param('uuid', ParseUUIDPipe) userId: string): Promise<void> {
        return this.userService.deleteUser({ id: userId });
    }
}
