import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import profileApi from '../../api/profileApi';

export const getQuestionCard = createAsyncThunk('viewQuestions/questioncardsFetched', async (data) => {
  const { limit, filter, sortBy, searchText, id } = data;
  const response = await profileApi.getQuestionsByUserId(data);
  return response;
});

const questionCardSlice = createSlice({
  name: 'viewQuestion',
  initialState: {
    isLoading: true,
    isError: false,
    isEnd: true,
    allViewQuestionCard: [],
  },
  reducers: {
    resetQuestion: (state, action) => {
      state.allViewQuestionCard = [];
    },
  },
  extraReducers: {
    [getQuestionCard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getQuestionCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allViewQuestionCard = action.payload.questionCardList;
      state.isEnd = action.payload.isEnd;
    },
    [getQuestionCard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

export const { resetQuestion } = questionCardSlice.actions;
const questionCardReducer = questionCardSlice.reducer;

export default questionCardReducer;
