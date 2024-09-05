import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ExceptionModule } from 'src/exception/exception.module';
import { UserModule } from 'src/user/user.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
    imports: [DatabaseModule, ExceptionModule, UserModule],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService],
})
export class QuestionModule {}
