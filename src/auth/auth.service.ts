import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO, AuthTokenDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements AuthRepository {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    private readonly invalidCredentialsMessage = 'Invalid credentials.';

    async authUser(authData: AuthDTO): Promise<AuthTokenDTO> {
        const { email, password } = authData;

        const user = await this.userService.getUserPassword({ email });
        if (!user)
            throw new UnauthorizedException(this.invalidCredentialsMessage);

        const passwordMatch = await bcrypt.compareSync(password, user.password);
        if (!passwordMatch)
            throw new UnauthorizedException(this.invalidCredentialsMessage);

        const payload = { sub: user.id };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
