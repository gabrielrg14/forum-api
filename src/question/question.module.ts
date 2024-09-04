import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ExceptionModule } from 'src/exception/exception.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
    imports: [DatabaseModule, ExceptionModule],
    controllers: [QuestionController],
    providers: [QuestionService],
})
export class QuestionModule {}
