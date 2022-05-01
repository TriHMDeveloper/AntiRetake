import mongoose from 'mongoose';
import { ClassDoc, FolderDoc, StudySetDoc } from '.';
import { LearnStatus } from '../constants';
import { FlashcardDoc } from './flashcard';
import { QuestionDoc } from './question';

export interface RecentStudySet {
  studySet: StudySetDoc;
  visitedAt: Date;
}

export interface Flashcard {
  flashcardId: FlashcardDoc;
  status: LearnStatus;
}

export interface LearnSet {
  studySetId: StudySetDoc;
  flashcardList: Flashcard[];
}
export interface UserAttrs {
  uid: string;
  username: string;
  email: string;
  avatarUrl: string;
  classList: ClassDoc[];
  folderList: FolderDoc[];
  studySetList: StudySetDoc[];
  recentList: RecentStudySet[];
  learnList: LearnSet[];
  questionList: QuestionDoc[];
}

export interface UserDoc extends mongoose.Document {
  uid: string;
  username: string;
  email: string;
  avatarUrl: string;
  classList: ClassDoc[];
  folderList: FolderDoc[];
  studySetList: StudySetDoc[];
  recentList: RecentStudySet[];
  learnList: LearnSet[];
  questionList: QuestionDoc[];
}

export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserSearchResponse {
  userCardList: UserCard[];
  totalRecords: number;
}

export interface UserCard {
  uid: string;
  username: string;
  avatarUrl: string;
  numOfClasses: number;
  numOfSets: number;
}

export interface UserInfo {
  id: string;
  username: string;
  avatarUrl: string;
  email: string;
}

export interface GetFolderByUserId {
  id: string;
  numOfSets: number;
  name: string;
  createdAt: string;
}

export interface GetFolderByUserIdResponse {
  folderList: GetFolderByUserId[];
  isEnd: boolean;
}

export interface GetClassByUserId {
  id: string;
  name: string;
  school: {
    id: string;
    name: string;
  };
  createAt: string;
  numOfSets: number;
  numOfMembers: number;
}

export interface UserToInvite {
  id: string;
  username: string;
  email: string;
}
export interface LearnStudySet {
  studySetId: string;
  flashcardList: {
    id: string;
    term: string;
    definition: string;
    status: LearnStatus;
  }[];
  termList?: string[];
  definitionList?: string[];
  numOfFlashcards: number;
}

enum EditUserInfoType {
  NAME = 'name',
  AVATAR_URL = 'avatarUrl',
}

export type EditUserInfoRequest = {
  [field in EditUserInfoType]: string;
};
