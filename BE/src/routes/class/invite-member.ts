import express, { NextFunction, Request, Response } from 'express';
import { addNotification, Class, User } from '../../models';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { UserDoc } from '../../types';
import { BASE_URL, NotificationType } from '../../constants';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/classes/:classId/members/invite',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const classId = req.params.classId;
      const memberIds = req.body.memberList;

      const currentUserId = req.currentUser?.uid;

      const currentUserClass = await Class.findById(classId).populate({
        path: 'owner',
        select: ['uid', 'username'],
      });

      const inviteList = memberIds.map((memberId: any) => {
        return {
          inviteTo: memberId,
          sentAt: new Date(),
        };
      });

      const checkOwner =
        currentUserClass?.owner.uid.toString() === currentUserId.toString();
      if (checkOwner) {
        await Class.findOneAndUpdate(
          {
            _id: classId,
          },
          {
            $push: { inviteList: { $each: inviteList } },
          }
        );

        const sender = currentUserClass?.owner as UserDoc;
        const recipientList = await User.find({
          _id: { $in: memberIds },
        });
        const recipientListNoti = recipientList.map((recipient) => {
          return {
            recipient: recipient as UserDoc,
            isRead: false,
          };
        });
        await addNotification(
          sender,
          recipientListNoti,
          NotificationType.CLASS,
          `${sender?.username} has sent you an invitation to join the ${currentUserClass?.name}`,
          `/classes/${classId}`
        );
      } else {
        throw new BadRequestError('You not class owner');
      }
      res.status(201).send('Invite to class successful.');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as inviteMemberRouter };
