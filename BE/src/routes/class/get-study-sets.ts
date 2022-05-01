import express, { NextFunction, Request, Response } from 'express';
import { Class, User } from '../../models';
import {
  FilterRequest,
  GetStudySetResponse,
  StudySetCard,
  StudySetDoc,
} from '../../types';
import { parseTimestampToDateString } from '../../utils';
import { AccessModifier, SortBy } from '../../constants';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';

// eslint-disable-next-line new-cap
const router = express.Router();

const averageRating = (studySet: StudySetDoc) => {
  return studySet.rateList.length === 0
    ? 0
    : Number(
        (
          studySet.rateList
            .map((rate) => rate.rating)
            .reduce((pre, cur) => pre + cur, 0) / studySet.rateList.length
        ).toFixed(1)
      );
};

router.post(
  '/api/classes/:classId/sets',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit);
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const sortBy: SortBy = req.query.sortBy as SortBy;
      const filter: FilterRequest = req.body;
      const isFilterEmpty =
        filter.subject.length === 0 && filter.textbook.length === 0;
      let currentUserId = '';

      if (req.currentUser) {
        const currentUserIDFirebase = req.currentUser?.uid;
        const currentUser = await User.findOne({ uid: currentUserIDFirebase });
        currentUserId = currentUser?.id;
      }
      const classOwnerId =
        (
          await Class.findById(req.params.classId).populate({
            path: 'owner',
            select: 'name',
          })
        )?.owner.id ?? '';

      const checkOwner =
        currentUserId.length > 0
          ? currentUserId === classOwnerId
            ? [
                { accessModifier: AccessModifier.PUBLIC },
                { accessModifier: AccessModifier.PRIVATE },
              ]
            : [
                { accessModifier: AccessModifier.PUBLIC },
                {
                  $and: [
                    {
                      $or: [
                        { owner: new mongoose.Types.ObjectId(currentUserId) },
                      ],
                    },
                    { accessModifier: AccessModifier.PRIVATE },
                  ],
                },
              ]
          : [{ accessModifier: AccessModifier.PUBLIC }];

      const currentUserClass = isFilterEmpty
        ? await Class.findById(req.params.classId).populate({
            path: 'studySetList',
            match: {
              $and: [
                { name: { $regex: new RegExp(searchText, 'i') } },
                {
                  $or: checkOwner,
                },
              ],
            },
            populate: [
              { path: 'textbook', select: 'name' },
              { path: 'subject', select: 'name' },
              { path: 'owner', select: ['uid', 'username', 'avatarUrl'] },
            ],
          })
        : await Class.findById(req.params.classId).populate({
            path: 'studySetList',
            match: {
              $and: [
                { name: { $regex: new RegExp(searchText, 'i') } },
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
            },
            populate: [
              { path: 'textbook', select: 'name' },
              { path: 'subject', select: 'name' },
              { path: 'owner', select: ['uid', 'username', 'avatarUrl'] },
            ],
          });

      sortBy === SortBy.DATE
        ? currentUserClass?.studySetList.sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : 1
          )
        : sortBy === SortBy.STAR
        ? currentUserClass?.studySetList.sort((a, b) =>
            averageRating(a) > averageRating(b) ? -1 : 1
          )
        : currentUserClass?.studySetList.sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : 1
          );

      const sliceStudysetList: StudySetDoc[] =
        currentUserClass?.studySetList.slice(0, limit) as StudySetDoc[];

      const classByID = await Class.findById(req.params.classId);
      const totalRecords = Number(classByID?.studySetList.length);
      const isEnd = totalRecords <= limit;

      const studySetCardList: StudySetCard[] = [];
      sliceStudysetList.forEach((studySet) => {
        const owner = studySet.owner;
        const textbook = studySet.textbook;
        const subject = studySet.subject;

        const card: StudySetCard = {
          id: studySet.id as string,
          name: studySet.name,
          numOfTerms: studySet.flashcardList.length,
          rating: averageRating(studySet),
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
        studySetCardList.push(card);
      });

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
export { router as getStudySetListByClassIDRouter };
