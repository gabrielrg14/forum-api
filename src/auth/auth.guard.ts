import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const [type, token] =
            request.headers['authorization']?.split(' ') ?? [];
        if (type !== 'Bearer')
            throw new UnauthorizedException('Authorization token is required.');

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request.sub = payload;
        } catch {
            throw new UnauthorizedException('Invalid authorization token.');
        }

        return true;
    }
}
