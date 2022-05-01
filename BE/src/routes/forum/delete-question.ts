import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { Question, User, Comment } from '../../models';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';
import { QuestionDoc } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/forum/questions/:questionId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const questionId = req.params.questionId;

      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const currentQuestion: QuestionDoc = await Question.findById(questionId)
        .populate({
          path: 'commentList',
          select: 'commentList',
        })
        .populate({ path: 'owner', select: 'email' });
      const questionOwnerId = currentQuestion.owner.id;

      const isRemovable =
        currentUserId.toString() === questionOwnerId.toString();

      if (!isRemovable) {
        throw new ForbiddenError();
      }

      await User.updateMany(
        { id: currentQuestion?.owner },
        {
          $pull: {
            questionList: questionId,
          },
        }
      );

      await Promise.all(
        currentQuestion.commentList.map(async (commend) => {
          await Comment.deleteMany({
            _id: { $in: commend.commentList },
          });
        })
      );

      await Comment.deleteMany({
        _id: { $in: currentQuestion?.commentList },
      });

      await Question.findByIdAndDelete(questionId);
      res.status(204).send('currentQuestion');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as deleteQuestionRouter };
