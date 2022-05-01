import express, { Request, Response } from 'express';
import { School, Question, Textbook, Subject, User } from '../../models/';
import { decodeToken, validateRequest } from '../../middlewares';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';
import mongoose from 'mongoose';
import { body } from 'express-validator';

// eslint-disable-next-line new-cap
const router = express.Router();

router.put(
  '/api/forum/questions/:questionId',
  decodeToken,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }
    const { title, content, textbooks, subjects, schools } = req.body;
    const questionId = req.params.questionId;

    const currentUser = await User.findOne({ uid: req.currentUser.uid });
    const currentUserId = currentUser?.id;

    const currentQuestion = await Question.findById(questionId).populate({
      path: 'owner',
      select: 'email',
    });
    const questionOwnerId = currentQuestion?.owner.id;

    const isRemovable = currentUserId.toString() === questionOwnerId.toString();

    if (!isRemovable) {
      throw new ForbiddenError();
    }

    const textbookList = await Textbook.find({
      _id: {
        $in: textbooks.map((id: string) => new mongoose.Types.ObjectId(id)),
      },
    });

    const subjectList = await Subject.find({
      _id: {
        $in: subjects.map((id: string) => new mongoose.Types.ObjectId(id)),
      },
    });

    const schoolList = await School.find({
      _id: {
        $in: schools.map((id: string) => new mongoose.Types.ObjectId(id)),
      },
    });

    await Question.findByIdAndUpdate(questionId, {
      title: title,
      content: content,
      subjectList: subjectList,
      textbookList: textbookList,
      schoolList: schoolList,
    });
    res.status(201).send('Success');
  }
);

export { router as editQuestionRouter };
