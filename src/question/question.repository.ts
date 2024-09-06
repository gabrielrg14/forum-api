import { QuestionDTO, CreateQuestionDTO, UpdateQuestionDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class QuestionRepository {
    abstract createQuestion(
        userId: string,
        data: CreateQuestionDTO,
    ): Promise<QuestionDTO>;

    abstract getQuestions(params: {
        skip?: number;
        take?: number;
        where?: Prisma.QuestionWhereInput;
        orderBy?: Prisma.QuestionOrderByWithRelationInput;
    }): Promise<QuestionDTO[]>;

    abstract getUniqueQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<QuestionDTO>;

    abstract getFirstQuestion(
        where: Prisma.QuestionWhereInput,
    ): Promise<QuestionDTO>;

    abstract updateQuestion(
        userId: string,
        params: {
            where: Prisma.QuestionWhereUniqueInput;
            data: UpdateQuestionDTO;
        },
    ): Promise<QuestionDTO>;

    abstract deleteQuestion(
        userId: string,
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<void>;
}
