import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QuestionQueryParams {
    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @IsNumberString({ no_symbols: true })
    page: string;

    @IsOptional()
    @IsNumberString({ no_symbols: true })
    pageSize: string;
}
