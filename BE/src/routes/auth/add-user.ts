import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { auth } from '../../config';
import { NotAuthorizedError } from '../../errors';
import { decodeToken } from '../../middlewares';
import { User } from '../../models';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/auth/add-user',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserReq = req.currentUser;
      if (currentUserReq) {
        const currentUser = await auth.getUser(currentUserReq.uid);

        const user = await User.build({
          uid: currentUserReq.uid,
          username: currentUser.displayName ?? '',
          email: currentUser.email ?? '',
          avatarUrl: currentUser.photoURL ?? '',
          classList: [],
          folderList: [],
          studySetList: [],
          recentList: [],
          learnList: [],
          questionList: [],
        });
        await user.save();
        res.status(201).send(user);
      } else {
        throw new NotAuthorizedError();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as addUserRouter };
