import mongoose from 'mongoose';
import { VoteType } from '../constants';
import { CommentAttrs, CommentDoc, CommentModel } from '../types';

const commentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    replyToQuestion: {
      type: String,
      require: true,
    },
    replyToComment: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    voteList: [
      {
        votedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        type: {
          type: String,
          required: true,
        },
        votedAt: {
          type: mongoose.Schema.Types.Date,
          required: true,
        },
      },
    ],
    commentList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    // timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

export const Comment = mongoose.model<CommentDoc, CommentModel>(
  'comments',
  commentSchema
);
