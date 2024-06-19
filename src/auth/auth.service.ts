import {
    Injectable,
    Inject,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthDTO } from './dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    @Inject()
    private readonly userService: UserService;

    async signin(authData: AuthDTO): Promise<Omit<User, 'password'>> {
        const user = await this.userService.getUser({
            email: authData.email,
        });
        if (!user) throw new NotFoundException('User not found.');

        const { password, ...result } = user;

        const passwordMatch = await bcrypt.compare(authData.password, password);
        if (!passwordMatch)
            throw new UnauthorizedException('Invalid credentials.');

        return result;
    }
}
