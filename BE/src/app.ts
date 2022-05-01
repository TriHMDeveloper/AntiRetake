import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';
import {
  addUserRouter,
  getClassInfoRouter,
  getUserInfoRouter,
  recentStudySetsRouter,
  searchClassRouter,
  searchQuestionRouter,
  searchStudySetRouter,
  searchUserRouter,
  getStudySetListByUserIDRouter,
  visitStudySetRouter,
  getClassesByUserIdRouter,
  createClassRouter,
  editClassRouter,
  removeMemberRouter,
  getFolderByUserIdRouter,
  getFolderByClassIdRouter,
  joinRequestsRouter,
  responseJoinRequestRouter,
  addStudySetToClassRouter,
  addFolderToClassRouter,
  deleteFolderRouter,
  getFolderInfoRouter,
  createQuestionRouter,
  editQuestionRouter,
  editMemberRoleRouter,
  inviteMemberRouter,
  getStudySetRouter,
  getStudySetInfoRouter,
  rateStudySetRouter,
  getUserToInviteRouter,
  getRecommendationStudySetRouter,
  deleteQuestionRouter,
  createFolderRouter,
  editFolderRouter,
  createStudySetRouter,
  editStudySetRouter,
  getStudySetListByClassIDRouter,
  getStudySetListByFolderIDRouter,
  getMemberbyClassIDRouter,
  saveStudySetRouter,
  saveFlashcardRouter,
  sendJoinRouter,
  getSchoolRouter,
  getTextBookRouter,
  getSubjectRouter,
  getQuestionByUserIdRouter,
  questionDetailRouter,
  deleteClassRouter,
  acceptInviteRouter,
  createCommentRouter,
  editCommentRouter,
  deleteCommentRouter,
  deleteStudySetRouter,
  voteQuestionRouter,
  deleteVoteQuestionRouter,
  voteCommentRouter,
  deleteVoteCommentRouter,
  learnStudySetRouter,
  resetLearnStudySetRouter,
  setLearnStudySetRouter,
  getPersonalStudySetRouter,
  getTagsRouter,
  getMyProfileInfoRouter,
  editUserInfoRouter,
  editQuestionInfoRouter,
  getPersonalFolderRouter,
  removeStudySetInClassRouter,
  removeStudySetInFolderRouter,
  removeFolderInClassRouter,
  addStudySetToFolderRouter,
  leaveClassRouter,
  getClassInfoGuestRouter,
  getNotificationsRouter,
  readAllNotificationsRouter,
} from './routes';

const app = express();
app.use(cors());
app.use(json());

app.use(addUserRouter);

app.use(searchStudySetRouter);
app.use(searchUserRouter);
app.use(searchClassRouter);
app.use(searchQuestionRouter);

app.use(getStudySetListByUserIDRouter);
app.use(getPersonalStudySetRouter);
app.use(getUserInfoRouter);
app.use(getFolderByUserIdRouter);
app.use(getFolderByClassIdRouter);
app.use(getClassesByUserIdRouter);
app.use(getQuestionByUserIdRouter);

app.use(recentStudySetsRouter);
app.use(visitStudySetRouter);

app.use(createClassRouter);
app.use(editClassRouter);
app.use(getClassInfoRouter);
app.use(getClassInfoGuestRouter);
app.use(joinRequestsRouter);
app.use(responseJoinRequestRouter);
app.use(addStudySetToClassRouter);
app.use(addFolderToClassRouter);
app.use(sendJoinRouter);
app.use(getStudySetListByClassIDRouter);
app.use(getMemberbyClassIDRouter);
app.use(editMemberRoleRouter);
app.use(inviteMemberRouter);
app.use(getUserToInviteRouter);
app.use(deleteClassRouter);
app.use(removeMemberRouter);
app.use(acceptInviteRouter);
app.use(leaveClassRouter);

app.use(getStudySetListByFolderIDRouter);

app.use(getFolderInfoRouter);
app.use(createQuestionRouter);
app.use(editQuestionRouter);
app.use(createCommentRouter);
app.use(questionDetailRouter);
app.use(editCommentRouter);
app.use(deleteQuestionRouter);
app.use(deleteCommentRouter);

app.use(createFolderRouter);
app.use(editFolderRouter);
app.use(deleteFolderRouter);

app.use(createStudySetRouter);
app.use(editStudySetRouter);
app.use(deleteStudySetRouter);
app.use(saveStudySetRouter);
app.use(saveFlashcardRouter);

app.use(getSchoolRouter);
app.use(getTextBookRouter);
app.use(getSubjectRouter);
app.use(voteQuestionRouter);
app.use(deleteVoteQuestionRouter);
app.use(voteCommentRouter);
app.use(deleteVoteCommentRouter);
app.use(learnStudySetRouter);
app.use(resetLearnStudySetRouter);
app.use(setLearnStudySetRouter);
app.use(getMyProfileInfoRouter);

app.use(getStudySetRouter);
app.use(getStudySetInfoRouter);
app.use(rateStudySetRouter);
app.use(getRecommendationStudySetRouter);
app.use(getTagsRouter);
app.use(editUserInfoRouter);
app.use(editQuestionInfoRouter);
app.use(getPersonalFolderRouter);
app.use(removeStudySetInClassRouter);
app.use(removeStudySetInFolderRouter);
app.use(removeFolderInClassRouter);
app.use(addStudySetToFolderRouter);
app.use(getNotificationsRouter);
app.use(readAllNotificationsRouter);

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
