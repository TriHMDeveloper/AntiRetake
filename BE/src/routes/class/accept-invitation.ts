import express, { NextFunction, Request, Response } from 'express';
import { ClassRole, NotificationType } from '../../constants';
import { ResponseJoinRequestType } from '../../constants/response-join-request-type';
import { NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { addNotification, Class, User } from '../../models/';
import { UserDoc } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/classes/:classId/accept',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classId = req.params.classId;
      const currentUserReq = req.currentUser;
      if (currentUserReq) {
        const user = await User.findOne({ uid: currentUserReq.uid });
        const member = {
          member: user!,
          joinedAt: new Date(),
          role: ClassRole.VIEWER,
        };
        await Class.findByIdAndUpdate(classId, {
          $push: { memberList: member },
          $pull: {
            inviteList: {
              inviteTo: user?.id,
            },
          },
        });
        const getClass = await Class.findById(classId);
        await User.findByIdAndUpdate(user?.id, {
          $push: { classList: getClass },
        });

        const currentClass = await Class.findById(classId);
        const recipient = await User.findOne({
          _id: getClass?.owner._id,
        });
        const recipientListNoti = [
          { recipient: recipient as UserDoc, isRead: false },
        ];
        await addNotification(
          user!,
          recipientListNoti,
          NotificationType.CLASS,
          `${user?.username} has accepted your invitation to join the ${currentClass?.name}`,
          `/classes/${classId}/members`
        );
        res.status(201).send('Accespt success');
      } else {
        throw new NotAuthorizedError();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as acceptInviteRouter };
