import mongoose from 'mongoose';

export interface FlashcardAttrs {
  term: string;
  definition: string;
}

export interface FlashcardDoc extends mongoose.Document {
  term: string;
  definition: string;
}

export interface FlashcardModel extends mongoose.Model<FlashcardDoc> {
  build(attrs: FlashcardAttrs): FlashcardDoc;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
}

export interface FlashcardResponse {
  flashcardList: Flashcard[];
  isEnd: boolean;
}
