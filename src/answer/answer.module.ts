import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ExceptionModule } from 'src/exception/exception.module';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

@Module({
    imports: [DatabaseModule, ExceptionModule],
    controllers: [AnswerController],
    providers: [AnswerService],
})
export class AnswerModule {}
