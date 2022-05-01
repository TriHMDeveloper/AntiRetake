import mongoose from 'mongoose';
import { StudySetAttrs, StudySetDoc, StudySetModel } from '../types';

const studySetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    accessModifier: {
      type: String,
      require: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subjects',
    },
    textbook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'textbooks',
    },
    description: {
      type: String,
    },
    rateList: [
      {
        rating: {
          type: Number,
          required: true,
        },
        ratedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        ratedAt: {
          type: mongoose.Schema.Types.Date,
          required: true,
        },
      },
    ],
    flashcardList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'flashcards',
      },
    ],
    clonedFromStudySet: {
      type: String,
    },
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

studySetSchema.statics.build = (attrs: StudySetAttrs) => {
  return new StudySet(attrs);
};

studySetSchema.index({
  name: 'text',
});

export const StudySet = mongoose.model<StudySetDoc, StudySetModel>(
  'studysets',
  studySetSchema
);
