import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { BASE_URL, NotificationType, VoteType } from '../../constants';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { addNotification, Question, User } from '../../models';
import { UserDoc, Vote } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/forum/questions/:questionId/vote',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const questionId = req.params.questionId;
      const voteType: VoteType = req.query.type as VoteType;
      const currentUserUid = (await User.findOne({ uid: req.currentUser?.uid }))
        ?.id;
      const currentTime = new Date();

      const isVoted = await Question.count({
        _id: questionId,
        'voteList.votedBy': currentUserUid,
      });

      isVoted > 0
        ? await Question.updateOne(
            { _id: questionId, 'voteList.votedBy': currentUserUid },
            {
              $set: {
                'voteList.$.type': voteType,
                'voteList.$.votedAt': currentTime,
              },
            }
          )
        : await Question.updateOne(
            { _id: questionId },
            {
              $push: {
                voteList: {
                  votedBy: new mongoose.Types.ObjectId(currentUserUid),
                  type: voteType,
                  votedAt: currentTime,
                },
              },
            }
          );

      const response: Vote = {
        votedBy: currentUserUid,
        votedAt: currentTime,
        type: voteType,
      };

      res.status(201).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as voteQuestionRouter };
