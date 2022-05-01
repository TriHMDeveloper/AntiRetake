import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import learnApi from '../../api/learnApi';

export const getAllListLearn = createAsyncThunk('learn/getAllListLearn', async (id) => {
  const response = await learnApi.getListLearn(id);
  return response;
});

const learnStudySetSlice = createSlice({
  name: 'leanrstudyset',
  initialState: {
    // refresh: false,
    numOfFlashcards: 0,
    isError: false,
    numberQuestion: 8,
    switchType: 'term',
    countSet: 0,
    currentQuestion: 0,
    definitionList: ['A', 'B', 'C', 'D', 'T', 'True'],
    termList: ['A', 'B', 'C', 'D', 'T', 'True'],
    listQuestion:
      // [],
      [{ id: '', term: '', definition: '', status: 'notlearn' }],
    listLearn: [],
  },
  reducers: {
    changeCurrent: (state, action) => {
      state.currentQuestion = action.payload;
    },
    addLearn: (state, action) => {
      state.listLearn = action.payload;
    },
    deleteLearn: (state, action) => {
      state.listLearn = state.listLearn.filter((learn) => {
        return learn.id !== action.payload;
      });
    },
    changSetCount: (state, action) => {
      state.countSet = action.payload;
    },
    switchList: (state, action) => {
      state.listQuestion.forEach((element) => {
        if (element.id === action.payload.id) {
          element.term = action.payload.term;
          element.definition = action.payload.definition;
        }
      });
    },
    changeSwitchType: (state, action) => {
      state.switchType = action.payload;
    },
    changeStatus: (state, action) => {
      state.listQuestion.forEach((element) => {
        if (element.id === action.payload.id) {
          element.status = 'Learn';
        }
      });
    },
    changeNumberQuestion: (state, action) => {
      state.numberQuestion = action.payload;
    },
    changeMiddleQuestion: (state, action) => {
      state.listQuestion = action.payload;
    },
    changeRefresh: (state, action) => {
      state.refresh = action.payload;
    },
    changeDefinitionList: (state, action) => {
      state.definitionList = action.payload;
    },
    changeTermList: (state, action) => {
      state.termList = action.payload;
    },
  },
  extraReducers: {
    [getAllListLearn.pending]: (state, action) => {
      state.isError = false;
    },
    [getAllListLearn.fulfilled]: (state, action) => {
      state.listQuestion = action.payload.flashcardList;
      state.numOfFlashcards = action.payload.numOfFlashcards;
      state.termList = action.payload.termList;
      state.definitionList = action.payload.definitionList;
    },
    [getAllListLearn.rejected]: (state, action) => {
      state.isError = true;
    },
  },
});

const learnStudySetReducer = learnStudySetSlice.reducer;

export const {
  changeCurrent,
  addLearn,
  deleteLearn,
  changSetCount,
  switchList,
  changeSwitchType,
  changeStatus,
  changeNumberQuestion,
  changeMiddleQuestion,
  changeRefresh,
  changeDefinitionList,
  changeTermList,
} = learnStudySetSlice.actions;

export default learnStudySetReducer;
