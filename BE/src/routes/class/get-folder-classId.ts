import { parseTimestampToDateString } from './../../utils/date-parser';
import {
  GetFolderByClassId,
  GetFolderByClassIdResponse,
} from './../../types/class';
import { Class } from '../../models';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/classes/:id/folders',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const limit = Number(req.query.limit);
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();

      const GetFolder = await Class.findById({
        _id: id,
      }).populate({
        path: 'folderList',
        match: { name: { $regex: new RegExp(searchText, 'i') } },
        options: { limit: limit },
      });

      const getFolderNoLimit = await Class.findById(id);
      const isEnd = (getFolderNoLimit?.folderList.length ?? 0) <= limit;

      const folderList: GetFolderByClassId[] = [];
      GetFolder?.folderList.forEach((folder) => {
        const folderCard: GetFolderByClassId = {
          id: folder.id as string,
          name: folder.name,
          numOfSets: folder.studySetList?.length ?? 0,
          createAt: parseTimestampToDateString(folder.createdAt),
        };
        folderList.push(folderCard);
      });

      const response: GetFolderByClassIdResponse = {
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

export { router as getFolderByClassIdRouter };
