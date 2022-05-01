import { parseTimestampToDateString } from './../../utils/date-parser';
import { User, Class } from '../../models';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { GetFolderByUserId, GetFolderByUserIdResponse } from '../../types';
// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/users/folders/personal',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const limit = Number(req.query.limit);
      const currentUserIDFirebase = req.currentUser?.uid;
      const currentUser = await User.findOne({ uid: currentUserIDFirebase });
      const currentUserId = currentUser?.id;
      const classId = req.query.classId;
      const classSave = await Class.findById(classId);
      const folderListOfClass = classSave?.folderList;
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();

      const match = classSave
        ? {
            $and: [
              { name: { $regex: new RegExp(searchText, 'i') } },
              {
                _id: {
                  $nin: folderListOfClass,
                },
              },
            ],
          }
        : {
            name: { $regex: new RegExp(searchText, 'i') },
          };

      const GetFolder = await User.findById({
        _id: currentUserId,
      }).populate({
        path: 'folderList',
        match: match,
        options: { limit: limit },
      });

      const getFolderNoLimit = await User.findById(currentUserId);
      const isEnd = (getFolderNoLimit?.folderList.length ?? 0) <= limit;

      const folderList: GetFolderByUserId[] = [];
      GetFolder?.folderList.forEach((folder) => {
        const folderCard: GetFolderByUserId = {
          id: folder.id as string,
          name: folder.name,
          numOfSets: folder.studySetList?.length ?? 0,
          createdAt: parseTimestampToDateString(folder.createdAt),
        };
        folderList.push(folderCard);
      });

      const response: GetFolderByUserIdResponse = {
        folderList,
        isEnd,
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as getPersonalFolderRouter };
