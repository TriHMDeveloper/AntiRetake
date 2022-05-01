import mongoose from 'mongoose';
import { SubjectAttrs, SubjectDoc, SubjectModel } from '../types';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
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

subjectSchema.statics.build = (attrs: SubjectAttrs) => {
  return new Subject(attrs);
};

subjectSchema.index({
  name: 'text',
});

export const Subject = mongoose.model<SubjectDoc, SubjectModel>(
  'subjects',
  subjectSchema
);
