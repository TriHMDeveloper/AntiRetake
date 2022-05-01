import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AccessModifier, SortBy } from '../../constants';
import { StudySet } from '../../models';
import {
  FilterRequest,
  StudySetCard,
  StudySetSearchResponse,
} from '../../types';
import { parseTimestampToDateString } from '../../utils';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/search/sets',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const skip = (page - 1) * limit;
      const sortBy: SortBy = req.query.sortBy as SortBy;
      const filter: FilterRequest = req.body;
      const isFilterEmpty =
        filter.subject.length === 0 && filter.textbook.length === 0;

      const studySets = isFilterEmpty
        ? await StudySet.aggregate([
            {
              // Public || Private of owner: Done by Xaki
              $match: {
                $and: [
                  { name: { $regex: new RegExp(searchText, 'i') } },
                  {
                    $or: [{ accessModifier: AccessModifier.PUBLIC }],
                  },
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
            {
              $sort:
                sortBy === SortBy.DATE
                  ? { createdAt: -1 }
                  : sortBy === SortBy.STAR
                  ? { averageRating: -1 }
                  : { createdAt: -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ])
        : await StudySet.aggregate([
            {
              $match: {
                $and: [
                  { name: { $regex: new RegExp(searchText, 'i') } },
                  {
                    $or: [{ accessModifier: AccessModifier.PUBLIC }],
                  },
                  {
                    $or: [
                      {
                        textbook: {
                          $in: filter.textbook.map(
                            (id) => new mongoose.Types.ObjectId(id)
                          ),
                        },
                      },
                      {
                        subject: {
                          $in: filter.subject.map(
                            (id) => new mongoose.Types.ObjectId(id)
                          ),
                        },
                      },
                    ],
                  },
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
            {
              $sort:
                sortBy === SortBy.DATE
                  ? { createdAt: -1 }
                  : sortBy === SortBy.STAR
                  ? { averageRating: -1 }
                  : { createdAt: -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
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

      const totalRecords = isFilterEmpty
        ? await StudySet.count({
            name: { $regex: new RegExp(searchText, 'i') },
            $or: [{ accessModifier: AccessModifier.PUBLIC }],
          })
        : await StudySet.count({
            name: { $regex: new RegExp(searchText, 'i') },
            $and: [
              {
                $or: [{ accessModifier: AccessModifier.PUBLIC }],
              },
              {
                $or: [
                  {
                    textbook: {
                      $in: filter.textbook.map(
                        (id) => new mongoose.Types.ObjectId(id)
                      ),
                    },
                  },
                  {
                    subject: {
                      $in: filter.subject.map(
                        (id) => new mongoose.Types.ObjectId(id)
                      ),
                    },
                  },
                ],
              },
            ],
          });

      const studySetCardList: StudySetCard[] = studySets.map((studySet) => {
        const owner = studySet.owner;
        const textbook = studySet.textbook;
        const subject = studySet.subject;

        return {
          id: studySet._id as string,
          name: studySet.name,
          numOfTerms: studySet.flashcardList.length,
          rating: studySet.averageRating
            ? Number(studySet.averageRating.toFixed(1))
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
          createdAt: parseTimestampToDateString(studySet.createdAt),
        };
      });

      const response: StudySetSearchResponse = {
        studySetCardList,
        totalRecords,
      };
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as searchStudySetRouter };
