import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { auth } from '../../config';
import { SortBy, VoteType } from '../../constants';
import { Question } from '../../models';
import {
  FilterRequest,
  QuestionCard,
  QuestionSearchResponse,
} from '../../types';
import { parseTimestampToDateString } from '../../utils';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/search/questions',
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
      const isFilterEmpty =
        filter.subject.length === 0 &&
        filter.textbook.length === 0 &&
        filter.school.length === 0;

      const questions = isFilterEmpty
        ? await Question.aggregate([
            {
              $match: {
                $and: [
                  {
                    $or: [
                      { title: { $regex: new RegExp(searchText, 'i') } },
                      {
                        content: { $regex: new RegExp(searchText, 'i') },
                      },
                    ],
                  },
                ],
              },
            },
            {
              $addFields: {
                numOfUpvotes: {
                  $size: {
                    $filter: {
                      input: '$voteList',
                      as: 'upvoteItem',
                      cond: {
                        $eq: ['$$upvoteItem.type', VoteType.UPVOTE],
                      },
                    },
                  },
                },
                numOfDownvotes: {
                  $size: {
                    $filter: {
                      input: '$voteList',
                      as: 'downvoteItem',
                      cond: {
                        $eq: ['$$downvoteItem.type', VoteType.DOWNVOTE],
                      },
                    },
                  },
                },
              },
            },
            {
              $addFields: {
                votes: {
                  $subtract: ['$numOfUpvotes', '$numOfDownvotes'],
                },
              },
            },
            {
              $sort:
                sortBy === SortBy.DATE
                  ? { createdAt: -1 }
                  : sortBy === SortBy.VOTE
                  ? { votes: -1 }
                  : { createdAt: -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ])
        : await Question.aggregate([
            {
              $match: {
                $and: [
                  {
                    $or: [
                      { title: { $regex: new RegExp(searchText, 'i') } },
                      { content: { $regex: new RegExp(searchText, 'i') } },
                    ],
                  },
                  // Add fields: Count Upvote, count downvote, count votes
                  {
                    $or: [
                      {
                        textbookList: {
                          $elemMatch: {
                            $in: filter.textbook.map(
                              (id) => new mongoose.Types.ObjectId(id)
                            ),
                          },
                        },
                      },
                      {
                        subjectList: {
                          $elemMatch: {
                            $in: filter.subject.map(
                              (id) => new mongoose.Types.ObjectId(id)
                            ),
                          },
                        },
                      },
                      {
                        schoolList: {
                          $elemMatch: {
                            $in: filter.school.map(
                              (id) => new mongoose.Types.ObjectId(id)
                            ),
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              $addFields: {
                numOfUpvotes: {
                  $size: {
                    $filter: {
                      input: '$voteList',
                      as: 'upvoteItem',
                      cond: {
                        $eq: ['$$upvoteItem.type', VoteType.UPVOTE],
                      },
                    },
                  },
                },
                numOfDownvotes: {
                  $size: {
                    $filter: {
                      input: '$voteList',
                      as: 'downvoteItem',
                      cond: {
                        $eq: ['$$downvoteItem.type', VoteType.DOWNVOTE],
                      },
                    },
                  },
                },
              },
            },
            {
              $addFields: {
                votes: {
                  $subtract: ['$numOfUpvotes', '$numOfDownvotes'],
                },
              },
            },
            {
              $sort:
                sortBy === SortBy.DATE
                  ? { createdAt: -1 }
                  : sortBy === SortBy.VOTE
                  ? { votes: -1 }
                  : { createdAt: -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ]);

      await Question.populate(questions, {
        path: 'textbookList',
        select: 'name',
      });

      await Question.populate(questions, {
        path: 'subjectList',
        select: 'name',
      });

      await Question.populate(questions, {
        path: 'schoolList',
        select: 'name',
      });

      await Question.populate(questions, {
        path: 'commentList',
      });

      await Question.populate(questions, {
        path: 'owner',
        select: ['username', 'avatarUrl'],
      });

      const totalRecords = isFilterEmpty
        ? await Question.count({
            $or: [
              { title: { $regex: new RegExp(searchText, 'i') } },
              { content: { $regex: new RegExp(searchText, 'i') } },
            ],
          })
        : await Question.count({
            $and: [
              {
                $or: [
                  { title: { $regex: new RegExp(searchText, 'i') } },
                  { content: { $regex: new RegExp(searchText, 'i') } },
                ],
              },
              {
                $or: [
                  {
                    textbookList: {
                      $elemMatch: {
                        $in: filter.textbook.map(
                          (id) => new mongoose.Types.ObjectId(id)
                        ),
                      },
                    },
                  },
                  {
                    subjectList: {
                      $elemMatch: {
                        $in: filter.subject.map(
                          (id) => new mongoose.Types.ObjectId(id)
                        ),
                      },
                    },
                  },
                  {
                    schoolList: {
                      $elemMatch: {
                        $in: filter.school.map(
                          (id) => new mongoose.Types.ObjectId(id)
                        ),
                      },
                    },
                  },
                ],
              },
            ],
          });
      const questionCardList: QuestionCard[] = questions.map((question) => {
        const owner = question.owner;

        let numOfComments = 0;
        question.commentList.forEach((comment: any) => {
          numOfComments += comment.commentList.length;
        });
        numOfComments += question.commentList.length;

        const textbooks = question.textbookList.map(
          (textbook: { id: string; name: string }) => {
            return {
              id: textbook.id,
              name: textbook.name,
            };
          }
        );
        const subjects = question.subjectList.map(
          (subject: { id: string; name: string }) => {
            return {
              id: subject.id,
              name: subject.name,
            };
          }
        );
        const schools = question.schoolList.map(
          (school: { id: string; name: string }) => {
            return {
              id: school.id,
              name: school.name,
            };
          }
        );

        return {
          id: question._id as string,
          title: question.title,
          content: question.content,
          owner: {
            id: owner.id as string,
            name: owner.username as string,
            avaUrl: owner.avatarUrl as string,
          },
          textbooks: textbooks,
          subjects: subjects,
          schools: schools,
          numOfUpvotes: question.numOfUpvotes,
          numOfDownvotes: question.numOfDownvotes,
          numOfComments: numOfComments,
          votes: question.votes,
          createdAt: parseTimestampToDateString(question.createdAt),
        };
      });

      const response: QuestionSearchResponse = {
        questionCardList,
        totalRecords,
      };
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as searchQuestionRouter };
