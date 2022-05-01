import express, { NextFunction, Request, Response } from 'express';
import { BASE_URL, NotificationType } from '../../constants';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { addNotification, Class, StudySet, User } from '../../models';
import { UserDoc } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/classes/:id/add-study-set-to-class',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.currentUser) {
        const classId = req.params.id;
        const studySetId = req.query.studySetId;
        const currentUser = await User.findOne({ uid: req.currentUser.uid });
        const currentUserId = currentUser?.id;

        const studySet = await StudySet.findById(studySetId).populate({
          path: 'owner',
          select: 'email',
        });
        const studySetOwnerId = studySet?.owner._id;

        const isAddable =
          currentUserId.toString() === studySetOwnerId.toString();
        if (!isAddable) {
          throw new ForbiddenError();
        }

        await Class.findByIdAndUpdate(classId, {
          $push: {
            studySetList: studySetId,
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
          `${currentUser?.username} added a new study set to the ${currentClass?.name}`,
          `/classes/${classId}/sets`
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

export { router as addStudySetToClassRouter };
