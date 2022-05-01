import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getMultiCard = createAsyncThunk('multiCards/multiCardFetched', async () => {
  const response = await axios.get('https://6204d7e5161670001741afa7.mockapi.io/StudySetLearnQuestion');
  return response.data;
});
const MultiCardSlide = createSlice({
  name: 'MultiCard',
  initialState: {
    allMultiCard: [
      {
        content: 'content 1',
        answer: [
          {
            index: 1,
            content: 'Hung',
            isCorrect: true,
          },
          {
            index: 2,
            content: 'Hung',
            isCorrect: false,
          },
          {
            index: 3,
            content: 'Hung',
            isCorrect: false,
          },
          {
            index: 4,
            content: 'Hung',
            isCorrect: false,
          },
        ],
        index: 34,
        id: '1',
      },
      {
        content: 'content 2',
        answer: [
          {
            index: 1,
            content: 'Hung',
            isCorrect: true,
          },
          {
            index: 2,
            content: 'Hung',
            isCorrect: false,
          },
          {
            index: 3,
            content: 'Hung',
            isCorrect: false,
          },
          {
            index: 4,
            content: 'Hung',
            isCorrect: false,
          },
        ],
        index: 7,
        id: '2',
      },
      {
        content: 'content 3',
        answer: [
          {
            index: 1,
            content: 'Hung',
            isCorrect: true,
          },
          {
            index: 2,
            content: 'Hung',
            isCorrect: false,
          },
          {
            index: 3,
            content: 'Hung',
            isCorrect: false,
          },
          {
            index: 4,
            content: 'Hung',
            isCorrect: false,
          },
        ],
        index: 83,
        id: '3',
      },
    ],
  },
  extraReducers: {
    [getMultiCard.pending]: (state, action) => {},
    [getMultiCard.fulfilled]: (state, action) => {
      state.allMultiCard = action.payload;
    },
    [getMultiCard.rejected]: (state, action) => {},
  },
});
const MultiCardReducer = MultiCardSlide.reducer;

export default MultiCardReducer;
