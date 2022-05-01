import express, { NextFunction, Request, Response } from 'express';
import { NotificationType, BASE_URL } from '../../constants';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { addNotification, Class, Folder, User } from '../../models';
import { UserDoc } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/classes/:id/folders/add',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.currentUser) {
        const classId = req.params.id;
        const folderId = req.query.folderId;
        const currentUser = await User.findOne({ uid: req.currentUser.uid });
        const currentUserId = currentUser?.id;

        const folder = await Folder.findById(folderId).populate({
          path: 'owner',
          select: 'email',
        });
        const folderOwnerId = folder?.owner._id;

        const isAddable = currentUserId.toString() === folderOwnerId.toString();
        if (!isAddable) {
          throw new ForbiddenError();
        }

        await Class.findByIdAndUpdate(classId, {
          $push: {
            folderList: folderId,
          },
        });

        const currentClass = await Class.findById(classId);

        const recipientList = currentClass?.memberList.map((member) => {
          return member.member;
        });
        const recipientListNoti = recipientList
          ?.filter(
            (recipient) =>
              recipient._id.toString() !== currentUser?._id.toString()
          )
          .map((recipient) => {
            return {
              recipient: recipient as UserDoc,
              isRead: false,
            };
          });
        await addNotification(
          currentUser!,
          recipientListNoti ?? [],
          NotificationType.CLASS,
          `${currentUser?.username} added a new folder to the ${currentClass?.name}`,
          `/folders/${folderId}`
        );

        res.status(200).send(currentClass);
      } else {
        throw new NotAuthorizedError();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as addFolderToClassRouter };
