import { Prisma } from '@prisma/client';
import { QuestionDTO, CreateQuestionDto, UpdateQuestionDto } from './dto';

export abstract class QuestionRepository {
    abstract createQuestion(
        data: CreateQuestionDto,
        userId: string,
    ): Promise<QuestionDTO>;

    abstract getQuestions(params: {
        where?: Prisma.QuestionsWhereInput;
        orderBy?: Prisma.QuestionsOrderByWithRelationInput;
    }): Promise<QuestionDTO[]>;

    abstract getQuestion(
        where: Prisma.QuestionsWhereUniqueInput,
    ): Promise<QuestionDTO>;

    abstract updateQuestion(params: {
        where: Prisma.QuestionsWhereUniqueInput;
        data: UpdateQuestionDto;
    }): Promise<QuestionDTO>;

    abstract deleteQuestion(
        where: Prisma.QuestionsWhereUniqueInput,
    ): Promise<void>;
}
