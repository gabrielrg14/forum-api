import { User as UserModel, Question as QuestionModel } from '@prisma/client';

type User = Pick<UserModel, 'id' | 'email' | 'name'>;

export class QuestionDTO implements Omit<QuestionModel, 'userId'> {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
