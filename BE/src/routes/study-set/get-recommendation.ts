import express, { NextFunction, Request, Response } from 'express';
import { StudySet } from '../../models';
import { StudySetCard } from '../../types';
import { BadRequestError } from '../../errors';
import { parseTimestampToDateString } from '../../utils/date-parser';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/sets/:studySetId/recommendation',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studySet = await StudySet.findById(req.params.studySetId).catch(
        (error) => {
          throw new BadRequestError('Study set is not exist !');
        }
      );

      const currentStudySet = await StudySet.findById(req.params.studySetId);

      const studySets = await StudySet.aggregate([
        {
          $match: {
            $or: [
              {
                textbook: currentStudySet?.textbook,
              },
              {
                subject: currentStudySet?.subject,
              },
              { owner: currentStudySet?.owner },
            ],
          },
        },
        {
          $addFields: {
            averageRating: {
              $avg: '$rateList.rating',
            },
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $limit: 6,
        },
      ]);

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

      const response: StudySetCard[] = studySets
        .filter((studySet) => studySet._id.toString() !== req.params.studySetId)
        .map((studyset) => {
          const owner = studyset.owner;
          const textbook = studyset.textbook;
          const subject = studyset.subject;
          return {
            id: studyset._id as string,
            name: studyset.name,
            numOfTerms: studyset.flashcardList.length,
            rating: studyset.averageRating
              ? Number(studyset.averageRating.toFixed(1))
              : 0,
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
            createdAt: parseTimestampToDateString(studyset.createdAt),
          };
        });

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getRecommendationStudySetRouter };
