import mongoose from 'mongoose';
import { UserDoc, Vote } from '.';

export interface CommentAttrs {
  owner: UserDoc;
  replyToQuestion: string;
  replyToComment: string;
  content: string;
  voteList: Vote[];
  commentList: CommentDoc[];
}

export interface CommentDoc extends mongoose.Document {
  owner: UserDoc;
  replyToQuestion: string;
  replyToComment: string;
  content: string;
  voteList: Vote[];
  commentList: CommentDoc[];
  createdAt: Date;
}

export interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

export interface CommentDetail {
  id: string;
  owner: {
    id: string;
    name: string;
    avaUrl: string;
  };
  content: string;
  numOfUpvotes: number;
  numOfDownvotes: number;
  voteList: Vote[];
  replyToQuestion: string;
  replyToComment: string;
  commentList: CommentDetail[];
  createdAt: string;
}
