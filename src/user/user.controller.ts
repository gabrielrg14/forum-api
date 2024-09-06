import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Request,
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
import { RequestTokenDTO } from 'src/auth/dto';
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
        return this.userService.getUniqueUser({ id: userId });
    }

    @Put()
    @UseGuards(AuthGuard)
    updateUser(
        @Request() req: RequestTokenDTO,
        @Body() userData: UpdateUserDTO,
    ): Promise<UserDTO> {
        return this.userService.updateUser(req.token.sub, userData);
    }

    @Patch('/password')
    @UseGuards(AuthGuard)
    updateUserPassword(
        @Request() req: RequestTokenDTO,
        @Body() userPasswordData: UpdateUserPasswordDTO,
    ): Promise<UserDTO> {
        return this.userService.updateUserPassword(
            req.token.sub,
            userPasswordData,
        );
    }

    @Delete()
    @UseGuards(AuthGuard)
    deleteUser(@Request() req: RequestTokenDTO): Promise<void> {
        return this.userService.deleteUser(req.token.sub);
    }
}
