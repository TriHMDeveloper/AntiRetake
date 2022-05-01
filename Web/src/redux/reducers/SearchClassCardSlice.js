import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import searchApi from '../../api/searchApi';

export const getSearchClassCard = createAsyncThunk('searchClassCards/searchClassCardsFetched', async (data) => {
  const { page, limit, filter, sortBy, searchText } = data;
  const response = await searchApi.searchClass(data);
  return response;
});

const searchClassCardSlide = createSlice({
  name: 'searchClassCard',
  initialState: {
    isLoading: true,
    isError: false,
    total: 0,
    allSearchClassCard: [],
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
    [getSearchClassCard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getSearchClassCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allSearchClassCard = action.payload.classCardList;
      state.total = action.payload.totalRecords;
    },
    [getSearchClassCard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

const searchClassCardReducer = searchClassCardSlide.reducer;

// export const homepageCardSelector = state => state.homepageCardReducer.allhomepageCard
export default searchClassCardReducer;
