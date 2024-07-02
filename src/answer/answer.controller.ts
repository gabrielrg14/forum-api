import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Param,
    Body,
    Request,
    Post,
    Get,
    Put,
    Delete,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AnswerDTO, CreateAnswerDto, UpdateAnswerDto } from './dto';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post('/question/:uuid')
    @UseGuards(AuthGuard)
    createAnswer(
        @Body() answerData: CreateAnswerDto,
        @Request() req: { token: { sub: string } },
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<AnswerDTO> {
        return this.answerService.createAnswer(
            answerData,
            req.token.sub,
            questionId,
        );
    }

    @Get()
    getAllAnswers(): Promise<AnswerDTO[]> {
        return this.answerService.getAnswers({});
    }

    @Get('/:uuid')
    getOneAnswer(
        @Param('uuid', ParseUUIDPipe) answerId: string,
    ): Promise<AnswerDTO> {
        return this.answerService.getAnswer({ id: answerId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateAnswer(
        @Param('uuid', ParseUUIDPipe) answerId: string,
        @Body() answerData: UpdateAnswerDto,
    ): Promise<AnswerDTO> {
        return this.answerService.updateAnswer({
            where: { id: answerId },
            data: answerData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteAnswer(
        @Param('uuid', ParseUUIDPipe) answerId: string,
    ): Promise<void> {
        return this.answerService.deleteAnswer({ id: answerId });
    }
}
