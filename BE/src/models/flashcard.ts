import mongoose from 'mongoose';
import { FlashcardAttrs, FlashcardDoc, FlashcardModel } from '../types';

const flashcardSchema = new mongoose.Schema(
  {
    term: {
      type: String,
      required: true,
    },
    definition: {
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

flashcardSchema.statics.build = (attrs: FlashcardAttrs) => {
  return new Flashcard(attrs);
};

export const Flashcard = mongoose.model<FlashcardDoc, FlashcardModel>(
  'flashcards',
  flashcardSchema
);
