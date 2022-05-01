import mongoose from 'mongoose';
import { TextbookAttrs, TextbookDoc, TextbookModel } from '../types';

const textbookSchema = new mongoose.Schema(
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

textbookSchema.statics.build = (attrs: TextbookAttrs) => {
  return new Textbook(attrs);
};

textbookSchema.index({
  name: 'text',
});

export const Textbook = mongoose.model<TextbookDoc, TextbookModel>(
  'textbooks',
  textbookSchema
);
