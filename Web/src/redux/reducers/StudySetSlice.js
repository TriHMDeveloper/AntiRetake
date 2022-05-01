import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import studySetApi from '../../api/studySetApi';

export const getStudySetInfo = createAsyncThunk('studySetInfo/userStudySetInfo', async (id) => {
  const response = await studySetApi.getStudySetInfoById(id);
  return response;
});

export const getFlashcard = createAsyncThunk('flashcards/flashcardsFetched', async (data) => {
  const response = await studySetApi.getFlashcardById(data);
  return response;
});

export const getRecommendFlashcard = createAsyncThunk('recommendflashcards/recommendflashcardsFetched', async (id) => {
  const response = await studySetApi.getRecommendFlashcardById(id);
  return response;
});

export const visitStudySet = createAsyncThunk('visitStudySet/visitStudySetFetched', async (id) => {
  const response = await studySetApi.visitStudySet(id);
  return response;
});

export const rateStudySet = createAsyncThunk('rateStudySet/rateStudySetFetched', async (id) => {
  const response = await studySetApi.rateStudySet(id);
  return response;
});

const studySetSlide = createSlice({
  name: 'studySet',
  initialState: {
    isLoading: true,
    isError: false,
    isEnd: false,
    studySetInfo: {},
    allFlashcard: [],
    recommendFlashcard: [],
  },
  reducers: {
    resetInfo: (state, action) => {
      state.studySetInfo = {};
    },
  },
  extraReducers: {
    [getStudySetInfo.pending]: (state, action) => {},
    [getStudySetInfo.fulfilled]: (state, action) => {
      state.studySetInfo = action.payload;
    },
    [getStudySetInfo.rejected]: (state, action) => {},
    [getFlashcard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getFlashcard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allFlashcard = action.payload.flashcardList;
      state.isEnd = action.payload.isEnd;
    },
    [getFlashcard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
    [getRecommendFlashcard.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getRecommendFlashcard.fulfilled]: (state, action) => {
      state.recommendFlashcard = action.payload;
    },
    [getRecommendFlashcard.rejected]: (state, action) => {
      state.isError = true;
    },
  },
});

export const { resetInfo } = studySetSlide.actions;

const studySetReducer = studySetSlide.reducer;

// export const flashcardSelector = state => state.flashcardReducer.allFlashcard
// export const { addCard } = homepageCardSlide.actions
export default studySetReducer;
