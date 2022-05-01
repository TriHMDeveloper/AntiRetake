import { createSelector } from '@reduxjs/toolkit';

export const flashcardContainerSelector = (state) => state.CreateFlashcardReducer.flashcards;
export const studySetInfoSelector = (state) => state.CreateFlashcardReducer.studySetInfo;
export const isErrorStudySetInfoSelector = (state) => state.CreateFlashcardReducer.isError;
// getschool in create studyset screen
export const subjectsSelector = (state) => state.CreateFlashcardReducer.subjects;
export const isSubjectsLoadingSelector = (state) => state.CreateFlashcardReducer.isSubjectsLoading;

// gettextbook in create studyset screen
export const textbooksSelector = (state) => state.CreateFlashcardReducer.textbooks;
export const isTextbooksLoadingSelector = (state) => state.CreateFlashcardReducer.isTextbooksLoading;

// createClass
export const createClassSelector = (state) => state.createClassReducer.classInfo;

export const questionCardSelector = (state) => state.questionCardReducer.questions;
// export const questionCardSelector = state => state.questionCardReducer
export const MultiCardSelector = (state) => state.MultiCardReducer.allMultiCard;

//view class screen
export const membersClassSelector = (state) => state.membersReducer.members;

// choose studyset popup
export const getStudysetsToAddClassSelector = (state) => state.addStudysetToClassReducer.studysets;
export const isSelectStudysetSelector = (state) => state.addStudysetToClassReducer.isSelect;
export const selectedStudysetSelector = (state) => state.addStudysetToClassReducer.selectedStudyset;
export const isEndLoadPersonalStudysetsSelector = (state) => state.addStudysetToClassReducer.isEnd;
export const isLoadingStudysetSelector = (state) => state.addStudysetToClassReducer.isLoading;

// choose folder popup
export const getFoldersToAddClassSelector = (state) => state.addFoldersToClassReducer.folders;
export const isSelectSelector = (state) => state.addFoldersToClassReducer.isSelect;
export const selectedFolderSelector = (state) => state.addFoldersToClassReducer.selectedFolder;
export const isEndLoadPersonalFoldersSelector = (state) => state.addFoldersToClassReducer.isEnd;
export const isLoadingFolderSelector = (state) => state.addFoldersToClassReducer.isLoading;

//view folder list
export const createFolderSelector = (state) => state.createFolderReducer.folderInfo;
export const isErrorCreateFolderSelector = (state) => state.createFolderReducer.isError;
