import express, { NextFunction, Request, Response } from 'express';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Class, StudySet, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/classes/:classId/sets/:studySetId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const classId = req.params.classId;
      const studySetId = req.params.studySetId;

      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const studySet = await StudySet.findById(studySetId).populate({
        path: 'owner',
        select: 'email',
      });
      const studySetOwnerId = studySet?.owner.id;

      const klass = await Class.findById(classId).populate({
        path: 'owner',
        select: 'email',
      });
      const classOwnerId = klass?.owner.id;

      const isRemovable =
        currentUserId.toString() === studySetOwnerId.toString() ||
        currentUserId.toString() === classOwnerId.toString();

      if (!isRemovable) {
        throw new ForbiddenError();
      }

      await Class.findByIdAndUpdate(classId, {
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

export { router as removeStudySetInClassRouter };
