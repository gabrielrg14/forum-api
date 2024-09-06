import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { PrismaService } from 'src/database/prisma.service';
import { ExceptionService } from 'src/exception/exception.service';
import { UserService } from 'src/user/user.service';
import { QuestionDTO, CreateQuestionDTO, UpdateQuestionDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionService implements QuestionRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly userService: UserService,
    ) {}

    public readonly selectQuestion = {
        id: true,
        title: true,
        body: true,
        createdAt: true,
        updatedAt: true,
        user: {
            select: this.userService.selectUser,
        },
    };

    async createQuestion(
        userId: string,
        data: CreateQuestionDTO,
    ): Promise<QuestionDTO> {
        await this.userService.getUniqueUser({ id: userId });

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

    async getUniqueQuestion(
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

    async getFirstQuestion(
        where: Prisma.QuestionWhereInput,
    ): Promise<QuestionDTO> {
        return await this.prisma.question.findFirst({
            where,
            select: this.selectQuestion,
        });
    }

    async updateQuestion(
        userId: string,
        params: {
            where: Prisma.QuestionWhereUniqueInput;
            data: UpdateQuestionDTO;
        },
    ): Promise<QuestionDTO> {
        const { where, data } = params;

        await this.getUniqueQuestion({ ...where, userId });

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
        userId: string,
        where: Prisma.QuestionWhereUniqueInput,
    ): Promise<void> {
        await this.getUniqueQuestion({ ...where, userId });

        try {
            await this.prisma.question.delete({ where });
        } catch (error) {
            this.exceptionService.somethingBadHappened('question', 'deleted');
        }
    }
}
