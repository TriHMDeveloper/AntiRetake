import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { VoteType } from '../../constants';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Question, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/forum/questions/:questionId/vote',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const questionId = req.params.questionId;
      const currentUserUid = (await User.findOne({ uid: req.currentUser?.uid }))
        ?.id;

      await Question.findByIdAndUpdate(questionId, {
        $pull: {
          voteList: {
            votedBy: currentUserUid,
          },
        },
      });

      res.status(204).send('Success');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as deleteVoteQuestionRouter };
