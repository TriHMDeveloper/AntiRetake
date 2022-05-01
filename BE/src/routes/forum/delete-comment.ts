import express, { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../middlewares';
import { Comment, Question, User } from '../../models';
import {
  BadRequestError,
  ForbiddenError,
  NotAuthorizedError,
} from '../../errors';

// eslint-disable-next-line new-cap
const router = express.Router();

router.delete(
  '/api/forum/comments/:commentId',
  decodeToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const commentId = req.params.commentId;

      const currentUser = await User.findOne({ uid: req.currentUser.uid });
      const currentUserId = currentUser?.id;

      const currentComment = await Comment.findById(commentId).populate({
        path: 'owner',
        select: 'email',
      });
      const commentOwnerId = currentComment?.owner.id;

      const isRemovable =
        currentUserId.toString() === commentOwnerId.toString();

      if (!isRemovable) {
        throw new ForbiddenError();
      }

      await Comment.deleteMany({
        _id: { $in: currentComment?.commentList },
      });

      if (currentComment?.replyToQuestion) {
        await Question.findByIdAndUpdate(currentComment?.replyToQuestion, {
          $pull: {
            commentList: commentId,
          },
        });
      }

      if (currentComment?.replyToComment) {
        await Comment.findByIdAndUpdate(currentComment?.replyToComment, {
          $pull: {
            commentList: commentId,
          },
        });
      }

      await Comment.findByIdAndDelete(commentId);

      res.status(200).send('currentQuestion');
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export { router as deleteCommentRouter };
