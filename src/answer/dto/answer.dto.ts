import { Answers } from '@prisma/client';

export class AnswerDTO implements Answers {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    questionId: string;
}
