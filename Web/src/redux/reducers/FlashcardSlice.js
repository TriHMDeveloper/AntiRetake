import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getFlashcard = createAsyncThunk('flashcards/flashcardsFetched', async (data) => {
  const { limit } = data;
  const response = await axios.get(
    `https://6200a457fdf5090017249547.mockapi.io/api/homepagecard/flashcard?page=1&limit=${limit}`
  );
  return response.data;
});

const flashcardSlide = createSlice({
  name: 'flashcard',
  initialState: {
    allFlashcard: [],
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
    [getFlashcard.pending]: (state, action) => {},
    [getFlashcard.fulfilled]: (state, action) => {
      state.allFlashcard = action.payload;
    },
    [getFlashcard.rejected]: (state, action) => {},
  },
});

const flashcardReducer = flashcardSlide.reducer;

// export const flashcardSelector = state => state.flashcardReducer.allFlashcard
// export const { addCard } = homepageCardSlide.actions
export default flashcardReducer;
