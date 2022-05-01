import { createSlice, nanoid, createAsyncThunk, current } from '@reduxjs/toolkit';
import commonApi from '../../api/commonApi';
import studySetApi from '../../api/studySetApi';

export const getStudySetInfoByID = createAsyncThunk('studyset/getStudySetInfoByID', async (id) => {
  const response = await studySetApi.getStudySetInfoById(id);
  return response;
});

export const getAllFlashcardByID = createAsyncThunk('flashcard/getAllFlashcardByID', async (data) => {
  const response = await studySetApi.getFlashcardById(data);
  return response;
});

export const getSubjects = createAsyncThunk('common/getSubjectsToCreateStudyset', async (searchText) => {
  const response = await commonApi.getSubjects(searchText);
  return response;
});

export const getTextbooks = createAsyncThunk('common/getTextbooksToCreateStudyset', async (searchText) => {
  const response = await commonApi.getTextbooks(searchText);
  return response;
});

export const createStudyset = createAsyncThunk('sets/createStudyset', async (body) => {
  const response = await studySetApi.createStudyset(body);
  return response;
});

export const editStudyset = createAsyncThunk('sets/editStudyset', async ({ studySetId, body }) => {
  const response = await studySetApi.editStudyset({ studySetId, body });
  return response;
});

let scrollToBottom = false;
let draggedItem = null;
const createFlashcard = createSlice({
  name: 'createFlashcard',
  initialState: {
    studySetInfo: {},
    flashcards: [],
    subjects: [],
    isSubjectsLoading: true,
    textbooks: [],
    isTextbooksLoading: true,
    isError: false,
  },
  reducers: {
    handleRemoveItem: (state, action) => {
      state.flashcards = state.flashcards.filter((item) => item.id !== action.payload);
    },

    inputFlashcard: (state, action) => {
      state.flashcards = state.flashcards.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, term: action.payload.term, definition: action.payload.definition };
        }
        return item;
      });
    },

    newFlashCardContainer: (state, action) => {
      for (let i = 0; i < 4; i++) {
        state.flashcards.push({
          term: '',
          definition: '',
          id: nanoid(),
        });
      }
    },

    newCard: (state, action) => {
      state.flashcards.push({
        term: '',
        definition: '',
        id: nanoid(),
      });
      scrollToBottom = true;
    },

    scrollHeight: (state, action) => {
      if (scrollToBottom) {
        window.scrollTo(0, document.body.scrollHeight);
      }
    },

    handleDragOver: (state, action) => {
      const draggedOverItem = current(state.flashcards.at(action.payload));
      if (draggedItem === draggedOverItem) {
        return;
      }
      let items = state.flashcards.filter((item) => item.id !== draggedItem.id);
      items.splice(action.payload, 0, draggedItem);
      state.flashcards = items;
    },

    handleDragStart: (state, action) => {
      draggedItem = current(state.flashcards.at(action.payload));
    },

    handleDragEnd: (state, action) => {
      draggedItem = null;
    },

    resetCreateFlashcardState: (state, action) => {
      state.studySetInfo = {};
      state.flashcards = [];
      state.subjects = [];
      state.textbooks = [];
    },
  },
  extraReducers: {
    [getAllFlashcardByID.pending]: (state, action) => {},
    [getAllFlashcardByID.fulfilled]: (state, action) => {
      state.flashcards = action.payload.flashcardList;
    },
    [getAllFlashcardByID.rejected]: (state, action) => {},
    [getStudySetInfoByID.pending]: (state, action) => {
      state.isError = false;
    },
    [getStudySetInfoByID.fulfilled]: (state, action) => {
      state.studySetInfo = action.payload;
      state.isError = false;
    },
    [getStudySetInfoByID.rejected]: (state, action) => {
      state.isError = true;
    },

    [getSubjects.pending]: (state, action) => {
      state.isSubjectsLoading = true;
    },
    [getSubjects.fulfilled]: (state, action) => {
      state.subjects = action.payload;
      state.isSubjectsLoading = false;
    },
    [getSubjects.rejected]: (state, action) => {
      state.isSubjectsLoading = false;
    },

    [getTextbooks.pending]: (state, action) => {
      state.isTextbooksLoading = true;
    },
    [getTextbooks.fulfilled]: (state, action) => {
      state.textbooks = action.payload;
      state.isTextbooksLoading = false;
    },
    [getTextbooks.rejected]: (state, action) => {
      state.isTextbooksLoading = false;
    },

    [createStudyset.pending]: (state, action) => {},
    [createStudyset.fulfilled]: (state, action) => {},
    [createStudyset.rejected]: (state, action) => {},

    [editStudyset.pending]: (state, action) => {},
    [editStudyset.fulfilled]: (state, action) => {},
    [editStudyset.rejected]: (state, action) => {},
  },
});

const createFlashcardReducer = createFlashcard.reducer;
export const {
  handleRemoveItem,
  inputFlashcard,
  newCard,
  scrollHeight,
  newFlashCardContainer,
  handleDragOver,
  handleDragStart,
  handleDragEnd,
  resetCreateFlashcardState,
} = createFlashcard.actions;
export default createFlashcardReducer;
