import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ExceptionModule } from 'src/exception/exception.module';
import { UserModule } from 'src/user/user.module';
import { QuestionModule } from 'src/question/question.module';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
    imports: [DatabaseModule, ExceptionModule, UserModule, QuestionModule],
    controllers: [AnswerController],
    providers: [AnswerService],
})
export class AnswerModule {}
