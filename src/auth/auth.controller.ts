import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    @HttpCode(200)
    signin(@Body() authData: AuthDTO): Promise<Omit<User, 'password'>> {
        return this.authService.signin(authData);
    }
}
