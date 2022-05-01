import mongoose from 'mongoose';
import express, { NextFunction, Request, Response } from 'express';
import { BASE_URL, ClassRole, NotificationType } from '../../constants';
import { ResponseJoinRequestType } from '../../constants/response-join-request-type';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { addNotification, Class, User } from '../../models';
import { parseTimestampToDateString } from '../../utils';
import { UserDoc } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/classes/:classId/join-request',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const classId = req.params.classId;
      const userId = req.query.userId;
      const currentUserUid = req.currentUser?.uid;
      const currentUser = await User.findOne({ uid: currentUserUid });
      const type = req.query.type;

      if (type === ResponseJoinRequestType.ACCEPT) {
        await Class.findByIdAndUpdate(classId, {
          $push: {
            memberList: {
              member: userId,
              joinedAt: new Date().toDateString(),
              role: ClassRole.VIEWER,
            },
          },
        });

        await User.findByIdAndUpdate(userId, {
          $push: {
            classList: classId,
          },
        });
      }

      await Class.findByIdAndUpdate(classId, {
        $pull: {
          joinRequestList: {
            requestedBy: userId,
          },
        },
      });

      const currentClass = await Class.findById(classId);
      const recipient = await User.findOne({
        _id: userId,
      });
      const recipientListNoti = [
        { recipient: recipient as UserDoc, isRead: false },
      ];
      const notiRequestType =
        type === ResponseJoinRequestType.ACCEPT ? 'accepted' : 'denied';
      await addNotification(
        currentUser!,
        recipientListNoti,
        NotificationType.CLASS,
        `${currentUser?.username} has ${notiRequestType} your request to join the ${currentClass?.name}`,
        `/classes/${classId}/members`
      );

      res.status(200).send('Success!!!');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as responseJoinRequestRouter };
