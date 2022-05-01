import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';
import { Class, Folder, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/folders/:folderId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const folderId = req.params.folderId;

      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const currentFolder = await Folder.findById(folderId).populate({
        path: 'owner',
        select: 'email',
      });
      const folderOwnerId = currentFolder?.owner.id;

      const isRemovable = currentUserId.toString() === folderOwnerId.toString();

      if (!isRemovable) {
        throw new ForbiddenError();
      }

      await User.updateMany(
        { id: currentFolder?.owner },
        {
          $pull: {
            folderList: folderId,
          },
        }
      );

      await Class.updateMany(
        { folderList: { $elemMatch: { $eq: folderId } } },
        {
          $pull: {
            folderList: folderId,
          },
        }
      );

      await Folder.findByIdAndDelete(folderId);
      res.status(204).send('Success!!!');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as deleteFolderRouter };
