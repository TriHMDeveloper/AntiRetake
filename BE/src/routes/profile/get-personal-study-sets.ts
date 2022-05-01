import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { Class, Folder, StudySet, User } from '../../models';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { GetPersonalStudySetResponse, StudySetCardPopup } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/users/sets/personal',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const limit = Number(req.query.limit);
      const currentUserIDFirebase = req.currentUser?.uid;
      const currentUser = await User.findOne({ uid: currentUserIDFirebase });
      const currentUserId = currentUser?.id;
      const classId = req.query.classId;
      const folderId = req.query.folderId;

      const folderSave = await Folder.findById(folderId);
      const classSave = await Class.findById(classId);

      const studySets = folderSave
        ? await StudySet.aggregate([
            {
              $match: {
                $and: [
                  { name: { $regex: new RegExp(searchText, 'i') } },
                  { owner: new mongoose.Types.ObjectId(currentUserId) },
                  { _id: { $nin: folderSave.studySetList } },
                ],
              },
            },
            {
              $limit: limit,
            },
          ])
        : classSave
        ? await StudySet.aggregate([
            {
              $match: {
                $and: [
                  { name: { $regex: new RegExp(searchText, 'i') } },
                  { owner: new mongoose.Types.ObjectId(currentUserId) },
                  { _id: { $nin: classSave.studySetList } },
                ],
              },
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
                  { owner: new mongoose.Types.ObjectId(currentUserId) },
                ],
              },
            },
            {
              $limit: limit,
            },
          ]);

      const totalRecords = await StudySet.count({
        name: { $regex: new RegExp(searchText, 'i') },
        owner: new mongoose.Types.ObjectId(currentUserId),
      });

      const studySetCardList: StudySetCardPopup[] = studySets.map(
        (studySet) => {
          return {
            id: studySet._id as string,
            name: studySet.name,
          };
        }
      );

      const isEnd = totalRecords <= limit;
      const response: GetPersonalStudySetResponse = {
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

export { router as getPersonalStudySetRouter };
