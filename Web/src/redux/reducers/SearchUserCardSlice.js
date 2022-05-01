import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import searchApi from '../../api/searchApi';

export const getSearchUserCard = createAsyncThunk('searchUserCards/searchUserCardsFetched', async (data) => {
  // const { page, limit, searchText } = data;
  const response = await searchApi.searchUser(data);
  // const response = await axios.get(
  //   `https://6204d7e5161670001741afa7.mockapi.io/UserSearch?page=${page}&limit=${limit}&name=${searchText}`
  // );
  return response;
});

const searchUserCardSlide = createSlice({
  name: 'searchUserCard',
  initialState: {
    isLoading: true,
    isError: false,
    total: 0,
    allSearchUserCard: [],
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
    [getSearchUserCard.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [getSearchUserCard.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allSearchUserCard = action.payload.userCardList;
      state.total = action.payload.totalRecords;
    },
    [getSearchUserCard.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
  },
});

const searchUserCardReducer = searchUserCardSlide.reducer;

// export const homepageCardSelector = state => state.homepageCardReducer.allhomepageCard
export default searchUserCardReducer;
