import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, AuthTokenDTO } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signInUser(@Body() authData: AuthDTO): Promise<AuthTokenDTO> {
        return this.authService.signIn(authData);
    }
}
