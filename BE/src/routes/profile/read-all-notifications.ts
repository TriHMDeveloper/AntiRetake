import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { Notification, User } from '../../models';
import { NotificationItem, NotificationRespone } from '../../types';
import { parseTimestampToDateString } from '../../utils';
// eslint-disable-next-line new-cap
const router = express.Router();

router.put(
  '/api/profile/notifications',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const currentUserIDFirebase = req.currentUser?.uid;
      const currentUser = await User.findOne({ uid: currentUserIDFirebase });
      const currentUserId = currentUser?.id;

      await Notification.updateMany(
        { recipient: currentUserId },
        {
          isRead: true,
        }
      );

      res.status(200).send('Read notifications successfully');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as readAllNotificationsRouter };
