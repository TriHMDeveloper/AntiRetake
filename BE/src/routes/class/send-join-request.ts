import express, { NextFunction, Request, Response } from 'express';
import { Class, User, School, addNotification } from '../../models/';
import { decodeToken } from '../../middlewares';
import { BASE_URL, ClassRole, NotificationType } from '../../constants';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { UserDoc } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/classes/:classId/requests',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const { message } = req.body;
      const classId = req.params.classId;
      const currentUserUid = req.currentUser?.uid;
      const user = await User.findOne({ uid: currentUserUid });
      const joinRequest = {
        requestedBy: user!,
        message: message as string,
        sentAt: new Date(),
      };
      await Class.findByIdAndUpdate(classId, {
        $push: { joinRequestList: joinRequest },
      });

      const currentClass = await Class.findById(classId).populate({
        path: 'owner',
        select: ['uid', 'username'],
      });
      const classOwner = currentClass?.owner;
      const recipient = await User.findOne({
        uid: classOwner?.uid,
      });
      const recipientListNoti = [
        { recipient: recipient as UserDoc, isRead: false },
      ];
      await addNotification(
        user!,
        recipientListNoti,
        NotificationType.CLASS,
        `${user?.username} has sent you a request to join the ${currentClass?.name}`,
        `/classes/${classId}/requests`
      );
      res.status(201).send('Send success');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as sendJoinRouter };
