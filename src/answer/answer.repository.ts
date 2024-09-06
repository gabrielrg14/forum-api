import { AnswerDTO, CreateAnswerDTO, UpdateAnswerDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class AnswerRepository {
    abstract createAnswer(
        userId: string,
        questionId: string,
        data: CreateAnswerDTO,
    ): Promise<AnswerDTO>;

    abstract getAnswers(params: {
        skip?: number;
        take?: number;
        where?: Prisma.AnswerWhereInput;
        orderBy?: Prisma.AnswerOrderByWithRelationInput;
    }): Promise<AnswerDTO[]>;

    abstract getUniqueAnswer(
        where: Prisma.AnswerWhereUniqueInput,
    ): Promise<AnswerDTO>;

    abstract getFirstAnswer(where: Prisma.AnswerWhereInput): Promise<AnswerDTO>;

    abstract updateAnswer(
        userId: string,
        params: {
            where: Prisma.AnswerWhereUniqueInput;
            data: UpdateAnswerDTO;
        },
    ): Promise<AnswerDTO>;

    abstract deleteAnswer(
        userId: string,
        where: Prisma.AnswerWhereUniqueInput,
    ): Promise<void>;
}
