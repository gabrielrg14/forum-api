import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
    @IsNotEmpty()
    @IsString()
    body: string;
}
