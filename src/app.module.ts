import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExceptionModule } from './exception/exception.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ExceptionModule,
        AuthModule,
        UserModule,
        QuestionModule,
        AnswerModule,
    ],
})
export class AppModule {}
