import express, { NextFunction, Request, Response } from 'express';
import { Folder, User } from '../../models';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';

// eslint-disable-next-line new-cap
const router = express.Router();

router.put(
  '/api/folders/:id',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const folderId = req.params.id;
      const { name, description } = req.body;
      const currentUserUid = req.currentUser?.uid;
      const user = await User.findOne({ uid: currentUserUid });
      const checkNameIsExist = await Folder.findOne({
        owner: user?.id,
        name: name,
      });
      const checkOldNameFolder = await Folder.findById(folderId);
      const oldName = checkOldNameFolder?.name as string;
      if (!checkNameIsExist || oldName === name) {
        await Folder.findByIdAndUpdate(folderId, {
          name: name,
          description: description,
        });
        res.status(201).send('Successfully');
      } else {
        throw new BadRequestError('Name is duplicate');
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router as editFolderRouter };
