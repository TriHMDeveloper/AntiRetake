import { getSchool } from '../../types';
import { School } from '../../models';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

// eslint-disable-next-line new-cap
const router = express.Router();
router.get(
  '/api/common/schools',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();

      const getSchool = await School.aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: new RegExp(searchText, 'i') } },
              { country: { $regex: new RegExp(searchText, 'i') } },
            ],
          },
        },
      ]).limit(15);

      const schoolInfo: getSchool[] = getSchool.map((school) => {
        return {
          id: school._id as string,
          name: school.name as string,
          country: school.country as string,
        };
      });
      res.status(200).send(schoolInfo);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
export { router as getSchoolRouter };
