import express, { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../middlewares';
import { Class } from '../../models';
import { JoinRequestCard } from '../../types';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { parseTimestampToDateString } from '../../utils';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/classes/:id/join-request',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const classId = req.params.id;
      const currentClass = await Class.findById(classId).populate({
        path: 'joinRequestList.requestedBy',
        select: ['username', 'avatarUrl'],
      });

      const joinRequestList = currentClass?.joinRequestList ?? [];

      const response: JoinRequestCard[] = joinRequestList.map((joinRequest) => {
        return {
          id: joinRequest.requestedBy.id as string,
          name: joinRequest.requestedBy.username as string,
          avatarUrl: joinRequest.requestedBy.avatarUrl as string,
          sentAt: parseTimestampToDateString(joinRequest.sentAt),
          sentDate: joinRequest.sentAt,
          message: joinRequest.message as string,
        };
      });

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as joinRequestsRouter };
