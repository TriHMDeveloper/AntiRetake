import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import commonApi from '../../api/commonApi';

export const getFilterTag = createAsyncThunk('filterTags/filterTagsFetched', async (data) => {
  // const type = data;
  const response = await commonApi.getTags(data);
  // if (type.includes('school') && type.includes('subject') && type.includes('textbook')) {
  //   const response = await axios.get(
  //     'https://6200a457fdf5090017249547.mockapi.io/api/homepagecard/filterTag?type=Subject|Textbook|School'
  //   );
  //   return response.data;
  // } else if (type.includes('school')) {
  //   const response = await axios.get(
  //     'https://6200a457fdf5090017249547.mockapi.io/api/homepagecard/filterTag?type=School'
  //   );
  //   return response.data;
  // } else {
  //   const response = await axios.get(
  //     'https://6200a457fdf5090017249547.mockapi.io/api/homepagecard/filterTag?type=Subject|Textbook'
  //   );
  return response;
  // }
});

const filterTagSlide = createSlice({
  name: 'filterTag',
  initialState: {
    isLoading: true,
    allFilterTag: [],
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
    [getFilterTag.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getFilterTag.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.allFilterTag = action.payload.tagList;
    },
    [getFilterTag.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const filterTagReducer = filterTagSlide.reducer;

// export const homepageCardSelector = state => state.homepageCardReducer.allhomepageCard
export const { getLoading } = filterTagSlide.actions;
export default filterTagReducer;
