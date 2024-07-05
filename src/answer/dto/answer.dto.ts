import {
    User as UserModel,
    Question as QuestionModel,
    Answer as AnswerModel,
} from '@prisma/client';

type User = Pick<UserModel, 'id' | 'email' | 'name'>;
type Question =
    | Pick<QuestionModel, 'id' | 'title' | 'body'>
    | {
          user: User;
      };

export class AnswerDTO implements Omit<AnswerModel, 'userId' | 'questionId'> {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    question: Question;
}
