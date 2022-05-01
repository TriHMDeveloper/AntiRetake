import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { decodeToken, validateRequest } from '../../middlewares';
import { Comment } from '../../models/';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { parseTimestampToDateString } from '../../utils';

// eslint-disable-next-line new-cap
const router = express.Router();

router.put(
  '/api/forum/comments/:commentId',
  decodeToken,
  [body('content').notEmpty().withMessage('Content is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }

    const { content } = req.body;
    const commentId = req.params.commentId;

    await Comment.findOneAndUpdate(
      { _id: commentId },
      {
        content: content,
        // createdAt: new Date(),
      }
    );
    const getTimeEdit = await Comment.findById(commentId);
    const dateEdit = parseTimestampToDateString(getTimeEdit?.createdAt as Date);
    res.status(201).send(dateEdit);
  }
);

export { router as editCommentRouter };
