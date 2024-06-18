import { IsEmail, IsString, IsEmpty } from 'class-validator';

export class UpdateUserDTO {
    @IsEmail()
    email?: string;

    @IsString()
    name?: string;

    @IsEmpty()
    password?: string;
}
