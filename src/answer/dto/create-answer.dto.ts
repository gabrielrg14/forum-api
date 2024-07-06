import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDTO {
    @IsNotEmpty()
    @IsString()
    body: string;
}
