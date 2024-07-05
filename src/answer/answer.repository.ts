import { AnswerDTO, CreateAnswerDto, UpdateAnswerDto } from './dto';
import { Prisma } from '@prisma/client';

export abstract class AnswerRepository {
    abstract createAnswer(
        data: CreateAnswerDto,
        userId: string,
        questionId: string,
    ): Promise<AnswerDTO>;

    abstract getAnswers(params: {
        where?: Prisma.AnswerWhereInput;
        orderBy?: Prisma.AnswerOrderByWithRelationInput;
    }): Promise<AnswerDTO[]>;

    abstract getAnswer(
        where: Prisma.AnswerWhereUniqueInput,
    ): Promise<AnswerDTO>;

    abstract updateAnswer(params: {
        where: Prisma.AnswerWhereUniqueInput;
        data: UpdateAnswerDto;
    }): Promise<AnswerDTO>;

    abstract deleteAnswer(where: Prisma.AnswerWhereUniqueInput): Promise<void>;
}
