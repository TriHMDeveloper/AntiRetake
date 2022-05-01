import { UserInfo } from './../../types/user';
import { User } from '../../models/user';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/users/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const getUser = await User.findById({
        _id: id,
      });

      if (!getUser) {
        throw new BadRequestError('User is not exist!');
      }

      const userInfo: UserInfo = {
        id: getUser?.id as string,
        username: getUser?.username as string,
        avatarUrl: getUser?.avatarUrl as string,
        email: getUser?.email as string,
      };
      res.status(200).send({ userInfo });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as getUserInfoRouter };
