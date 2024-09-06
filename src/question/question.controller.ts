import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Request,
    Query,
    Param,
    Post,
    Get,
    Put,
    Delete,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    QuestionDTO,
    QuestionQueryParams,
    CreateQuestionDTO,
    UpdateQuestionDTO,
} from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @UseGuards(AuthGuard)
    createQuestion(
        @Request() req: RequestTokenDTO,
        @Body() questionData: CreateQuestionDTO,
    ): Promise<QuestionDTO> {
        return this.questionService.createQuestion(req.token.sub, questionData);
    }

    @Get()
    getAllQuestions(
        @Query() query: QuestionQueryParams,
    ): Promise<QuestionDTO[]> {
        const where: Prisma.QuestionWhereInput = {};
        let skip: number | undefined = undefined;
        let take: number | undefined = undefined;

        if (query.search)
            where.OR = [
                {
                    title: { contains: query.search },
                    body: { contains: query.search },
                },
            ];

        if (query.userId) where.userId = query.userId;

        if (query.page && query.pageSize) {
            const page = Math.max(0, Number(query.page) - 1);
            const pageSize = Number(query.pageSize);
            skip = page * pageSize;
            take = pageSize;
        }

        return this.questionService.getQuestions({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    @Get('/:uuid')
    getQuestionById(
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<QuestionDTO> {
        return this.questionService.getUniqueQuestion({ id: questionId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateQuestionById(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) questionId: string,
        @Body() questionData: UpdateQuestionDTO,
    ): Promise<QuestionDTO> {
        return this.questionService.updateQuestion(req.token.sub, {
            where: { id: questionId },
            data: questionData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteQuestionById(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<void> {
        return this.questionService.deleteQuestion(req.token.sub, {
            id: questionId,
        });
    }
}
