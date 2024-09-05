import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
    @IsOptional()
    @IsString()
    password?: string;
}
