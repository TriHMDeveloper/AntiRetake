import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import axios from 'axios';

// export const getUserInfo = createAsyncThunk('userInfo/userInfoFetched', async () => {
//   const response = await axios.get('https://testapi.io/api/Quan/https://testapi.io/api/Quan/currentUser');
//   return response.data;
// });

const authSlide = createSlice({
  name: 'auth',
  initialState: {
    isLogged: false,
    isVerify: false,
  },
  reducers: {
    changeLogged: (state, action) => {
      state.isLogged = action.payload;
    },
    changeVerify: (state, action) => {
      state.isVerify = action.payload;
    },
  },
  // extraReducers: {
  //   [getUserInfo.pending]: (state, action) => {
  //
  //   },
  //   [getUserInfo.fulfilled]: (state, action) => {
  //
  //     state.userInfo = action.payload;
  //   },
  //   [getUserInfo.rejected]: (state, action) => {
  //
  //   },
  // },
});

const authReducer = authSlide.reducer;
export const { changeLogged, changeVerify } = authSlide.actions;

// export const flashcardSelector = state => state.flashcardReducer.allFlashcard
// export const { addCard } = homepageCardSlide.actions
export default authReducer;
