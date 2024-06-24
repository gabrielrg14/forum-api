import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
    imports: [DatabaseModule],
    controllers: [QuestionController],
    providers: [QuestionService],
})
export class QuestionModule {}
