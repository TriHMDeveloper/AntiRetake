import { folderInfo } from '../../types';
import { Folder, User } from '../../models';
import express, { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../errors';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();
router.get(
  '/api/folders/:id/info',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const getFolder = await Folder.findById({
        _id: id,
      }).catch((error) => {
        throw new BadRequestError('Folder is not exist !');
      });

      const getOwner = await User.findById(getFolder?.owner);
      const folderInfo: folderInfo = {
        id: getFolder?.id as string,
        name: getFolder?.name as string,
        username: getOwner?.username as string,
        ownerId: getOwner?.id as string,
        numOfSets: getFolder?.studySetList.length ?? 0,
        description: getFolder?.description as string,
      };
      res.status(200).send({ folderInfo });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getFolderInfoRouter };
