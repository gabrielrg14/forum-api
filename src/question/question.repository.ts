import { Prisma } from '@prisma/client';
import { QuestionDTO, CreateQuestionDto, UpdateQuestionDto } from './dto';

export abstract class QuestionRepository {
    abstract createQuestion(
        data: CreateQuestionDto,
        userId: string,
    ): Promise<QuestionDTO>;

    abstract getQuestions(params: {
        where?: Prisma.QuestionWhereInput;
        orderBy?: Prisma.QuestionOrderByWithRelationInput;
    }): Promise<QuestionDTO[]>;

    abstract getQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<QuestionDTO>;

    abstract updateQuestion(params: {
        where: Prisma.QuestionWhereUniqueInput;
        data: UpdateQuestionDto;
    }): Promise<QuestionDTO>;

    abstract deleteQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<void>;
}
