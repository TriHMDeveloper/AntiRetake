import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { StudySet, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/sets/:studySetId/rate',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const studySetId = req.params.studySetId;
      const rating = Number(req.query.rate);
      const currentTime = new Date();

      const currentUserIDFirebase = req.currentUser?.uid;
      const currentUser = await User.findOne({ uid: currentUserIDFirebase });
      const currentUserId = currentUser?.id;

      const isExist = await StudySet.count({
        _id: studySetId,
        'rateList.ratedBy': currentUserId,
      });

      isExist > 0
        ? await StudySet.updateOne(
            { _id: studySetId, 'rateList.ratedBy': currentUserId },
            {
              $set: {
                'rateList.$.rating': rating,
                'rateList.$.ratedAt': currentTime,
              },
            }
          )
        : await StudySet.updateOne(
            {
              _id: studySetId,
            },
            {
              $push: {
                rateList: {
                  rating: rating,
                  ratedBy: currentUserId,
                  ratedAt: currentTime,
                },
              },
            }
          );

      res.status(201).send('Successfully');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as rateStudySetRouter };
