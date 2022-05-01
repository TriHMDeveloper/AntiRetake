import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { VoteType } from '../../constants';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { Comment, Question, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/forum/questions/:questionId/comments/:commentId/vote',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const questionId = req.params.questionId;
      const commentId = req.params.commentId;
      const currentUserUid = (await User.findOne({ uid: req.currentUser?.uid }))
        ?.id;

      await Comment.findByIdAndUpdate(commentId, {
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

export { router as deleteVoteCommentRouter };
