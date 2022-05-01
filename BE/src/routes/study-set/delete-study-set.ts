import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';
import { Class, Flashcard, Folder, StudySet, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/sets/:studySetId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const studySetId = req.params.studySetId;

      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const currentStudySet = await StudySet.findById(studySetId);
      const studySetOwnerId = currentStudySet?.owner._id;

      const isRemovable =
        currentUserId.toString() === studySetOwnerId.toString();

      if (!isRemovable) {
        throw new ForbiddenError();
      }

      await Class.updateMany(
        { studySetList: { $elemMatch: { $eq: studySetId } } },
        {
          $pull: {
            studySetList: studySetId,
          },
        }
      );

      await Folder.updateMany(
        { studySetList: { $elemMatch: { $eq: studySetId } } },
        {
          $pull: {
            studySetList: studySetId,
          },
        }
      );

      await Flashcard.deleteMany({
        _id: { $in: currentStudySet?.flashcardList },
      });

      await User.findByIdAndUpdate(currentUserId, {
        $pull: {
          studySetList: studySetId,
        },
      });

      await User.updateMany(
        {
          $or: [
            { recentList: { $elemMatch: { studySet: studySetId } } },
            { learnList: { $elemMatch: { studySetId: studySetId } } },
          ],
        },
        {
          $pull: {
            recentList: { studySet: studySetId },
            learnList: { studySetId: studySetId },
          },
        }
      );

      await StudySet.findByIdAndDelete(studySetId);

      res.status(204).send('Success!!!');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as deleteStudySetRouter };
