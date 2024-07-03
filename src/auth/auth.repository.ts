import { AuthDTO, AuthTokenDTO } from './dto';

export abstract class AuthRepository {
    abstract authUser(authData: AuthDTO): Promise<AuthTokenDTO>;
}
