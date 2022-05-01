import mongoose from 'mongoose';

export interface SubjectAttrs {
  name: string;
}

export interface SubjectDoc extends mongoose.Document {
  name: string;
}

export interface SubjectModel extends mongoose.Model<SubjectDoc> {
  build(attrs: SubjectAttrs): SubjectDoc;
}
export interface getSubject {
  id: string;
  name: string;
}
