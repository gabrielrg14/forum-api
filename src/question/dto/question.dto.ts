import { Questions } from '@prisma/client';

export class QuestionDTO implements Questions {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}
