import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { AnswerRepository } from './answer.repository';
import { PrismaService } from 'src/database/prisma.service';
import { AnswerDTO, CreateAnswerDTO, UpdateAnswerDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnswerService implements AnswerRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly userSelect = {
        id: true,
        email: true,
        name: true,
    };

    private readonly questionSelect = {
        id: true,
        title: true,
        body: true,
        user: { select: this.userSelect },
    };

    private readonly selectAnswer = {
        id: true,
        body: true,
        createdAt: true,
        updatedAt: true,
        user: { select: this.userSelect },
        question: { select: this.questionSelect },
    };

    private readonly badRequestMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.AnswerWhereUniqueInput,
    ): string => {
        return `${subject} ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };

    async createAnswer(
        data: CreateAnswerDTO,
        userId: string,
        questionId: string,
    ): Promise<AnswerDTO> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new NotFoundException(
                this.notFoundMessage('User', { id: userId }),
            );

        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question)
            throw new NotFoundException(
                this.notFoundMessage('Question', { id: questionId }),
            );

        const answerCreated = await this.prisma.answer.create({
            data: { ...data, userId, questionId },
            select: this.selectAnswer,
        });
        if (!answerCreated)
            throw new BadRequestException(
                this.badRequestMessage('answer', 'created'),
            );

        return answerCreated;
    }

    async getAnswers(params: {
        skip?: number;
        take?: number;
        where?: Prisma.AnswerWhereInput;
        orderBy?: Prisma.AnswerOrderByWithRelationInput;
    }): Promise<AnswerDTO[]> {
        const { skip, take, where, orderBy } = params;

        const answersFound = await this.prisma.answer.findMany({
            skip,
            take,
            where,
            orderBy,
            select: this.selectAnswer,
        });
        if (!answersFound)
            throw new BadRequestException(
                this.badRequestMessage('answers', 'found'),
            );

        return answersFound;
    }

    async getAnswer(where: Prisma.AnswerWhereUniqueInput): Promise<AnswerDTO> {
        const answerFound = await this.prisma.answer.findUnique({
            where,
            select: this.selectAnswer,
        });
        if (!answerFound)
            throw new NotFoundException(this.notFoundMessage('Answer', where));
        return answerFound;
    }

    async updateAnswer(params: {
        where: Prisma.AnswerWhereUniqueInput;
        data: UpdateAnswerDTO;
    }): Promise<AnswerDTO> {
        const { where, data } = params;

        const answer = await this.prisma.answer.findUnique({ where });
        if (!answer)
            throw new NotFoundException(this.notFoundMessage('Answer', where));

        const updatedAnswer = await this.prisma.answer.update({
            where,
            data,
            select: this.selectAnswer,
        });
        if (!updatedAnswer)
            throw new BadRequestException(
                this.badRequestMessage('answer', 'updated'),
            );

        return updatedAnswer;
    }

    async deleteAnswer(where: Prisma.AnswerWhereUniqueInput): Promise<void> {
        const answer = await this.prisma.answer.findUnique({ where });
        if (!answer)
            throw new NotFoundException(this.notFoundMessage('Answer', where));

        const deletedAnswer = await this.prisma.answer.delete({ where });
        if (!deletedAnswer)
            throw new BadRequestException(
                this.badRequestMessage('answer', 'deleted'),
            );
    }
}
