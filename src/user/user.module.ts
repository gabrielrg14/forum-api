import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ExceptionModule } from 'src/exception/exception.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [DatabaseModule, ExceptionModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
