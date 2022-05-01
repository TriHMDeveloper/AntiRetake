import { decodeToken } from './../../middlewares/require-auth';
import { UserInfo } from './../../types/user';
import { User } from '../../models/user';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/profile',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserUid = req.currentUser?.uid;
      const getUser = await User.findOne({ uid: currentUserUid });
      const userInfo: UserInfo = {
        id: getUser?.id as string,
        username: getUser?.username as string,
        avatarUrl: getUser?.avatarUrl as string,
        email: getUser?.email as string,
      };
      res.status(200).send(userInfo);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as getMyProfileInfoRouter };
