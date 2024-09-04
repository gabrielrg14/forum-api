import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { PrismaService } from 'src/database/prisma.service';
import { ExceptionService } from 'src/exception/exception.service';
import { QuestionDTO, CreateQuestionDTO, UpdateQuestionDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionService implements QuestionRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
    ) {}

    private readonly selectQuestion = {
        id: true,
        title: true,
        body: true,
        createdAt: true,
        updatedAt: true,
        user: {
            select: {
                id: true,
                email: true,
                name: true,
            },
        },
    };

    async createQuestion(
        data: CreateQuestionDTO,
        userId: string,
    ): Promise<QuestionDTO> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            this.exceptionService.subjectNotFound<Prisma.UserWhereUniqueInput>(
                'User',
                { id: userId },
            );

        try {
            return await this.prisma.question.create({
                data: { ...data, userId },
                select: this.selectQuestion,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('question', 'created');
        }
    }

    async getQuestions(params: {
        skip?: number;
        take?: number;
        where?: Prisma.QuestionWhereInput;
        orderBy?: Prisma.QuestionOrderByWithRelationInput;
    }): Promise<QuestionDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.question.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.selectQuestion,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('questions', 'found');
        }
    }

    async getQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<QuestionDTO> {
        try {
            const questionFound = await this.prisma.question.findUnique({
                where,
                select: this.selectQuestion,
            });
            if (!questionFound)
                this.exceptionService.subjectNotFound<Prisma.QuestionWhereUniqueInput>(
                    'Question',
                    where,
                );
            return questionFound;
        } catch (error) {
            throw error;
        }
    }

    async updateQuestion(params: {
        where: Prisma.QuestionWhereUniqueInput;
        data: UpdateQuestionDTO;
    }): Promise<QuestionDTO> {
        const { where, data } = params;

        const question = await this.prisma.question.findUnique({ where });
        if (!question)
            this.exceptionService.subjectNotFound<Prisma.QuestionWhereUniqueInput>(
                'Question',
                where,
            );

        try {
            return await this.prisma.question.update({
                where,
                data,
                select: this.selectQuestion,
            });
        } catch (error) {
            this.exceptionService.somethingBadHappened('question', 'updated');
        }
    }

    async deleteQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<void> {
        const question = await this.prisma.question.findUnique({ where });
        if (!question)
            this.exceptionService.subjectNotFound<Prisma.QuestionWhereUniqueInput>(
                'Question',
                where,
            );

        try {
            await this.prisma.question.delete({ where });
        } catch (error) {
            this.exceptionService.somethingBadHappened('question', 'deleted');
        }
    }
}
