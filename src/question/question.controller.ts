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
import { QuestionDTO, CreateQuestionDTO, UpdateQuestionDTO } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @UseGuards(AuthGuard)
    createQuestion(
        @Body() questionData: CreateQuestionDTO,
        @Request() req: RequestTokenDTO,
    ): Promise<QuestionDTO> {
        return this.questionService.createQuestion(questionData, req.token.sub);
    }

    @Get()
    getAllQuestions(): Promise<QuestionDTO[]> {
        return this.questionService.getQuestions({});
    }

    @Get('/user/:uuid')
    getAllUserQuestions(
        @Param('uuid', ParseUUIDPipe) userId: string,
    ): Promise<QuestionDTO[]> {
        return this.questionService.getQuestions({
            where: { userId },
        });
    }

    @Get('/:uuid')
    getQuestionById(
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<QuestionDTO> {
        return this.questionService.getQuestion({ id: questionId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateQuestionById(
        @Param('uuid', ParseUUIDPipe) questionId: string,
        @Body() questionData: UpdateQuestionDTO,
    ): Promise<QuestionDTO> {
        return this.questionService.updateQuestion({
            where: { id: questionId },
            data: questionData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteQuestionById(
        @Param('uuid', ParseUUIDPipe) questionId: string,
    ): Promise<void> {
        return this.questionService.deleteQuestion({ id: questionId });
    }
}
