import mongoose from 'mongoose';
import { FlashcardDoc, SubjectDoc, TextbookDoc, UserDoc } from '.';
import { AccessModifier } from '../constants';
import { QuestionCard } from './question';

interface Rate {
  rating: number;
  ratedBy: UserDoc;
  ratedAt: Date;
}

export interface StudySetAttrs {
  name: string;
  owner: UserDoc;
  accessModifier: AccessModifier;
  subject: SubjectDoc;
  textbook: TextbookDoc;
  description: string;
  rateList: Rate[];
  flashcardList: FlashcardDoc[];
  clonedFromStudySet?: string;
}

export interface StudySetDoc extends mongoose.Document {
  name: string;
  owner: UserDoc;
  accessModifier: AccessModifier;
  subject: SubjectDoc;
  textbook: TextbookDoc;
  description: string;
  rateList: Rate[];
  flashcardList: FlashcardDoc[];
  clonedFromStudySet?: string;
  createdAt: Date;
}

export interface StudySetModel extends mongoose.Model<StudySetDoc> {
  build(attrs: StudySetAttrs): StudySetDoc;
}

export interface RecentStudySetResponse {
  recentStudySetList: {
    thisWeek: StudySetCard[];
    lastWeek: StudySetCard[];
    older: StudySetCard[];
  };
  recommendationList: {
    studySetList: StudySetCard[];
    questionList: QuestionCard[];
  };
}

export interface StudySetSearchResponse {
  studySetCardList: StudySetCard[];
  totalRecords: number;
}

export interface GetStudySetResponse {
  studySetCardList: StudySetCard[];
  isEnd: boolean;
}
export interface GetPersonalStudySetResponse {
  studySetCardList: StudySetCardPopup[];
  isEnd: boolean;
}

export interface StudySetCard {
  id: string;
  name: string;
  numOfTerms: number;
  rating: number;
  owner: {
    id: string;
    name: string;
    avaUrl: string;
  };
  textbook: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface StudySetCardPopup {
  id: string;
  name: string;
}

export interface StudySetInfo {
  id: string;
  name: string;
  numOfTerms: number;
  rating: number;
  numOfRates: number;
  currentUserRating?: number;
  owner: {
    id: string;
    name: string;
    avaUrl: string;
  };
  textbook: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
  createdAt: string;
  description: string;
  accessModifier: string;
}
export interface SaveStudySetRequest {
  name: string;
  folderId?: string;
}

export interface SaveFlashcardRequest {
  studySetId: string;
}
