import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';

@Module({
    imports: [AuthModule, UserModule, QuestionModule, AnswerModule],
})
export class AppModule {}
