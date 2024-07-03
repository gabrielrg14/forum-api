import { AnswerDTO, CreateAnswerDto, UpdateAnswerDto } from './dto';
import { Prisma } from '@prisma/client';

export abstract class AnswerRepository {
    abstract createAnswer(
        data: CreateAnswerDto,
        userId: string,
        questionId: string,
    ): Promise<AnswerDTO>;

    abstract getAnswers(params: {
        where?: Prisma.AnswersWhereInput;
        orderBy?: Prisma.AnswersOrderByWithRelationInput;
    }): Promise<AnswerDTO[]>;

    abstract getAnswer(
        where: Prisma.AnswersWhereUniqueInput,
    ): Promise<AnswerDTO>;

    abstract updateAnswer(params: {
        where: Prisma.AnswersWhereUniqueInput;
        data: UpdateAnswerDto;
    }): Promise<AnswerDTO>;

    abstract deleteAnswer(where: Prisma.AnswersWhereUniqueInput): Promise<void>;
}
