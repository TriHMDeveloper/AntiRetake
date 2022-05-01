import mongoose from 'mongoose';
import { AccessModifier } from '../constants';
import { ClassAttrs, ClassDoc, ClassModel } from '../types';

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'schools',
    },
    description: {
      type: String,
    },
    accessModifier: {
      type: String,
      require: true,
    },
    inviteLink: {
      type: String,
      required: true,
    },
    studySetList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studysets',
      },
    ],
    folderList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folders',
      },
    ],
    memberList: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        joinedAt: {
          type: mongoose.Schema.Types.Date,
          required: true,
        },
        role: {
          type: String,
          require: true,
        },
      },
    ],
    joinRequestList: [
      {
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        message: {
          type: String,
          required: true,
        },
        sentAt: {
          type: mongoose.Schema.Types.Date,
          required: true,
        },
      },
    ],
    inviteList: [
      {
        inviteTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        sentAt: {
          type: mongoose.Schema.Types.Date,
          required: true,
        },
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

classSchema.statics.build = (attrs: ClassAttrs) => {
  return new Class(attrs);
};

classSchema.index({
  name: 'text',
});

export const Class = mongoose.model<ClassDoc, ClassModel>(
  'classes',
  classSchema
);
