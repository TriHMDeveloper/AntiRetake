import express, { NextFunction, Request, Response } from 'express';
import { Folder, User } from '../../models/';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/folders',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const { name, description } = req.body;
      const currentUserUid = req.currentUser?.uid;
      const user = await User.findOne({ uid: currentUserUid });
      const checkNameIsExist = await Folder.findOne({
        owner: user?.id,
        name: name,
      });

      if (!checkNameIsExist) {
        const newFolder = Folder.build({
          name,
          owner: user!,
          description,
          studySetList: [],
        });
        await newFolder.save();

        await User.findByIdAndUpdate(user?.id, {
          $push: { folderList: newFolder },
        });
        const getFolder = await Folder.findById(newFolder.id);
        res.status(201).send(getFolder);
      } else {
        throw new BadRequestError('Name is duplicate');
      }
    } catch (error) {
      next(error);
    }
  }
);

export { router as createFolderRouter };
