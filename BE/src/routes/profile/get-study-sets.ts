import express, { NextFunction, Request, Response } from 'express';
import { StudySet, User } from '../../models';
import {
  StudySetCard,
  GetStudySetResponse,
  StudySetDoc,
  FilterRequest,
} from '../../types';
import { parseTimestampToDateString } from '../../utils';
import { AccessModifier, SortBy } from '../../constants';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/users/:userId/sets',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const limit = Number(req.query.limit);
      const sortBy: SortBy = req.query.sortBy as SortBy;
      const filter: FilterRequest = req.body;
      const isFilterEmpty =
        filter.subject.length === 0 && filter.textbook.length === 0;
      const userId = new mongoose.Types.ObjectId(req.params.userId);
      let currentUserId = '';

      if (req.currentUser) {
        const currentUserIDFirebase = req.currentUser?.uid;
        const currentUser = await User.findOne({ uid: currentUserIDFirebase });
        currentUserId = currentUser?.id;
      }

      const checkOwner =
        currentUserId.length > 0
          ? [
              { accessModifier: AccessModifier.PUBLIC },
              {
                $and: [
                  { owner: new mongoose.Types.ObjectId(currentUserId) },
                  { accessModifier: AccessModifier.PRIVATE },
                ],
              },
            ]
          : [{ accessModifier: AccessModifier.PUBLIC }];

      const studySets = isFilterEmpty
        ? await StudySet.aggregate([
            {
              $match: {
                $and: [
                  { name: { $regex: new RegExp(searchText, 'i') } },
                  {
                    $or: checkOwner,
                  },
                  { owner: userId },
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
              $limit: limit,
            },
          ])
        : await StudySet.aggregate([
            {
              $match: {
                $and: [
                  { name: { $regex: new RegExp(searchText, 'i') } },
                  {
                    $or: checkOwner,
                  },
                  { owner: userId },
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
            $or: checkOwner,
            owner: userId,
          })
        : await StudySet.count({
            name: { $regex: new RegExp(searchText, 'i') },
            $and: [
              {
                $or: checkOwner,
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
            owner: userId,
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

      const isEnd = totalRecords <= limit;
      const response: GetStudySetResponse = {
        studySetCardList,
        isEnd,
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as getStudySetListByUserIDRouter };
