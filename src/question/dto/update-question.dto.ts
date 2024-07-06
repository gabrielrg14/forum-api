import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDTO } from './create-question.dto';

export class UpdateQuestionDTO extends PartialType(CreateQuestionDTO) {}
