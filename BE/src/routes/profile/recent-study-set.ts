import express, { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../middlewares';
import { Question, StudySet, User } from '../../models';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import {
  QuestionCard,
  RecentStudySetResponse,
  StudySetCard,
} from '../../types';
import { calDaysBetween, parseTimestampToDateString } from '../../utils';
import { AccessModifier, SortBy, VoteType } from '../../constants';

// eslint-disable-next-line new-cap
const router = express.Router();

// const toCardList = () => {};

router.get(
  '/api/homepage/recent-sets',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const currentUser = await User.findOne({
        uid: req.currentUser?.uid,
      }).populate({
        path: 'recentList.studySet',
        populate: [
          { path: 'textbook', select: 'name' },
          { path: 'subject', select: 'name' },
          { path: 'owner', select: ['uid', 'username', 'avatarUrl'] },
        ],
      });

      const thisWeekStudySets: StudySetCard[] = [];
      const lastWeekStudySets: StudySetCard[] = [];
      const olderStudySets: StudySetCard[] = [];

      currentUser?.recentList.sort((a, b) =>
        a.visitedAt > b.visitedAt ? -1 : 1
      );

      currentUser?.recentList.forEach((recentSet) => {
        const daysBetween = calDaysBetween(recentSet.visitedAt);

        const studySet = recentSet.studySet;
        const owner = studySet.owner;
        const textbook = studySet.textbook;
        const subject = studySet.subject;

        const averageRating =
          studySet.rateList.length === 0
            ? 0
            : Number(
                (
                  studySet.rateList
                    .map((rate) => rate.rating)
                    .reduce((pre, cur) => pre + cur, 0) /
                  studySet.rateList.length
                ).toFixed(1)
              );

        const card: StudySetCard = {
          id: studySet._id as string,
          name: studySet.name,
          numOfTerms: studySet.flashcardList.length,
          rating: averageRating,
          owner: {
            id: owner.id as string,
            name: owner.username as string,
            avaUrl: owner.avatarUrl as string,
          },
          textbook: {
            id: textbook.id as string,
            name: textbook.name,
          },
          subject: {
            id: subject.id as string,
            name: subject.name,
          },
          createdAt: parseTimestampToDateString(studySet.createdAt),
        };
        if (daysBetween <= 7) {
          thisWeekStudySets.push(card);
        } else if (daysBetween > 7 && daysBetween <= 14) {
          lastWeekStudySets.push(card);
        } else if (daysBetween > 14) {
          olderStudySets.push(card);
        }
      });

      const recommendStudySetList = await StudySet.aggregate([
        {
          $match: {
            accessModifier: AccessModifier.PUBLIC,
          },
        },
        {
          $addFields: {
            averageRating: {
              $avg: '$rateList.rating',
            },
          },
        },
        {
          $sort: { averageRating: -1, createdAt: -1 },
        },
        {
          $limit: 6,
        },
      ]);

      await StudySet.populate(recommendStudySetList, {
        path: 'textbook',
        select: 'name',
      });

      await StudySet.populate(recommendStudySetList, {
        path: 'subject',
        select: 'name',
      });

      await StudySet.populate(recommendStudySetList, {
        path: 'owner',
        select: ['username', 'avatarUrl'],
      });

      const recommendSetCardList: StudySetCard[] = recommendStudySetList.map(
        (studySet) => {
          const owner = studySet.owner;
          const textbook = studySet.textbook;
          const subject = studySet.subject;
          return {
            id: studySet._id as string,
            name: studySet.name,
            numOfTerms: studySet.flashcardList.length,
            rating: studySet.averageRating
              ? Number(studySet.averageRating.toFixed(1))
              : 0,
            owner: {
              id: owner.id as string,
              name: owner.username as string,
              avaUrl: owner.avatarUrl as string,
            },
            textbook: {
              id: textbook.id as string,
              name: textbook.name,
            },
            subject: {
              id: subject.id as string,
              name: subject.name,
            },
            createdAt: parseTimestampToDateString(studySet.createdAt),
          };
        }
      );

      const recommendQuestionList = await Question.aggregate([
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
          $sort: { votes: -1, createdAt: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      await Question.populate(recommendQuestionList, {
        path: 'textbookList',
        select: 'name',
      });

      await Question.populate(recommendQuestionList, {
        path: 'subjectList',
        select: 'name',
      });

      await Question.populate(recommendQuestionList, {
        path: 'schoolList',
        select: 'name',
      });

      await Question.populate(recommendQuestionList, {
        path: 'commentList',
      });

      await Question.populate(recommendQuestionList, {
        path: 'owner',
        select: ['username', 'avatarUrl'],
      });

      const recommendQuestionCardList: QuestionCard[] =
        recommendQuestionList.map((question) => {
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

      const response: RecentStudySetResponse = {
        recentStudySetList: {
          thisWeek: thisWeekStudySets,
          lastWeek: lastWeekStudySets,
          older: olderStudySets,
        },
        recommendationList: {
          studySetList: recommendSetCardList,
          questionList: recommendQuestionCardList,
        },
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as recentStudySetsRouter };
