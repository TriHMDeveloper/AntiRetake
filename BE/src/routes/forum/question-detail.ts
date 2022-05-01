import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError } from '../../errors';
import { VoteType } from '../../constants';
import { Question } from '../../models';
import { CommentDetail, CommentDoc, QuestionDetail, Vote } from '../../types';
import { parseTimestampToDateString } from '../../utils';

const countVotes = (
  votes: string[]
): { numOfUpvotes: number; numOfDownvotes: number } => {
  const numOfUpvotes = votes?.filter((type) => type === VoteType.UPVOTE).length;
  const numOfDownvotes = votes?.filter(
    (type) => type === VoteType.DOWNVOTE
  ).length;
  return { numOfUpvotes, numOfDownvotes };
};

const toCommentList = (commentList: CommentDoc[]): CommentDetail[] => {
  const comments: CommentDetail[] = commentList.map((comment) => {
    const votes = comment?.voteList.map((vote) => vote.type);
    const { numOfUpvotes, numOfDownvotes } = countVotes(votes);
    return {
      id: comment.id as string,
      owner: {
        id: comment.owner.id as string,
        name: comment.owner.username as string,
        avaUrl: comment.owner.avatarUrl as string,
      },
      content: comment.content as string,
      numOfUpvotes: numOfUpvotes,
      numOfDownvotes: numOfDownvotes,
      voteList: comment.voteList,
      replyToQuestion: comment.replyToQuestion as string,
      replyToComment: comment.replyToComment as string,
      commentList:
        comment.commentList.length > 0
          ? toCommentList(comment.commentList)
          : [],
      createdAt: parseTimestampToDateString(comment.createdAt),
    };
  }) as CommentDetail[];
  return comments;
};

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(
  '/api/forum/questions/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questionId = req.params.id;

      const question = await Question.findById(questionId)
        .populate({
          path: 'owner',
          select: ['username', 'avatarUrl'],
        })
        .populate({
          path: 'textbookList',
          select: 'name',
        })
        .populate({ path: 'subjectList', select: 'name' })
        .populate({
          path: 'schoolList',
          select: 'name',
        })
        .populate({
          path: 'commentList',
          options: { sort: { createdAt: -1 } },
          populate: [
            {
              path: 'commentList',
              options: { sort: { createdAt: 1 } },
              populate: {
                path: 'owner',
                select: ['username', 'avatarUrl'],
              },
            },
            {
              path: 'owner',
              select: ['username', 'avatarUrl'],
            },
          ],
        })
        .catch((error) => {
          throw new BadRequestError('Question is not exist !');
        });

      // if (!question) {
      //   throw new BadRequestError('Question is not exist !');
      // }

      const textbooks = question?.textbookList.map((textbook) => {
        return { id: textbook.id, name: textbook.name };
      });

      const subjects = question?.subjectList.map((subject) => {
        return { id: subject.id, name: subject.name };
      });

      const schools = question?.schoolList.map((school) => {
        return { id: school.id, name: school.name };
      });

      const votes = question?.voteList.map((vote) => vote.type);
      const { numOfUpvotes, numOfDownvotes } = countVotes(votes ?? []);

      const comments = toCommentList(question?.commentList as CommentDoc[]);
      let numOfComments = 0;
      question?.commentList.forEach((comment: CommentDoc) => {
        numOfComments += comment.commentList.length;
      });
      numOfComments += question?.commentList.length ?? 0;

      const response: QuestionDetail = {
        id: question?.id,
        title: question?.title as string,
        content: question?.content as string,
        owner: {
          id: question?.owner.id,
          name: question?.owner.username as string,
          avaUrl: question?.owner.avatarUrl as string,
        },
        textbooks: textbooks ?? [],
        subjects: subjects ?? [],
        schools: schools ?? [],
        numOfUpvotes: numOfUpvotes,
        numOfDownvotes: numOfDownvotes,
        voteList: question?.voteList ?? [],
        numOfComments: numOfComments,
        commentList: comments,
        createdAt: parseTimestampToDateString(question?.createdAt as Date),
      };

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as questionDetailRouter };
