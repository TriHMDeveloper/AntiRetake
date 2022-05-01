import { getTextBook } from '../../types';
import { Textbook } from '../../models';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();
router.get(
  '/api/common/textbooks',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();

      const getTextBook = await Textbook.aggregate([
        {
          $match: { name: { $regex: new RegExp(searchText, 'i') } },
        },
      ]).limit(15);

      const textBookInfo: getTextBook[] = getTextBook
        .filter((textbook) => textbook.name.length > 0)
        .map((textbook) => {
          return {
            id: textbook._id as string,
            name: textbook.name as string,
          };
        });

      res.status(200).send(textBookInfo);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getTextBookRouter };
