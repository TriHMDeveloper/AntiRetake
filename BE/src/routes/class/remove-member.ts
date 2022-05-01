import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { BASE_URL, NotificationType } from '../../constants';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';
import { decodeToken } from '../../middlewares';
import { addNotification, Class, StudySet, User } from '../../models';
import { UserDoc } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/classes/:classId/members/:memberId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const classId = req.params.classId;
      const memberId = req.params.memberId;
      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const klass = await Class.findById(classId).populate({
        path: 'owner',
        select: 'email',
      });
      const classOwnerId = klass?.owner.id;

      const removable =
        currentUserId === classOwnerId && memberId !== classOwnerId;
      if (!removable) {
        throw new ForbiddenError();
      }

      const studySetList = await StudySet.find({ owner: currentUserId });
      const removedStudySetList = studySetList.map((studySet) => {
        return new mongoose.Types.ObjectId(studySet.id);
      });

      await Class.findByIdAndUpdate(classId, {
        $pull: {
          memberList: {
            member: memberId,
          },
          studySetList: {
            $in: removedStudySetList,
          },
        },
      });

      await User.findByIdAndUpdate(memberId, {
        $pull: {
          classList: classId,
        },
      });

      const sender = currentUser as UserDoc;
      const recipient = await User.findById(memberId);
      const recipientListNoti = [
        { recipient: recipient as UserDoc, isRead: false },
      ];
      await addNotification(
        sender,
        recipientListNoti,
        NotificationType.CLASS,
        `You were kicked out of the ${klass?.name} by ${sender?.username} `,
        `/classes/${classId}`
      );

      res.status(200).send('Success!!!');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as removeMemberRouter };
