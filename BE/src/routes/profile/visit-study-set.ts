import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { StudySet, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

// const toCardList = () => {};

router.put(
  '/api/sets/:id/visit',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const currentTime = new Date();
      const currentUserUid = req.currentUser?.uid;
      const studySetId = req.params.id;

      const isStudySetExist = await StudySet.findById(studySetId).catch(
        (error) => {
          throw new BadRequestError('Study set is not exist !');
        }
      );

      const isExist = await User.count({
        uid: currentUserUid,
        'recentList.studySet': studySetId,
      });

      isExist > 0
        ? await User.updateOne(
            { uid: currentUserUid, 'recentList.studySet': studySetId },
            { $set: { 'recentList.$.visitedAt': currentTime } }
          )
        : await User.updateOne(
            { uid: currentUserUid },
            {
              $push: {
                recentList: {
                  studySet: new mongoose.Types.ObjectId(studySetId),
                  visitedAt: currentTime,
                },
              },
            }
          );

      res.status(200).send('Successfully');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as visitStudySetRouter };
