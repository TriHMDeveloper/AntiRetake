import express, { NextFunction, Request, Response } from 'express';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Class, Folder, StudySet, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/classes/:classId/folders/:folderId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const classId = req.params.classId;
      const folderId = req.params.folderId;

      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const folder = await Folder.findById(folderId).populate({
        path: 'owner',
        select: 'email',
      });
      const folderOwnerId = folder?.owner.id;

      const klass = await Class.findById(classId).populate({
        path: 'owner',
        select: 'email',
      });
      const classOwnerId = klass?.owner.id;

      const isRemovable =
        currentUserId.toString() === folderOwnerId.toString() ||
        currentUserId.toString() === classOwnerId.toString();

      if (!isRemovable) {
        throw new ForbiddenError();
      }

      await Class.findByIdAndUpdate(classId, {
        $pull: {
          folderList: folderId,
        },
      });

      res.status(200).send('Success!!!');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as removeFolderInClassRouter };
