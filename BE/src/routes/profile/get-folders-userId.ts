import { parseTimestampToDateString } from './../../utils/date-parser';
import { User } from '../../models/user';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { GetFolderByUserId, GetFolderByUserIdResponse } from '../../types';
// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/users/:id/folders',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const limit = Number(req.query.limit);
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();

      const GetFolder = await User.findById({
        _id: id,
      }).populate({
        path: 'folderList',
        options: { limit: limit },
        match: { name: { $regex: new RegExp(searchText, 'i') } },
      });

      const getFolderNoLimit = await User.findById(id);
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

export { router as getFolderByUserIdRouter };
