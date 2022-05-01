import { createSelector } from '@reduxjs/toolkit';

export const getListQuestionReducer = (state) => state.learnStudySetReducer.listQuestion;
export const getListLearnReducer = (state) => state.learnStudySetReducer.listLearn;

export const isErrorQuestionSelector = (state) => state.learnStudySetReducer.isError;
export const getCurrentReducer = (state) => state.learnStudySetReducer.currentQuestion;
export const getCountSetReducer = (state) => state.learnStudySetReducer.countSet;
export const getSwitchReducer = (state) => state.learnStudySetReducer.switchType;
export const getNumberQuestionReducer = (state) => state.learnStudySetReducer.numberQuestion;
export const getLength = (state) => state.learnStudySetReducer.numOfFlashcards;
export const getRefresh = (state) => state.learnStudySetReducer.refresh;
export const getTearmList = (state) => state.learnStudySetReducer.termList;
export const getDefinitionLists = (state) => state.learnStudySetReducer.definitionList;

export const getSetQuestionReducer = createSelector(
  getListQuestionReducer,
  getCountSetReducer,
  getNumberQuestionReducer,
  (listQuestion, countSet, numberQuestion) => {
    return listQuestion.filter((learn, index) => {
      return index >= countSet && index < countSet + numberQuestion;
    });
  }
);
