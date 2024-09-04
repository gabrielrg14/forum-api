import { Injectable } from '@nestjs/common';
import { AnswerRepository } from './answer.repository';
import { PrismaService } from 'src/database/prisma.service';
import { ExceptionService } from 'src/exception/exception.service';
import { AnswerDTO, CreateAnswerDTO, UpdateAnswerDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnswerService implements AnswerRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
    ) {}

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
            this.exceptionService.subjectNotFound<Prisma.UserWhereUniqueInput>(
                'User',
                { id: userId },
            );

        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question)
            this.exceptionService.subjectNotFound<Prisma.QuestionWhereUniqueInput>(
                'Question',
                { id: questionId },
            );

        try {
            return await this.prisma.answer.create({
                data: { ...data, userId, questionId },
                select: this.selectAnswer,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('answer', 'created');
        }
    }

    async getAnswers(params: {
        skip?: number;
        take?: number;
        where?: Prisma.AnswerWhereInput;
        orderBy?: Prisma.AnswerOrderByWithRelationInput;
    }): Promise<AnswerDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.answer.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.selectAnswer,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('answers', 'found');
        }
    }

    async getAnswer(where: Prisma.AnswerWhereUniqueInput): Promise<AnswerDTO> {
        try {
            const answerFound = await this.prisma.answer.findUnique({
                where,
                select: this.selectAnswer,
            });
            if (!answerFound)
                this.exceptionService.subjectNotFound<Prisma.AnswerWhereUniqueInput>(
                    'Answer',
                    where,
                );
            return answerFound;
        } catch (error) {
            throw error;
        }
    }

    async updateAnswer(params: {
        where: Prisma.AnswerWhereUniqueInput;
        data: UpdateAnswerDTO;
    }): Promise<AnswerDTO> {
        const { where, data } = params;

        const answer = await this.prisma.answer.findUnique({ where });
        if (!answer)
            this.exceptionService.subjectNotFound<Prisma.AnswerWhereUniqueInput>(
                'Answer',
                where,
            );

        try {
            return await this.prisma.answer.update({
                where,
                data,
                select: this.selectAnswer,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('answer', 'updated');
        }
    }

    async deleteAnswer(where: Prisma.AnswerWhereUniqueInput): Promise<void> {
        const answer = await this.prisma.answer.findUnique({ where });
        if (!answer)
            this.exceptionService.subjectNotFound<Prisma.AnswerWhereUniqueInput>(
                'Answer',
                where,
            );

        try {
            await this.prisma.answer.delete({ where });
        } catch (error) {
            this.exceptionService.somethingBadHappened('answer', 'deleted');
        }
    }
}
