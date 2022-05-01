import express, { NextFunction, Request, Response } from 'express';
import { Class, User } from '../../models';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';
import mongoose from 'mongoose';
import { UserToInvite } from '../../types';
import { decodeToken } from '../../middlewares';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/classes/:classId/user-to-invite',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      //TODO: decodeToken
      const classId = req.params.classId;
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const limit = 15;

      const currentUserId = req.currentUser?.uid;

      const currentUserClass = await Class.findById(classId).populate({
        path: 'owner',
        select: 'uid',
      });

      if (currentUserClass?.owner.uid !== currentUserId) {
        throw new ForbiddenError();
      }
      const users = await User.aggregate([
        {
          $match: {
            $and: [
              {
                email: { $regex: new RegExp(searchText, 'i') },
              },
              {
                _id: {
                  $nin: currentUserClass.memberList.map((item) => item.member),
                },
              },
              {
                _id: {
                  $nin: currentUserClass.inviteList.map(
                    (item) => item.inviteTo
                  ),
                },
              },
              {
                _id: {
                  $nin: currentUserClass.joinRequestList.map(
                    (item) => item.requestedBy
                  ),
                },
              },
            ],
          },
        },
        {
          $limit: limit,
        },
      ]);
      const response: UserToInvite[] = [];
      users.forEach((user) => {
        const userToInviteCard: UserToInvite = {
          id: user._id,
          username: user.username,
          email: user.email,
        };
        response.push(userToInviteCard);
      });
      res.status(201).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getUserToInviteRouter };
