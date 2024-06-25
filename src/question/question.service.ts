import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { PrismaService } from 'src/database/prisma.service';
import { QuestionDTO, CreateQuestionDto, UpdateQuestionDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionService implements QuestionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createQuestion(
        data: CreateQuestionDto,
        userId: string,
    ): Promise<QuestionDTO> {
        const questionCreated = await this.prisma.questions.create({
            data: { ...data, userId },
        });
        if (!questionCreated)
            throw new BadRequestException(
                'Something bad happened and the question was not created.',
            );
        return questionCreated;
    }

    async getQuestions(params: {
        where?: Prisma.QuestionsWhereUniqueInput;
        orderBy?: Prisma.QuestionsOrderByWithRelationInput;
    }): Promise<QuestionDTO[]> {
        const { where, orderBy } = params;

        const questions = await this.prisma.questions.findMany({
            where,
            orderBy,
        });
        if (!questions) throw new NotFoundException('Questions not found.');

        return questions;
    }

    async getQuestion(
        where: Prisma.QuestionsWhereUniqueInput,
    ): Promise<QuestionDTO> {
        const question = await this.prisma.questions.findUnique({ where });
        if (!question) throw new NotFoundException('Question not found.');
        return question;
    }

    async updateQuestion(params: {
        where: Prisma.QuestionsWhereUniqueInput;
        data: UpdateQuestionDto;
    }): Promise<QuestionDTO> {
        const { where, data } = params;
        const updatedQuestion = await this.prisma.questions.update({
            where,
            data,
        });
        if (!updatedQuestion)
            throw new NotFoundException(
                'Something bad happened and the question was not updated.',
            );
        return updatedQuestion;
    }

    async deleteQuestion(
        where: Prisma.QuestionsWhereUniqueInput,
    ): Promise<void> {
        const questionDeleted = await this.prisma.questions.delete({ where });
        if (!questionDeleted)
            throw new NotFoundException(
                'Something bad happened and the question was not deleted.',
            );
    }
}
