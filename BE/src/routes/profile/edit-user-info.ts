import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { decodeToken } from '../../middlewares';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { User } from '../../models';
import { EditUserInfoRequest } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.put(
  '/api/profile',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const request: EditUserInfoRequest = req.body;

      const currentUserUid = req.currentUser?.uid;
      const editInfo = request.name
        ? {
            username: request.name,
          }
        : request.avatarUrl
        ? {
            avatarUrl: request.avatarUrl,
          }
        : null;
      editInfo &&
        (await User.updateOne(
          {
            uid: currentUserUid,
          },
          {
            $set: editInfo,
          }
        ));

      res.status(200).send('Successfully');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as editUserInfoRouter };
