import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { BadRequestError } from '../../errors';
import { StudySet, User } from '../../models';
import { StudySetInfo } from '../../types';
import { parseTimestampToDateString } from '../../utils/date-parser';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/sets/:studySetId/info',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let currentUserId = '';
      if (req.currentUser) {
        const currentUserIDFirebase = req.currentUser?.uid;
        const currentUser = await User.findOne({ uid: currentUserIDFirebase });
        currentUserId = currentUser?.id;
      }

      const studySet = await StudySet.findById({
        _id: req.params.studySetId,
      }).catch((error) => {
        throw new BadRequestError('Study set is not exist !');
      });

      const studySets = await StudySet.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.studySetId) } },
        {
          $addFields: {
            averageRating: {
              $avg: '$rateList.rating',
            },
          },
        },
      ]);

      // if (!studySets) {
      //   throw new BadRequestError('Study set is not exist !');
      // }

      await StudySet.populate(studySets, {
        path: 'textbook',
        select: 'name',
      });

      await StudySet.populate(studySets, {
        path: 'subject',
        select: 'name',
      });

      await StudySet.populate(studySets, {
        path: 'owner',
        select: ['username', 'avatarUrl'],
      });

      const owner = studySets[0].owner;
      const textbook = studySets[0].textbook;
      const subject = studySets[0].subject;
      let currentUserRating;

      if (currentUserId.length > 0) {
        const currentUserRate = studySets[0].rateList.find(
          (rate: any) => rate.ratedBy.toString() === currentUserId
        );
        currentUserRating = currentUserRate ? currentUserRate.rating : 0;
      }

      const studySetInfo: StudySetInfo = {
        id: studySets[0]._id as string,
        name: studySets[0].name,
        numOfTerms: studySets[0].flashcardList.length,
        rating: studySets[0].averageRating
          ? Number(studySets[0].averageRating.toFixed(1))
          : 0,
        numOfRates: studySets[0].rateList.length,
        owner: {
          id: owner.id as string,
          name: owner.username as string,
          avaUrl: owner.avatarUrl as string,
        },
        textbook: {
          id: textbook.id as string,
          name: textbook.name,
        },
        subject: {
          id: subject.id as string,
          name: subject.name,
        },
        createdAt: parseTimestampToDateString(studySets[0].createdAt),
        description: studySets[0].description,
        accessModifier: studySets[0].accessModifier as string,
      };

      const response: StudySetInfo = !isNaN(currentUserRating)
        ? {
            ...studySetInfo,
            currentUserRating,
          }
        : { ...studySetInfo };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getStudySetInfoRouter };
