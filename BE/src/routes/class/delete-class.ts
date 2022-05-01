import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ForbiddenError, NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { Class, User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/classes/:classId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.currentUser) {
        const classId = req.params.classId;

        const currentUser = await User.findOne({ uid: req.currentUser.uid });
        const currentUserId = currentUser?.id;

        const currentClass = await Class.findById(classId).populate({
          path: 'owner',
          select: 'email',
        });
        const classOwnerId = currentClass?.owner.id;

        const isRemovable =
          currentUserId.toString() === classOwnerId.toString();

        if (!isRemovable) {
          throw new ForbiddenError();
        }

        await User.updateMany(
          { id: { $in: currentClass?.memberList } },
          {
            $pull: {
              classList: classId,
            },
          }
        );

        await Class.findByIdAndDelete(classId);

        res.status(204).send('Success!!!');
      } else {
        throw new NotAuthorizedError();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as deleteClassRouter };
