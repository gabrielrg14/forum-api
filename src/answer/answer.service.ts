import { Injectable } from '@nestjs/common';
import { AnswerRepository } from './answer.repository';
import { PrismaService } from 'src/database/prisma.service';
import { ExceptionService } from 'src/exception/exception.service';
import { UserService } from 'src/user/user.service';
import { QuestionService } from 'src/question/question.service';
import { AnswerDTO, CreateAnswerDTO, UpdateAnswerDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnswerService implements AnswerRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly userService: UserService,
        private readonly questionService: QuestionService,
    ) {}

    public readonly selectAnswer = {
        id: true,
        body: true,
        createdAt: true,
        updatedAt: true,
        user: {
            select: this.userService.selectUser,
        },
        question: {
            select: this.questionService.selectQuestion,
        },
    };

    async createAnswer(
        userId: string,
        questionId: string,
        data: CreateAnswerDTO,
    ): Promise<AnswerDTO> {
        await this.userService.getUniqueUser({ id: userId });
        await this.questionService.getUniqueQuestion({ id: questionId });

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

    async getUniqueAnswer(
        where: Prisma.AnswerWhereUniqueInput,
    ): Promise<AnswerDTO> {
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

    async getFirstAnswer(where: Prisma.AnswerWhereInput): Promise<AnswerDTO> {
        return await this.prisma.answer.findFirst({
            where,
            select: this.selectAnswer,
        });
    }

    async updateAnswer(
        userId: string,
        params: {
            where: Prisma.AnswerWhereUniqueInput;
            data: UpdateAnswerDTO;
        },
    ): Promise<AnswerDTO> {
        const { where, data } = params;

        await this.getUniqueAnswer({ ...where, userId });

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

    async deleteAnswer(
        userId: string,
        where: Prisma.AnswerWhereUniqueInput,
    ): Promise<void> {
        await this.getUniqueAnswer({ ...where, userId });

        try {
            await this.prisma.answer.delete({ where });
        } catch (error) {
            this.exceptionService.somethingBadHappened('answer', 'deleted');
        }
    }
}
