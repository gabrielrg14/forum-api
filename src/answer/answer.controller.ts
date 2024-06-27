import {
    Controller,
    UseGuards,
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

    @Post('/question/:id')
    @UseGuards(AuthGuard)
    createAnswer(
        @Body() answerData: CreateAnswerDto,
        @Request() req: { token: { sub: string } },
        @Param('id') questionId: string,
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

    @Get('/:id')
    getOneAnswer(@Param('id') answerId: string): Promise<AnswerDTO> {
        return this.answerService.getAnswer({ id: answerId });
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    updateAnswer(
        @Param('id') answerId: string,
        @Body() answerData: UpdateAnswerDto,
    ): Promise<AnswerDTO> {
        return this.answerService.updateAnswer({
            where: { id: answerId },
            data: answerData,
        });
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteAnswer(@Param('id') answerId: string): Promise<void> {
        return this.answerService.deleteAnswer({ id: answerId });
    }
}
