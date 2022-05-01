import { getSubject } from '../../types';
import { Subject } from '../../models';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();
router.get(
  '/api/common/subjects',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();

      const getSubject = await Subject.aggregate([
        {
          $match: { name: { $regex: new RegExp(searchText, 'i') } },
        },
      ]).limit(15);

      const subjectInfo: getSubject[] = getSubject
        .filter((school) => school.name.length > 0)
        .map((school) => {
          return {
            id: school._id as string,
            name: school.name as string,
          };
        });

      res.status(200).send(subjectInfo);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getSubjectRouter };
