import mongoose from 'mongoose';
import { QuestionAttrs, QuestionDoc, QuestionModel } from '../types';

const questionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
    subjectList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects',
      },
    ],
    textbookList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'textbooks',
      },
    ],
    schoolList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schools',
      },
    ],
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
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

questionSchema.statics.build = (attrs: QuestionAttrs) => {
  return new Question(attrs);
};

questionSchema.index(
  {
    title: 'text',
    content: 'text',
  },
  {
    weights: {
      title: 2,
      content: 1,
    },
  }
);

export const Question = mongoose.model<QuestionDoc, QuestionModel>(
  'questions',
  questionSchema
);
