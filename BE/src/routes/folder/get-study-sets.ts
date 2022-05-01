import express, { NextFunction, Request, Response } from 'express';
import { Folder, User } from '../../models';
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
  '/api/folders/:folderId/sets',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Number(req.query.limit);
      const filter: FilterRequest = req.body;
      const sortBy: SortBy = req.query.sortBy as SortBy;
      const isFilterEmpty =
        filter.subject.length === 0 && filter.textbook.length === 0;

      const currentUserUid = req.currentUser?.uid;
      const user = await User.findOne({ uid: currentUserUid });

      const currentUserFolder = isFilterEmpty
        ? await Folder.findById(req.params.folderId).populate({
            path: 'studySetList',
            match: {
              $or: [
                { accessModifier: AccessModifier.PUBLIC },
                {
                  $and: [
                    { owner: new mongoose.Types.ObjectId(user?.id) },
                    { accessModifier: AccessModifier.PRIVATE },
                  ],
                },
              ],
            },
            populate: [
              { path: 'textbook', select: 'name' },
              { path: 'subject', select: 'name' },
              { path: 'owner', select: ['uid', 'username', 'avatarUrl'] },
            ],
          })
        : await Folder.findById(req.params.folderId).populate({
            path: 'studySetList',
            match: {
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
                {
                  $or: [
                    { accessModifier: AccessModifier.PUBLIC },
                    {
                      $and: [
                        { owner: new mongoose.Types.ObjectId(user?.id) },
                        { accessModifier: AccessModifier.PRIVATE },
                      ],
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
        ? currentUserFolder?.studySetList.sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : 1
          )
        : sortBy === SortBy.STAR
        ? currentUserFolder?.studySetList.sort((a, b) =>
            averageRating(a) > averageRating(b) ? -1 : 1
          )
        : currentUserFolder?.studySetList.sort((a, b) =>
            a.createdAt > b.createdAt ? -1 : 1
          );

      const sliceStudysetList: StudySetDoc[] =
        currentUserFolder?.studySetList.slice(0, limit) as StudySetDoc[];

      const folder = await Folder.findById(req.params.folderId);
      const totalRecords = Number(folder?.studySetList.length);
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
export { router as getStudySetListByFolderIDRouter };
