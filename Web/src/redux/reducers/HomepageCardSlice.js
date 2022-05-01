import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import profileApi from '../../api/profileApi';

export const getHomepageCard = createAsyncThunk('cards/cardsFetched', async () => {
  const response = await profileApi.getRecentStudySets();
  return response;
});

const homepageCardSlide = createSlice({
  name: 'homePageCard',
  initialState: {
    isLoading: true,
    allhomepageCard: {
      thisWeek: [],
      lastWeek: [],
      older: [],
    },
    allRecommendCard: {
      studySetList: [],
      questionList: [],
    },
  },
  reducers: {
    resetHomepage: (state, action) => {
      state.allhomepageCard = {
        thisWeek: [],
        lastWeek: [],
        older: [],
      };
    },
  },
  extraReducers: {
    [getHomepageCard.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getHomepageCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allhomepageCard = action.payload.recentStudySetList;
      state.allRecommendCard = action.payload.recommendationList;
    },
    [getHomepageCard.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const { resetHomepage } = homepageCardSlide.actions;
const homepageCardReducer = homepageCardSlide.reducer;

// export const homepageCardSelector = state => state.homepageCardReducer.allhomepageCard
// export const { addCard } = homepageCardSlide.actions
export default homepageCardReducer;
