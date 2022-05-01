import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AccessModifier, SortBy } from '../../constants';
import { Class } from '../../models';
import { parseTimestampToDateString } from '../../utils';
import { ClassCard, ClassSearchResponse, FilterRequest } from '../../types';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/search/classes',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchText = ((req.query.searchText as string) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const skip = (page - 1) * limit;
      const sortBy: SortBy = req.query.sortBy as SortBy;
      const filter: FilterRequest = req.body;

      const classes =
        filter.school.length > 0
          ? await Class.aggregate([
              {
                $match: {
                  $and: [
                    { name: { $regex: new RegExp(searchText, 'i') } },
                    {
                      school: {
                        $in: filter.school.map(
                          (id) => new mongoose.Types.ObjectId(id)
                        ),
                      },
                    },
                  ],
                },
              },
              {
                $sort:
                  sortBy === SortBy.DATE
                    ? { createdAt: -1 }
                    : sortBy === SortBy.ALPHABET
                    ? { name: -1 }
                    : { createdAt: -1 },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
            ])
          : await Class.aggregate([
              {
                $match: {
                  $and: [{ name: { $regex: new RegExp(searchText, 'i') } }],
                },
              },
              {
                $sort:
                  sortBy === SortBy.DATE
                    ? { createdAt: -1 }
                    : sortBy === SortBy.ALPHABET
                    ? { name: -1 }
                    : { createdAt: -1 },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
            ]);

      await Class.populate(classes, {
        path: 'school',
        select: 'name',
      });

      await Class.populate(classes, {
        path: 'folderList',
      });

      const totalRecords =
        filter.school.length > 0
          ? await Class.count({
              name: { $regex: new RegExp(searchText, 'i') },
              school: {
                $in: filter.school.map((id) => new mongoose.Types.ObjectId(id)),
              },
            })
          : await Class.count({
              name: { $regex: new RegExp(searchText, 'i') },
            });

      const classCardList: ClassCard[] = classes.map((klass) => {
        const school = klass.school;

        let numOfSets = 0;
        klass.folderList.forEach((folder: any) => {
          numOfSets += folder.studySetList.length;
        });
        numOfSets += klass.studySetList.length;

        return {
          id: klass._id as string,
          name: klass.name,
          school: {
            id: school.id,
            name: school.name,
          },
          numOfSets: numOfSets,
          numOfMembers: klass.memberList.length,
          createdAt: parseTimestampToDateString(klass.createdAt),
        };
      });

      const response: ClassSearchResponse = { classCardList, totalRecords };
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as searchClassRouter };
