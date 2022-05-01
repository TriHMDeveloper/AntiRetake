import mongoose from 'mongoose';

export interface TextbookAttrs {
  name: string;
}

export interface TextbookDoc extends mongoose.Document {
  name: string;
}

export interface TextbookModel extends mongoose.Model<TextbookDoc> {
  build(attrs: TextbookAttrs): TextbookDoc;
}
export interface getTextBook {
  id: string;
  name: string;
}
