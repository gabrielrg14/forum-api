import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsEmpty } from 'class-validator';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
    @IsEmpty()
    password?: string;
}
