import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    body: string;
}
