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

    private readonly badRequestMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.QuestionWhereUniqueInput,
    ): string => {
        return `${subject} ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };

    async createQuestion(
        data: CreateQuestionDTO,
        userId: string,
    ): Promise<QuestionDTO> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new NotFoundException(
                this.notFoundMessage('User', { id: userId }),
            );

        const questionCreated = await this.prisma.question.create({
            data: { ...data, userId },
            select: this.selectQuestion,
        });
        if (!questionCreated)
            throw new BadRequestException(
                this.badRequestMessage('question', 'created'),
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

        const questionsFound = await this.prisma.question.findMany({
            skip,
            take,
            where,
            orderBy,
            select: this.selectQuestion,
        });
        if (!questionsFound)
            throw new BadRequestException(
                this.badRequestMessage('questions', 'found'),
            );

        return questionsFound;
    }

    async getQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<QuestionDTO> {
        const questionFound = await this.prisma.question.findUnique({
            where,
            select: this.selectQuestion,
        });
        if (!questionFound)
            throw new NotFoundException(
                this.notFoundMessage('Question', where),
            );
        return questionFound;
    }

    async updateQuestion(params: {
        where: Prisma.QuestionWhereUniqueInput;
        data: UpdateQuestionDTO;
    }): Promise<QuestionDTO> {
        const { where, data } = params;

        const question = await this.prisma.question.findUnique({ where });
        if (!question)
            throw new NotFoundException(
                this.notFoundMessage('Question', where),
            );

        const updatedQuestion = await this.prisma.question.update({
            where,
            data,
            select: this.selectQuestion,
        });
        if (!updatedQuestion)
            throw new BadRequestException(
                this.badRequestMessage('question', 'updated'),
            );

        return updatedQuestion;
    }

    async deleteQuestion(
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<void> {
        const question = await this.prisma.question.findUnique({ where });
        if (!question)
            throw new NotFoundException(
                this.notFoundMessage('Question', where),
            );

        const deletedQuestion = await this.prisma.question.delete({ where });
        if (!deletedQuestion)
            throw new BadRequestException(
                this.badRequestMessage('question', 'deleted'),
            );
    }
}
