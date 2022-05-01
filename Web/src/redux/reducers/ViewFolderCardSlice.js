import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import classApi from '../../api/classApi';
import profileApi from '../../api/profileApi';
import { ViewStudySetType } from '../../assets/TypeEnum';

export const getViewFolderCard = createAsyncThunk('viewFolderCards/viewFolderCardsFetched', async (data) => {
  const { limit, filter, sortBy, searchText, id, type } = data;
  let response;
  switch (type) {
    case ViewStudySetType.CLASS:
      response = await classApi.getFolderByClassId(data);
      return response;
    default:
      response = await profileApi.getFolderByUserId(data);
      return response;
  }
});
const viewFolderCardsSlice = createSlice({
  name: 'viewFolderCard',
  initialState: {
    isLoading: true,
    isError: false,
    isEnd: true,
    reset: false,
    allViewFolderCard: [],
  },
  reducers: {
    resetFolder: (state, action) => {
      state.allViewFolderCard = [];
    },
    resetToggle: (state, action) => {
      state.reset = !state.reset;
    },
  },
  extraReducers: {
    [getViewFolderCard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getViewFolderCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allViewFolderCard = action.payload.folderList;
      state.isEnd = action.payload.isEnd;
    },
    [getViewFolderCard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

export const { resetFolder, resetToggle } = viewFolderCardsSlice.actions;
const viewFolderCardReducer = viewFolderCardsSlice.reducer;
export default viewFolderCardReducer;
