import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { Notification, User } from '../../models';
import { NotificationItem, NotificationRespone } from '../../types';
import { parseTimestampToNotiDateString } from '../../utils';
import { NotificationType } from '../../constants';
// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/profile/notifications',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const limit = Number(req.query.limit);

      const currentUserIDFirebase = req.currentUser?.uid;
      const currentUser = await User.findOne({ uid: currentUserIDFirebase });
      const currentUserId = currentUser?.id;

      const notificationList = await Notification.find({
        recipient: currentUserId,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate({ path: 'sender', select: ['username', 'avatarUrl'] });

      const notificationListLength = await Notification.count({
        recipient: currentUserId,
      });
      const isEnd = notificationListLength <= limit;
      const isReadAll = await Notification.count({
        recipient: currentUserId,
        isRead: false,
      });

      const notificationResponse: NotificationItem[] = notificationList.map(
        (notification) => {
          return {
            user: {
              id: notification.sender?._id as string,
              name: notification.sender?.username as string,
              avatarUrl: notification.sender?.avatarUrl as string,
            },
            notiType: notification.notiType as NotificationType,
            isRead: notification.isRead as boolean,
            message: notification.message as string,
            redirectUrl: notification.redirectUrl as string,
            createdAt: parseTimestampToNotiDateString(notification.createdAt),
          };
        }
      );

      const response: NotificationRespone = {
        notificationList: notificationResponse,
        isEnd: isEnd,
        isReadAll: isReadAll === 0,
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as getNotificationsRouter };
