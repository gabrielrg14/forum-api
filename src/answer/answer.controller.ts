import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Request,
    Param,
    Query,
    Post,
    Get,
    Put,
    Delete,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AnswerDTO, CreateAnswerDTO, UpdateAnswerDTO } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post('/question/:uuid')
    @UseGuards(AuthGuard)
    createAnswer(
        @Body() answerData: CreateAnswerDTO,
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<AnswerDTO> {
        return this.answerService.createAnswer(
            answerData,
            req.token.sub,
            questionId,
        );
    }

    @Get()
    getAllAnswers(@Query('search') search: string): Promise<AnswerDTO[]> {
        return this.answerService.getAnswers({
            where: { body: { contains: search } },
        });
    }

    @Get('/question/:uuid')
    getAllQuestionAnswers(
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<AnswerDTO[]> {
        return this.answerService.getAnswers({ where: { questionId } });
    }

    @Get('/user/:uuid')
    getAllUserAnswers(
        @Param('uuid', ParseUUIDPipe) userId: string,
    ): Promise<AnswerDTO[]> {
        return this.answerService.getAnswers({ where: { userId } });
    }

    @Get('/:uuid')
    getAnswerById(
        @Param('uuid', ParseUUIDPipe) answerId: string,
    ): Promise<AnswerDTO> {
        return this.answerService.getAnswer({ id: answerId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateAnswerById(
        @Param('uuid', ParseUUIDPipe) answerId: string,
        @Body() answerData: UpdateAnswerDTO,
    ): Promise<AnswerDTO> {
        return this.answerService.updateAnswer({
            where: { id: answerId },
            data: answerData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteAnswerById(
        @Param('uuid', ParseUUIDPipe) answerId: string,
    ): Promise<void> {
        return this.answerService.deleteAnswer({ id: answerId });
    }
}
