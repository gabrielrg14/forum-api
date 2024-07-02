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
import { QuestionService } from './question.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { QuestionDTO, CreateQuestionDto, UpdateQuestionDto } from './dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @UseGuards(AuthGuard)
    createQuestion(
        @Body() questionData: CreateQuestionDto,
        @Request() req: { token: { sub: string } },
    ): Promise<QuestionDTO> {
        return this.questionService.createQuestion(questionData, req.token.sub);
    }

    @Get()
    getAllQuestions(): Promise<QuestionDTO[]> {
        return this.questionService.getQuestions({});
    }

    @Get('/:uuid')
    getOneQuestion(
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<QuestionDTO> {
        return this.questionService.getQuestion({ id: questionId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateQuestion(
        @Param('uuid', ParseUUIDPipe) questionId: string,
        @Body() questionData: UpdateQuestionDto,
    ): Promise<QuestionDTO> {
        return this.questionService.updateQuestion({
            where: { id: questionId },
            data: questionData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteQuestion(
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<void> {
        return this.questionService.deleteQuestion({ id: questionId });
    }
}
