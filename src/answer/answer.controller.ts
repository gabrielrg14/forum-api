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
import { AnswerService } from './answer.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    AnswerDTO,
    AnswerQueryParams,
    CreateAnswerDTO,
    UpdateAnswerDTO,
} from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post('/question/:uuid')
    @UseGuards(AuthGuard)
    createAnswer(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) questionId: string,
        @Body() answerData: CreateAnswerDTO,
    ): Promise<AnswerDTO> {
        return this.answerService.createAnswer(
            req.token.sub,
            questionId,
            answerData,
        );
    }

    @Get()
    getAllAnswers(@Query() query: AnswerQueryParams): Promise<AnswerDTO[]> {
        const where: Prisma.AnswerWhereInput = {};
        let skip: number | undefined = undefined;
        let take: number | undefined = undefined;

        if (query.search)
            where.OR = [
                {
                    body: { contains: query.search },
                },
            ];

        if (query.questionId) where.questionId = query.questionId;

        if (query.userId) where.userId = query.userId;

        if (query.page && query.pageSize) {
            const page = Math.max(0, Number(query.page) - 1);
            const pageSize = Number(query.pageSize);
            skip = page * pageSize;
            take = pageSize;
        }

        return this.answerService.getAnswers({
            skip,
            take,
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    @Get('/:uuid')
    getAnswerById(
        @Param('uuid', ParseUUIDPipe) answerId: string,
    ): Promise<AnswerDTO> {
        return this.answerService.getUniqueAnswer({ id: answerId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateAnswerById(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) answerId: string,
        @Body() answerData: UpdateAnswerDTO,
    ): Promise<AnswerDTO> {
        return this.answerService.updateAnswer(req.token.sub, {
            where: { id: answerId },
            data: answerData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteAnswerById(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) answerId: string,
    ): Promise<void> {
        return this.answerService.deleteAnswer(req.token.sub, { id: answerId });
    }
}
