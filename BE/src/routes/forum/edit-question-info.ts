import express, { NextFunction, Request, Response } from 'express';
import { TagType } from '../../constants';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { BadRequestError } from '../../errors';
import { Question, User } from '../../models';
import {
  EditQuestionInfoResponse,
  QuestionDoc,
  SchoolDoc,
  SubjectDoc,
  Tag,
  TextbookDoc,
} from '../../types';

const modelToTagList = (
  model: TextbookDoc[] | SubjectDoc[] | SchoolDoc[],
  tagType: TagType
): Tag[] => {
  const tagList: Tag[] = model.map(({ id, name }) => {
    return {
      id: id,
      name: name,
      type: tagType,
    };
  });
  return tagList;
};

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/forum/questions/:id/edit',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const questionId = req.params.id;

      const question = (await Question.findById(questionId)
        .populate({
          path: 'owner',
          select: ['username', 'avatarUrl'],
        })
        .populate({
          path: 'textbookList',
          select: 'name',
        })
        .populate({ path: 'subjectList', select: 'name' })
        .populate({
          path: 'schoolList',
          select: 'name',
        })) as QuestionDoc;

      if (!question) {
        throw new BadRequestError('Question is not exist !');
      }

      if (currentUser?.id !== question.owner.id) {
        throw new ForbiddenError();
      }

      let tagList: Tag[] = [];

      const textbooks = modelToTagList(
        question?.textbookList,
        TagType.TEXTBOOK
      );
      tagList = [...tagList, ...textbooks];

      const subjects = modelToTagList(question?.subjectList, TagType.SUBJECT);
      tagList = [...tagList, ...subjects];

      const schools = modelToTagList(question?.schoolList, TagType.SCHOOL);
      tagList = [...tagList, ...schools];
      tagList.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

      const response: EditQuestionInfoResponse = {
        id: question?.id,
        title: question?.title as string,
        content: question?.content as string,
        owner: {
          id: question?.owner.id,
          name: question?.owner.username as string,
          avaUrl: question?.owner.avatarUrl as string,
        },
        tagList: tagList,
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as editQuestionInfoRouter };
