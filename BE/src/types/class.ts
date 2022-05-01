import mongoose from 'mongoose';
import { FolderDoc, SchoolDoc, StudySetDoc } from '.';
import { AccessModifier, ClassRole, UserClassRole } from '../constants';
import { UserDoc } from './user';

interface Member {
  member: UserDoc;
  joinedAt: Date;
  role: ClassRole;
}

interface JoinRequest {
  requestedBy: UserDoc;
  message: string;
  sentAt: Date;
}

interface Invitation {
  inviteTo: UserDoc;
  sentAt: Date;
}

export interface ClassAttrs {
  name: string;
  owner: UserDoc;
  school: SchoolDoc;
  description: string;
  accessModifier: AccessModifier;
  inviteLink: string;
  studySetList: StudySetDoc[];
  folderList: FolderDoc[];
  memberList: Member[];
  joinRequestList: JoinRequest[];
  inviteList: Invitation[];
}

export interface ClassDoc extends mongoose.Document {
  name: string;
  owner: UserDoc;
  school: SchoolDoc;
  description: string;
  accessModifier: AccessModifier;
  inviteLink: string;
  studySetList: StudySetDoc[];
  folderList: FolderDoc[];
  memberList: Member[];
  joinRequestList: JoinRequest[];
  inviteList: Invitation[];
  createdAt: Date;
}

export interface ClassModel extends mongoose.Model<ClassDoc> {
  build(attrs: ClassAttrs): ClassDoc;
}

export interface ClassSearchResponse {
  classCardList: ClassCard[];
  totalRecords: number;
}

export interface ClassCard {
  id: string;
  name: string;
  school: {
    id: string;
    name: string;
  };
  numOfSets: number;
  numOfMembers: number;
  createdAt: string;
}

export type ClassInfoGuest = {
  id: string;
  name: string;
  description: string;
  inviteLink: string;
  school: {
    id: string;
    name: string;
  };
  owner: {
    uid: string;
    name: string;
  };
  numOfSets: number;
  numOfMember: number;
  accessModifier: AccessModifier;
};

export type ClassInfoUser = ClassInfoGuest & {
  currentUserRole: UserClassRole;
};
export interface GetFolderByClassId {
  id: string;
  numOfSets: number;
  name: string;
  createAt: string;
}

export interface JoinRequestCard {
  id: string;
  name: string;
  avatarUrl: string;
  sentAt: string;
  sentDate: Date;
  message: string;
}

export interface MemberCard {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  accessDay: string;
  role: string;
}

export interface GetFolderByClassIdResponse {
  folderList: GetFolderByClassId[];
  isEnd: boolean;
}

export interface GetClassResponse {
  classCardList: ClassCard[];
  isEnd: boolean;
}
