import {
    Controller,
    UseGuards,
    Param,
    Body,
    Req,
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
        @Body() createQuestionDto: CreateQuestionDto,
        @Req() req: any,
    ): Promise<QuestionDTO> {
        return this.questionService.createQuestion(createQuestionDto, req.sub);
    }

    @Get()
    getAllQuestions(): Promise<QuestionDTO[]> {
        return this.questionService.getQuestions({});
    }

    @Get('/:id')
    getOneQuestion(@Param('id') questionId: string): Promise<QuestionDTO> {
        return this.questionService.getQuestion({ id: questionId });
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    updateQuestion(
        @Param('id') questionId: string,
        @Body() questionData: UpdateQuestionDto,
    ): Promise<QuestionDTO> {
        return this.questionService.updateQuestion({
            where: { id: questionId },
            data: questionData,
        });
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteQuestion(@Param('id') questionId: string): Promise<void> {
        return this.questionService.deleteQuestion({ id: questionId });
    }
}
