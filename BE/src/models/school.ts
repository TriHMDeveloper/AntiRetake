import mongoose from 'mongoose';
import { SchoolAttrs, SchoolDoc, SchoolModel } from '../types';

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
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

schoolSchema.statics.build = (attrs: SchoolAttrs) => {
  return new School(attrs);
};

schoolSchema.index({
  name: 'text',
});

export const School = mongoose.model<SchoolDoc, SchoolModel>(
  'schools',
  schoolSchema
);
