import express, { NextFunction, Request, Response } from 'express';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Class, Folder, StudySet, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/folders/:folderId/sets/:studySetId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const folderId = req.params.folderId;
      const studySetId = req.params.studySetId;

      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const studySet = await StudySet.findById(studySetId).populate({
        path: 'owner',
        select: 'email',
      });
      const studySetOwnerId = studySet?.owner.id;

      const folder = await Folder.findById(folderId).populate({
        path: 'owner',
        select: 'email',
      });
      const folderOwnerId = folder?.owner.id;

      const isRemovable =
        currentUserId.toString() === studySetOwnerId.toString() ||
        currentUserId.toString() === folderOwnerId.toString();

      if (!isRemovable) {
        throw new ForbiddenError();
      }

      await Folder.findByIdAndUpdate(folderId, {
        $pull: {
          studySetList: studySetId,
        },
      });

      res.status(200).send('Success!!!');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as removeStudySetInFolderRouter };
