import { Prisma } from '@prisma/client';
import { QuestionDTO, CreateQuestionDTO, UpdateQuestionDTO } from './dto';

export abstract class QuestionRepository {
    abstract createQuestion(
        data: CreateQuestionDTO,
        userId: string,
    ): Promise<QuestionDTO>;

    abstract getQuestions(params: {
        skip?: number;
        take?: number;
        where?: Prisma.QuestionWhereInput;
        orderBy?: Prisma.QuestionOrderByWithRelationInput;
    }): Promise<QuestionDTO[]>;

    abstract getQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<QuestionDTO>;

    abstract updateQuestion(params: {
        where: Prisma.QuestionWhereUniqueInput;
        data: UpdateQuestionDTO;
    }): Promise<QuestionDTO>;

    abstract deleteQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<void>;
}
