import express, { Request, Response } from 'express';
import { User, School, Question, Textbook, Subject } from '../../models/';
import { decodeToken, validateRequest } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import mongoose from 'mongoose';
import { body } from 'express-validator';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/forum/questions',
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
    const currentUserUid = req.currentUser?.uid;
    const user = await User.findOne({ uid: currentUserUid });

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

    const newQuestion = Question.build({
      owner: user!,
      title: title,
      content: content,
      subjectList: subjectList,
      textbookList: textbookList,
      schoolList: schoolList,
      voteList: [],
      commentList: [],
    });
    await newQuestion.save();
    await User.findByIdAndUpdate(user?.id, {
      $push: { questionList: newQuestion },
    });
    res.status(201).send(newQuestion.id);
  }
);

export { router as createQuestionRouter };
