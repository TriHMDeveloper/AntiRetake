import express, { NextFunction, Request, Response } from 'express';
import { addNotification, Class, User } from '../../models';
import { BASE_URL, ClassRole, NotificationType } from '../../constants';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { UserDoc } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.put(
  '/api/classes/:classId/members/:memberId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const classId = req.params.classId;
      const memberId = new mongoose.Types.ObjectId(req.params.memberId);
      const role: ClassRole = req.query.role as ClassRole;

      if (role !== ClassRole.EDITOR && role !== ClassRole.VIEWER) {
        throw new BadRequestError('Choose another role');
      }

      const currentUserId = req.currentUser?.uid;

      const currentUserClass = await Class.findById(classId).populate({
        path: 'owner',
        select: ['uid', 'username'],
      });

      const checkOwner = currentUserClass?.owner.uid === currentUserId;
      if (checkOwner) {
        await Class.updateOne(
          {
            _id: classId,
            'memberList.member': memberId,
          },
          {
            $set: { 'memberList.$.role': role },
          }
        );
      } else {
        throw new BadRequestError('You not class owner');
      }

      const sender = currentUserClass?.owner as UserDoc;
      const recipient = await User.findById(memberId);
      const recipientListNoti = [
        { recipient: recipient as UserDoc, isRead: false },
      ];

      await addNotification(
        sender,
        recipientListNoti,
        NotificationType.CLASS,
        `${sender?.username} has changed your permission in the ${currentUserClass?.name} to ${role}`,
        `/classes/${classId}/members`
      );

      res.status(201).send('Edit member role successful.');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as editMemberRoleRouter };
