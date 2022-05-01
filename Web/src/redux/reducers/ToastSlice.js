import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
  name: 'forum',
  initialState: {
    toastInfo: {
      type: '',
      title: '',
      description: '',
    },
    show: false,
  },
  reducers: {
    updateToastInfo: (state, action) => {
      state.toastInfo = action.payload;
    },
    setShow: (state, action) => {
      state.show = action.payload;
    },
  },
  // extraReducers: {
  //     [getFlashcard.pending]: (state, action) => {
  //
  //     },
  //     [getFlashcard.fulfilled]: (state, action) => {
  //
  //         state.allFlashcard = action.payload
  //     },
  //     [getFlashcard.rejected]: (state, action) => {
  //
  //     }
  // }
});

const toastReducer = toastSlice.reducer;

export const { updateToastInfo, setShow } = toastSlice.actions;
export default toastReducer;
