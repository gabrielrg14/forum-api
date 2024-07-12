import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { PrismaService } from 'src/database/prisma.service';
import { QuestionDTO, CreateQuestionDTO, UpdateQuestionDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionService implements QuestionRepository {
    constructor(private readonly prisma: PrismaService) {}

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
            throw new NotFoundException(`User id ${userId} was not found.`);

        const questionCreated = await this.prisma.question.create({
            data: { ...data, userId },
            select: this.selectQuestion,
        });
        if (!questionCreated)
            throw new BadRequestException(
                'Something bad happened and the question was not created.',
            );

        return questionCreated;
    }

    async getQuestions(params: {
        skip?: number;
        take?: number;
        where?: Prisma.QuestionWhereInput;
        orderBy?: Prisma.QuestionOrderByWithRelationInput;
    }): Promise<QuestionDTO[]> {
        const { skip, take, where, orderBy } = params;

        const questions = await this.prisma.question.findMany({
            skip,
            take,
            where,
            orderBy,
            select: this.selectQuestion,
        });
        if (!questions)
            throw new BadRequestException(
                'Something bad happened and the questions was not found.',
            );

        return questions;
    }

    async getQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<QuestionDTO> {
        const question = await this.prisma.question.findUnique({
            where,
            select: this.selectQuestion,
        });
        if (!question)
            throw new NotFoundException(
                `Question ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );
        return question;
    }

    async updateQuestion(params: {
        where: Prisma.QuestionWhereUniqueInput;
        data: UpdateQuestionDTO;
    }): Promise<QuestionDTO> {
        const { where, data } = params;

        const question = await this.prisma.question.findUnique({ where });
        if (!question)
            throw new NotFoundException(
                `Question ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );

        const updatedQuestion = await this.prisma.question.update({
            where,
            data,
            select: this.selectQuestion,
        });
        if (!updatedQuestion)
            throw new NotFoundException(
                'Something bad happened and the question was not updated.',
            );

        return updatedQuestion;
    }

    async deleteQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<void> {
        const question = await this.prisma.question.findUnique({ where });
        if (!question)
            throw new NotFoundException(
                `Question ${Object.entries(where).map(([key, value]) => `${key} ${value}`)} was not found.`,
            );

        const questionDeleted = await this.prisma.question.delete({ where });
        if (!questionDeleted)
            throw new NotFoundException(
                'Something bad happened and the question was not deleted.',
            );
    }
}
