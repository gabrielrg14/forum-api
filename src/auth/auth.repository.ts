import { AuthDTO, AuthTokenDTO } from './dto';

export abstract class AuthRepository {
    abstract signIn(authData: AuthDTO): Promise<AuthTokenDTO>;
}
