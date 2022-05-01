import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import profileApi from '../../api/profileApi';

export const getCurrentUserInfo = createAsyncThunk('currentUserInfo/currentUserInfoFetched', async () => {
  const response = await profileApi.getCurrentInfo();
  return response;
});

export const getNotification = createAsyncThunk('getNotification/getNotificationFetched', async ({ limit }) => {
  const response = await profileApi.getNotification(limit);
  return response;
});

export const readAllNotification = createAsyncThunk('readAllNotification/readAllNotificationFetched', async () => {
  const response = await profileApi.readAllNotification();
  return response;
});

const currentUserInfoSlide = createSlice({
  name: 'userInfo',
  initialState: {
    currentUserInfo: {},
    notification: {
      notificationList: [],
      isEnd: true,
      isReadAll: true,
    },
    isLoading: false,
  },
  reducers: {
    resetUser: (state, action) => {
      state.currentUserInfo = {};
      state.notification = {
        notificationList: [],
        isEnd: true,
        isReadAll: true,
      };
    },
  },
  extraReducers: {
    [getCurrentUserInfo.pending]: (state, action) => {},
    [getCurrentUserInfo.fulfilled]: (state, action) => {
      state.currentUserInfo = action.payload;
    },
    [getCurrentUserInfo.rejected]: (state, action) => {},
    [getNotification.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getNotification.fulfilled]: (state, action) => {
      state.notification = action.payload;
      state.isLoading = false;
    },
    [getNotification.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const { resetUser } = currentUserInfoSlide.actions;
const currentUserInfoReducer = currentUserInfoSlide.reducer;

// export const flashcardSelector = state => state.flashcardReducer.allFlashcard
// export const { addCard } = homepageCardSlide.actions
export default currentUserInfoReducer;
