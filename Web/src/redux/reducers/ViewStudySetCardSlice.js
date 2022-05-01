import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import classApi from '../../api/classApi';
import profileApi from '../../api/profileApi';
import folderApi from '../../api/folderApi';
import { ViewStudySetType } from '../../assets/TypeEnum';

export const getViewStudySetCard = createAsyncThunk('viewStudySetCards/viewStudySetCardsFetched', async (data) => {
  const { limit, filter, sortBy, searchText, id, type } = data;
  let response;
  switch (type) {
    case ViewStudySetType.CLASS:
      response = await classApi.getStudySetsByClassId(data);
      return response;
    case ViewStudySetType.FOLDER:
      response = await folderApi.getStudySetsByFolderId(data);
      return response;
    default:
      response = await profileApi.getStudySetsByUserId(data);
      return response;
  }
});

const viewStudySetCardsSlice = createSlice({
  name: 'viewStudySetCard',
  initialState: {
    isLoading: true,
    isError: false,
    isEnd: true,
    reset: false,
    allViewStudySetCard: [],
  },
  reducers: {
    resetStudySet: (state, action) => {
      state.allViewStudySetCard = [];
    },
    resetToggle: (state, action) => {
      state.reset = !state.reset;
    },
  },
  extraReducers: {
    [getViewStudySetCard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getViewStudySetCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allViewStudySetCard = action.payload.studySetCardList;
      state.isEnd = action.payload.isEnd;
    },
    [getViewStudySetCard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

export const { resetStudySet, resetToggle } = viewStudySetCardsSlice.actions;
const viewStudySetCardReducer = viewStudySetCardsSlice.reducer;
export default viewStudySetCardReducer;
