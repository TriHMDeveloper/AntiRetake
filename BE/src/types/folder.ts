import mongoose from 'mongoose';
import { StudySetDoc } from './study-set';
import { UserDoc } from './user';

export interface FolderAttrs {
  name: string;
  owner: UserDoc;
  description: string;
  studySetList: StudySetDoc[];
}

export interface FolderDoc extends mongoose.Document {
  name: string;
  owner: UserDoc;
  description: string;
  studySetList: StudySetDoc[];
  createdAt: Date;
}

export interface FolderModel extends mongoose.Model<FolderDoc> {
  build(attrs: FolderAttrs): FolderDoc;
}

export interface folderInfo {
  id: string;
  name: string;
  username: string;
  ownerId: string;
  numOfSets: number;
  description: string;
}
