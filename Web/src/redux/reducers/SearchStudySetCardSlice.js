import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import searchApi from '../../api/searchApi';

export const getSearchStudySetCard = createAsyncThunk(
  'searchStudySetCards/searchStudySetCardsFetched',
  async (data) => {
    const { page, limit, filter, sortBy, searchText } = data;
    const response = await searchApi.searchStudySet(data);
    return response;
  }
);

const searchStudySetCardSlide = createSlice({
  name: 'searchStudySetCard',
  initialState: {
    isLoading: true,
    isError: false,
    total: 0,
    allSearchStudySetCard: [],
  },
  reducers: {
    // addCard: {
    //     reducer(state, action) {
    //         state.allCard.unshift(action.payload)
    //     },
    //     prepare(cardName) {
    //         return {
    //             payload: {
    //                 id: nanoid(),
    //                 username: 'quan',
    //                 cardName: cardName
    //             }
    //         }
    //     }
    // }
  },
  extraReducers: {
    [getSearchStudySetCard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getSearchStudySetCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allSearchStudySetCard = action.payload.studySetCardList;
      state.total = action.payload.totalRecords;
    },
    [getSearchStudySetCard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

const searchStudySetCardReducer = searchStudySetCardSlide.reducer;

// export const homepageCardSelector = state => state.homepageCardReducer.allhomepageCard
// export const { getLoading } = searchStudySetCardSlide.actions
export default searchStudySetCardReducer;
