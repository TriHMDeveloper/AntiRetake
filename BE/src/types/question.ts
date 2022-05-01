import mongoose from 'mongoose';
import {
  CommentDoc,
  SchoolDoc,
  SubjectDoc,
  TextbookDoc,
  UserDoc,
  Vote,
} from '.';
import { CommentDetail } from './comment';
import { Tag } from './filter';

export interface QuestionAttrs {
  owner: UserDoc;
  title: string;
  content: string;
  subjectList: SubjectDoc[];
  textbookList: TextbookDoc[];
  schoolList: SchoolDoc[];
  voteList: Vote[];
  commentList: CommentDoc[];
}

export interface QuestionDoc extends mongoose.Document {
  owner: UserDoc;
  title: string;
  content: string;
  subjectList: SubjectDoc[];
  textbookList: TextbookDoc[];
  schoolList: SchoolDoc[];
  voteList: Vote[];
  commentList: CommentDoc[];
  createdAt: Date;
}

export interface QuestionModel extends mongoose.Model<QuestionDoc> {
  build(attrs: QuestionAttrs): QuestionDoc;
}

export interface QuestionSearchResponse {
  questionCardList: QuestionCard[];
  totalRecords: number;
}
export interface GetQuestionResponse {
  questionCardList: QuestionCard[];
  isEnd: boolean;
}
export interface QuestionCard {
  id: string;
  title: string;
  content: string;
  owner: {
    id: string;
    name: string;
    avaUrl: string;
  };
  textbooks: {
    id: string;
    name: string;
  }[];
  subjects: {
    id: string;
    name: string;
  }[];
  schools: {
    id: string;
    name: string;
  }[];
  numOfUpvotes: number;
  numOfDownvotes: number;
  numOfComments: number;
  votes: number;
  createdAt: string;
}

export interface QuestionDetail {
  id: string;
  title: string;
  content: string;
  owner: {
    id: string;
    name: string;
    avaUrl: string;
  };
  textbooks: {
    id: string;
    name: string;
  }[];
  subjects: {
    id: string;
    name: string;
  }[];
  schools: {
    id: string;
    name: string;
  }[];
  numOfUpvotes: number;
  numOfDownvotes: number;
  voteList: Vote[];
  numOfComments?: number;
  commentList?: CommentDetail[];
  createdAt: string;
}

export interface EditQuestionInfoResponse {
  id: string;
  title: string;
  content: string;
  owner: {
    id: string;
    name: string;
    avaUrl: string;
  };
  tagList: Tag[];
}
