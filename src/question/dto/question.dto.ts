import { User as UserModel, Questions } from '@prisma/client';

type User = Pick<UserModel, 'id' | 'email' | 'name'>;

export class QuestionDTO implements Omit<Questions, 'userId'> {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
