import mongoose from 'mongoose';
import { FolderAttrs, FolderDoc, FolderModel } from '../types';

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    description: {
      type: String,
    },
    studySetList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studysets',
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

folderSchema.statics.build = (attrs: FolderAttrs) => {
  return new Folder(attrs);
};

folderSchema.index({
  name: 'text',
});

export const Folder = mongoose.model<FolderDoc, FolderModel>(
  'folders',
  folderSchema
);
