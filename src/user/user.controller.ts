import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Query,
    Param,
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
    UserQueryParams,
    CreateUserDTO,
    UpdateUserDTO,
    UpdateUserPasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() userData: CreateUserDTO): Promise<UserDTO> {
        return this.userService.createUser(userData);
    }

    @Get()
    getAllUsers(@Query() query: UserQueryParams): Promise<UserDTO[]> {
        const where: Prisma.UserWhereInput = {};
        let skip: number | undefined = undefined;
        let take: number | undefined = undefined;

        if (query.search)
            where.OR = [
                {
                    name: { contains: query.search },
                    email: { contains: query.search },
                },
            ];

        if (query.page && query.pageSize) {
            const page = Math.max(0, Number(query.page) - 1);
            const pageSize = Number(query.pageSize);
            skip = page * pageSize;
            take = pageSize;
        }

        return this.userService.getUsers({
            skip,
            take,
            where,
            orderBy: { name: 'asc' },
        });
    }

    @Get('/:uuid')
    getUserById(
        @Param('uuid', ParseUUIDPipe) userId: string,
    ): Promise<UserDTO> {
        return this.userService.getUser({ id: userId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateUserById(
        @Param('uuid', ParseUUIDPipe) userId: string,
        @Body() userData: UpdateUserDTO,
    ): Promise<UserDTO> {
        return this.userService.updateUser({
            where: { id: userId },
            data: userData,
        });
    }

    @Patch('/:uuid/password')
    @UseGuards(AuthGuard)
    updateUserPasswordById(
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
    deleteUserById(
        @Param('uuid', ParseUUIDPipe) userId: string,
    ): Promise<void> {
        return this.userService.deleteUser({ id: userId });
    }
}
