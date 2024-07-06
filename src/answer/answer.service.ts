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

    async createAnswer(
        data: CreateAnswerDTO,
        userId: string,
        questionId: string,
    ): Promise<AnswerDTO> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new NotFoundException(`User id ${userId} was not found.`);

        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question)
            throw new NotFoundException(
                `Question id ${questionId} was not found.`,
            );

        const answerCreated = await this.prisma.answer.create({
            data: { ...data, userId, questionId },
            select: this.selectAnswer,
        });
        if (!answerCreated)
            throw new BadRequestException(
                'Something bad happened and the answer was not created.',
            );

        return answerCreated;
    }

    async getAnswers(params: {
        where?: Prisma.AnswerWhereInput;
        orderBy?: Prisma.AnswerOrderByWithRelationInput;
    }): Promise<AnswerDTO[]> {
        const { where, orderBy } = params;

        const answers = await this.prisma.answer.findMany({
            where,
            orderBy,
            select: this.selectAnswer,
        });
        if (!answers)
            throw new BadRequestException(
                'Something bad happened and the answers was not found.',
            );

        return answers;
    }

    async getAnswer(where: Prisma.AnswerWhereUniqueInput): Promise<AnswerDTO> {
        const answer = await this.prisma.answer.findUnique({
            where,
            select: this.selectAnswer,
        });
        if (!answer)
            throw new NotFoundException(
                `Answer ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );
        return answer;
    }

    async updateAnswer(params: {
        where: Prisma.AnswerWhereUniqueInput;
        data: UpdateAnswerDTO;
    }): Promise<AnswerDTO> {
        const { where, data } = params;

        const answer = await this.prisma.answer.findUnique({ where });
        if (!answer)
            throw new NotFoundException(
                `Answer ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );

        const answerUpdated = await this.prisma.answer.update({
            where,
            data,
            select: this.selectAnswer,
        });
        if (!answerUpdated)
            throw new BadRequestException(
                'Something bad happened and the answer was not updated.',
            );

        return answerUpdated;
    }

    async deleteAnswer(where: Prisma.AnswerWhereUniqueInput): Promise<void> {
        const answer = await this.prisma.answer.findUnique({ where });
        if (!answer)
            throw new NotFoundException(
                `Answer ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );

        const answerDeleted = await this.prisma.answer.delete({ where });
        if (!answerDeleted)
            throw new NotFoundException(
                'Something bad happened and the answer was not deleted.',
            );
    }
}
