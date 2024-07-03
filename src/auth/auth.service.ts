import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO, AuthTokenDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements AuthRepository {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async authUser(authData: AuthDTO): Promise<AuthTokenDTO> {
        const { email, password } = authData;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) throw new UnauthorizedException('Invalid credentials.');

        const passwordMatch = await bcrypt.compareSync(password, user.password);
        if (!passwordMatch)
            throw new UnauthorizedException('Invalid credentials.');

        const payload = { sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
