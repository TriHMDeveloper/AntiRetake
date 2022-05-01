import mongoose from 'mongoose';
import { LearnStatus } from '../constants';
import { UserAttrs, UserDoc, UserModel } from '../types';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    classList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
      },
    ],
    folderList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folders',
      },
    ],
    studySetList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studysets',
      },
    ],
    recentList: [
      {
        studySet: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'studysets',
        },
        visitedAt: {
          type: mongoose.Schema.Types.Date,
          required: true,
        },
      },
    ],
    learnList: [
      {
        studySetId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'studysets',
        },
        flashcardList: [
          {
            flashcardId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'flashcards',
            },
            status: {
              type: String,
              require: true,
            },
          },
        ],
      },
    ],
    questionList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questions',
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.index(
  {
    name: 'text',
    email: 'text',
  },
  {
    weights: {
      name: 2,
      email: 1,
    },
  }
);

export const User = mongoose.model<UserDoc, UserModel>('users', userSchema);
