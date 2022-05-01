import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import searchApi from '../../api/searchApi';

export const getSearchQuestionCard = createAsyncThunk(
  'searchQuestionCards/searchQuestionCardsFetched',
  async (data) => {
    const { page, limit, filter, sortBy, searchText } = data;
    const response = await searchApi.searchQuestion(data);
    return response;
  }
);

const searchQuestionCardSlide = createSlice({
  name: 'searchQuestionCard',
  initialState: {
    isLoading: true,
    isError: false,
    total: 0,
    allSearchQuestionCard: [],
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
    [getSearchQuestionCard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getSearchQuestionCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allSearchQuestionCard = action.payload.questionCardList;
      state.total = action.payload.totalRecords;
    },
    [getSearchQuestionCard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

const searchQuestionCardReducer = searchQuestionCardSlide.reducer;

// export const homepageCardSelector = state => state.homepageCardReducer.allhomepageCard
// export const { getLoading } = searchQuestionCardSlide.actions
export default searchQuestionCardReducer;
