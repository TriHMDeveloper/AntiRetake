import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Class, StudySet, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/classes/:classId/leave-class',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const classId = req.params.classId;
      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const klass = await Class.findById(classId).populate({
        path: 'owner',
        select: 'email',
      });
      const classOwnerId = klass?.owner.id;

      const isLeavable = currentUserId !== classOwnerId;
      if (!isLeavable) {
        throw new ForbiddenError();
      }

      const studySetList = await StudySet.find({ owner: currentUserId });
      const removedStudySetList = studySetList.map((studySet) => {
        return new mongoose.Types.ObjectId(studySet.id);
      });

      await Class.findByIdAndUpdate(classId, {
        $pull: {
          memberList: {
            member: currentUserId,
          },
          studySetList: {
            $in: removedStudySetList,
          },
        },
      });

      await User.findByIdAndUpdate(currentUserId, {
        $pull: {
          classList: classId,
        },
      });

      res.status(200).send('Success!!!');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as leaveClassRouter };
