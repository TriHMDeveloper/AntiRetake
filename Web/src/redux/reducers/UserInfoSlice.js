import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import profileApi from '../../api/profileApi';

export const getUserInfo = createAsyncThunk('userInfo/userInfoFetched', async (id) => {
  const response = await profileApi.getUserInfoById(id);
  return response;
});

const userInfoSlide = createSlice({
  name: 'userInfo',
  initialState: {
    userInfo: {},
    isError: false,
  },
  reducers: {
    // }
  },
  extraReducers: {
    [getUserInfo.pending]: (state, action) => {
      state.isError = false;
      state.userInfo = {};
    },
    [getUserInfo.fulfilled]: (state, action) => {
      state.userInfo = action.payload.userInfo;
    },
    [getUserInfo.rejected]: (state, action) => {
      state.isError = true;
    },
  },
});

const userInfoReducer = userInfoSlide.reducer;

// export const flashcardSelector = state => state.flashcardReducer.allFlashcard
// export const { addCard } = homepageCardSlide.actions
export default userInfoReducer;
