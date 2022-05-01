import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';
import profileApi from '../../api/profileApi';
import classApi from '../../api/classApi';
import studySetApi from '../../api/studySetApi';
import folderApi from '../../api/folderApi';

export const getStudysetToAddToClass = createAsyncThunk('class/getStudysetToAddToClass', async (data) => {
  const response = await profileApi.getPersonalStudySets(data);
  return response;
});

export const addStudysetToClass = createAsyncThunk('class/addStudysetToClass', async ({ classId, studySetId }) => {
  const response = await classApi.addStudysetToClass({ classId, studySetId });
  return response;
});

export const saveFlashcard = createAsyncThunk('studySet/saveFlashcard', async (data) => {
  const response = await studySetApi.saveFlashcard(data);
  return response;
});

export const saveStudySetToFolder = createAsyncThunk('folder/saveStudySetToFolder', async (data) => {
  const response = await folderApi.saveStudySetToFolder(data);
  return response;
});

const studysetNameSlice = createSlice({
  name: 'studysetName',
  initialState: {
    studysets: [],
    selectedStudyset: '',
    isSelect: false,
    isEnd: false,
    isLoading: false,
  },
  reducers: {
    selectStudyset: (state, action) => {
      state.selectedStudyset = state.selectedStudyset !== action.payload.id ? action.payload.id : '';
      state.isSelect = state.selectedStudyset !== '';
    },

    closeStudysetPopupHandler: (state, action) => {
      state.selectedStudyset = '';
      state.isSelect = false;
      state.studysets = [];
    },
  },
  extraReducers: {
    [getStudysetToAddToClass.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getStudysetToAddToClass.fulfilled]: (state, action) => {
      state.studysets = action.payload.studySetCardList;
      state.isEnd = action.payload.isEnd;
      state.isSelect =
        action.payload.studySetCardList.filter((item) => item.id === state.selectedStudyset).length !== 0;
      state.isLoading = false;
    },
    [getStudysetToAddToClass.rejected]: (state, action) => {
      state.isLoading = false;
    },

    [addStudysetToClass.pending]: (state, action) => {},
    [addStudysetToClass.fulfilled]: (state, action) => {},
    [addStudysetToClass.rejected]: (state, action) => {},
  },
});

const addStudysetToClassReducer = studysetNameSlice.reducer;
export const { selectStudyset, closeStudysetPopupHandler } = studysetNameSlice.actions;
export default addStudysetToClassReducer;
