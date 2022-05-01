import mongoose from 'mongoose';

export interface SchoolAttrs {
  name: string;
  country: string;
}

export interface SchoolDoc extends mongoose.Document {
  name: string;
  country: string;
}

export interface SchoolModel extends mongoose.Model<SchoolDoc> {
  build(attrs: SchoolAttrs): SchoolDoc;
}
export interface getSchool {
  id: string;
  name: string;
  country: string;
}
