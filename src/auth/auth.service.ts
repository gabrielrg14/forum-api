import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AuthDTO } from './dto';
import { UserDTO } from 'src/user/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signin(authData: AuthDTO): Promise<UserDTO> {
        const user = await this.prisma.user.findUnique({
            where: { email: authData.email },
        });
        if (!user) throw new NotFoundException('User not found.');

        const { password, ...result } = user;

        const passwordMatch = await bcrypt.compare(authData.password, password);
        if (!passwordMatch)
            throw new UnauthorizedException('Invalid credentials.');

        return result;
    }
}
