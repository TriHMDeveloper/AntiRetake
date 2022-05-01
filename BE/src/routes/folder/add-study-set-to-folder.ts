import express, { NextFunction, Request, Response } from 'express';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Class, Folder, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/folders/:id/add-study-set-to-folder',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.currentUser) {
        const folderId = req.params.id;
        const studySetId = req.query.studySetId;
        const currentUser = await User.findOne({ uid: req.currentUser.uid });
        const currentUserId = currentUser?.id;

        const folder = await Folder.findById(folderId).populate({
          path: 'owner',
          select: 'email',
        });
        const folderOwnerId = folder?.owner._id;

        const isAddable = currentUserId.toString() === folderOwnerId.toString();
        if (!isAddable) {
          throw new ForbiddenError();
        }

        await Folder.findByIdAndUpdate(folderId, {
          $push: {
            studySetList: studySetId,
          },
        });

        const currentClass = await Folder.findById(folderId);

        res.status(200).send(currentClass);
      } else {
        throw new NotAuthorizedError();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as addStudySetToFolderRouter };
