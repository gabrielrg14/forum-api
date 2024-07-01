import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { AnswerRepository } from './answer.repository';
import { PrismaService } from 'src/database/prisma.service';
import { AnswerDTO, CreateAnswerDto, UpdateAnswerDto } from './dto';
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
        data: CreateAnswerDto,
        userId: string,
        questionId: string,
    ): Promise<AnswerDTO> {
        const answerCreated = await this.prisma.answers.create({
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
        where?: Prisma.AnswersWhereUniqueInput;
        orderBy?: Prisma.AnswersOrderByWithRelationInput;
    }): Promise<AnswerDTO[]> {
        const { where, orderBy } = params;

        const answers = await this.prisma.answers.findMany({
            where,
            orderBy,
            select: this.selectAnswer,
        });
        if (!answers) throw new NotFoundException('Answers not found.');

        return answers;
    }

    async getAnswer(where: Prisma.AnswersWhereUniqueInput): Promise<AnswerDTO> {
        const answer = await this.prisma.answers.findUnique({
            where,
            select: this.selectAnswer,
        });
        if (!answer) throw new NotFoundException('Answer not found.');
        return answer;
    }

    async updateAnswer(params: {
        where: Prisma.AnswersWhereUniqueInput;
        data: UpdateAnswerDto;
    }): Promise<AnswerDTO> {
        const { where, data } = params;

        const answerUpdated = await this.prisma.answers.update({
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

    async deleteAnswer(where: Prisma.AnswersWhereUniqueInput): Promise<void> {
        const answerDeleted = await this.prisma.answers.delete({ where });
        if (!answerDeleted)
            throw new NotFoundException(
                'Something bad happened and the answer was not deleted.',
            );
    }
}
