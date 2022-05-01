import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { decodeToken, validateRequest } from '../../middlewares';
import { addNotification, Comment, Question, User } from '../../models/';
import { CommentDetail, UserDoc } from '../../types';
import { BadRequestError, NotAuthorizedError } from '../../errors';
import { parseTimestampToDateString } from '../../utils';
import { BASE_URL, NotificationType } from '../../constants';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post(
  '/api/forum/question/:questionId/comments',
  decodeToken,
  [body('content').notEmpty().withMessage('Content is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }

    const { replyToComment, content } = req.body;
    const currentUserUid = req.currentUser?.uid;
    const replyToQuestion = req.params.questionId;
    const user = await User.findOne({ uid: currentUserUid });

    const newComment = Comment.build({
      owner: user!,
      replyToQuestion: replyToQuestion,
      replyToComment: replyToComment,
      content: content,
      voteList: [],
      commentList: [],
    });
    await newComment.save();

    const sender = user as UserDoc;
    let recipient;
    let contentNoti;
    if (replyToComment === '') {
      const question = await Question.findByIdAndUpdate(replyToQuestion, {
        $push: { commentList: newComment },
      });
      recipient = await User.findById(question?.owner);
      contentNoti = `${sender.username} answered your question`;
    } else {
      const comment = await Comment.findByIdAndUpdate(replyToComment, {
        $push: { commentList: newComment },
      });
      recipient = await User.findById(comment?.owner);
      contentNoti = `${sender.username} answered your question`;
    }

    if (recipient?._id.toString() !== sender?._id.toString()) {
      const recipientListNoti = [
        { recipient: recipient as UserDoc, isRead: false },
      ];
      await addNotification(
        sender,
        recipientListNoti,
        NotificationType.FORUM,
        contentNoti,
        `/forum/${replyToQuestion}`
      );
    }

    const response: CommentDetail = {
      id: newComment.id,
      owner: {
        id: user?.id,
        name: user?.username as string,
        avaUrl: user?.avatarUrl as string,
      },
      content: newComment.content,
      numOfUpvotes: 0,
      numOfDownvotes: 0,
      voteList: [],
      replyToQuestion: newComment.replyToQuestion,
      replyToComment: newComment.replyToComment,
      commentList: [],
      createdAt: parseTimestampToDateString(newComment.createdAt),
    };

    res.status(201).send(response);
  }
);

export { router as createCommentRouter };
