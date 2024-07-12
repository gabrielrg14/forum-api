import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class UserQueryParams {
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
