import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import profileApi from '../../api/profileApi';

export const getViewClassCard = createAsyncThunk('viewClassCards/viewClassCardsFetched', async (data) => {
  const { limit, filter, sortBy, searchText, id } = data;
  const response = await profileApi.getClassesByUserId(data);
  return response;
});

const viewClassCardSlide = createSlice({
  name: 'viewClassCard',
  initialState: {
    isLoading: true,
    isError: false,
    isEnd: true,
    allViewClassCard: [],
  },
  reducers: {
    resetClass: (state, action) => {
      state.allViewClassCard = [];
    },
  },
  extraReducers: {
    [getViewClassCard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getViewClassCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allViewClassCard = action.payload.classCardList;
      state.isEnd = action.payload.isEnd;
    },
    [getViewClassCard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

export const { resetClass } = viewClassCardSlide.actions;
const viewClassCardReducer = viewClassCardSlide.reducer;

// export const homepageCardSelector = state => state.homepageCardReducer.allhomepageCard
export default viewClassCardReducer;
