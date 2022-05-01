import express, { NextFunction, Request, Response } from 'express';
import { User } from '../../models';
import { UserCard, UserSearchResponse } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/search/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const skip = (page - 1) * limit;

      const users = await User.find({
        $or: [
          { username: { $regex: new RegExp(searchText, 'i') } },
          { email: { $regex: new RegExp(searchText, 'i') } },
        ],
      })
        .skip(skip)
        .limit(limit);

      const totalRecords = await User.count({
        $or: [
          { username: { $regex: new RegExp(searchText, 'i') } },
          { email: { $regex: new RegExp(searchText, 'i') } },
        ],
      });

      const userCardList: UserCard[] = users.map((user) => {
        return {
          uid: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          numOfClasses: user.classList.length,
          numOfSets: user.studySetList.length,
        };
      });

      const response: UserSearchResponse = { userCardList, totalRecords };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as searchUserRouter };
