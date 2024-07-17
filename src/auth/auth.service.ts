import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO, AuthTokenDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements AuthRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    private readonly invalidMessage = 'Invalid credentials.';

    async authUser(authData: AuthDTO): Promise<AuthTokenDTO> {
        const { email, password } = authData;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) throw new UnauthorizedException(this.invalidMessage);

        const passwordMatch = await bcrypt.compareSync(password, user.password);
        if (!passwordMatch)
            throw new UnauthorizedException(this.invalidMessage);

        const payload = { sub: user.id };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
