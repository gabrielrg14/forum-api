import {
    Controller,
    Param,
    Body,
    Post,
    Get,
    Put,
    Delete,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.createQuestion(createQuestionDto);
    }

    @Get()
    getAllQuestions() {
        return this.questionService.getQuestions({});
    }

    @Get('/:id')
    getOneQuestion(@Param('id') questionId: string) {
        return this.questionService.getQuestion({ id: questionId });
    }

    @Put('/:id')
    updateQuestion(
        @Param('id') questionId: string,
        @Body() questionData: UpdateQuestionDto,
    ) {
        return this.questionService.updateQuestion({
            where: { id: questionId },
            data: questionData,
        });
    }

    @Delete('/:id')
    deleteQuestion(@Param('id') questionId: string) {
        return this.questionService.deleteQuestion({ id: questionId });
    }
}
