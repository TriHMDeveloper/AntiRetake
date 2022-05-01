import { configureStore } from '@reduxjs/toolkit';
import toastReducer from '../reducers/ToastSlice';
import authReducer from '../reducers/AuthSlice';
import CreateFlashcardReducer from '../reducers/CreateFlashcardSlice';
import createClassReducer from '../reducers/CreateClassSlice';
import homepageCardReducer from '../reducers/HomepageCardSlice';
import flashcardReducer from '../reducers/FlashcardSlice';
import userInfoReducer from '../reducers/UserInfoSlice';
import questionDetailReducer from '../reducers/QuestionDetailSlice';
import viewQuestionCardReducer from '../reducers/ViewQuestionCardSlice';
import searchClassCardReducer from '../reducers/SearchClassCardSlice';
import searchStudySetCardReducer from '../reducers/SearchStudySetCardSlice';
import searchUserCardReducer from '../reducers/SearchUserCardSlice';
import searchQuestionCardReducer from '../reducers/SearchQuestionCardSlice';
import viewClassCardReducer from '../reducers/ViewClassCardSlice';
import filterTagReducer from '../reducers/FilterTagSlice';
import viewStudySetCardReducer from '../reducers/ViewStudySetCardSlice';
import learnStudySetReducer from '../reducers/LearnStudySetSlice';
import MultiCardReducer from '../reducers/MultiCardSlide';
import joinRequestReducer from '../reducers/JoinRequestSlice';
import addStudysetToClassReducer from '../reducers/AddStudysetToClassSlice';
import addFoldersToClassReducer from '../reducers/AddFolderToClassSlice';
import createFolderReducer from '../reducers/CreateFolderSlice';
import studySetReducer from '../reducers/StudySetSlice';
import currentUserInfoReducer from '../reducers/CurrentUserInfoSlice';
import membersReducer from '../reducers/MemberSlice';
import viewFolderCardReducer from '../reducers/ViewFolderCardSlice';
const store = configureStore({
  reducer: {
    authReducer,
    toastReducer,
    homepageCardReducer,
    currentUserInfoReducer,
    flashcardReducer,
    CreateFlashcardReducer,
    createClassReducer,
    userInfoReducer,
    questionDetailReducer,
    viewQuestionCardReducer,
    MultiCardReducer,
    searchClassCardReducer,
    searchStudySetCardReducer,
    searchUserCardReducer,
    searchQuestionCardReducer,
    filterTagReducer,
    viewClassCardReducer,
    learnStudySetReducer,
    viewStudySetCardReducer,
    studySetReducer,
    membersReducer,
    joinRequestReducer,
    addStudysetToClassReducer,
    addFoldersToClassReducer,
    viewFolderCardReducer,
    createFolderReducer,
  },
});

export default store;
