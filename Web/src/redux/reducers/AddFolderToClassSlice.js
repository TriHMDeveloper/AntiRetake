import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';
import profileApi from '../../api/profileApi';
import classApi from '../../api/classApi';
import studySetApi from '../../api/studySetApi';

export const getFoldersToAddToClass = createAsyncThunk('class/getFoldersToAddToClass', async (data) => {
  const response = await profileApi.getPersonalFolder(data);
  return response;
});

export const addFolderToClass = createAsyncThunk('class/addFolderToClass', async ({ classId, folderId }) => {
  const response = await classApi.addFolderToClass({ classId, folderId });
  return response;
});

export const saveStudySet = createAsyncThunk('class/saveStudySet', async (data) => {
  const response = await studySetApi.saveStudySet(data);
  return response;
});

const foldersSlice = createSlice({
  name: 'folders',
  initialState: {
    folders: [],
    selectedFolder: '',
    isSelect: false,
    isEnd: false,
    isLoading: false,
  },
  reducers: {
    selectFolders: (state, action) => {
      state.selectedFolder = state.selectedFolder !== action.payload.id ? action.payload.id : '';
      state.isSelect = state.selectedFolder !== '';
    },

    closeFolderPopupHandler: (state, action) => {
      state.selectedFolder = '';
      state.isSelect = false;
      state.folders = [];
    },
  },
  extraReducers: {
    [getFoldersToAddToClass.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getFoldersToAddToClass.fulfilled]: (state, action) => {
      state.folders = action.payload.folderList;
      state.isEnd = action.payload.isEnd;
      state.isSelect = action.payload.folderList.filter((item) => item.id === state.selectedFolders).length !== 0;
      state.isLoading = false;
    },
    [getFoldersToAddToClass.rejected]: (state, action) => {
      state.isLoading = false;
    },

    [addFolderToClass.pending]: (state, action) => {},
    [addFolderToClass.fulfilled]: (state, action) => {},
    [addFolderToClass.rejected]: (state, action) => {},
  },
});

const addFoldersToClassReducer = foldersSlice.reducer;
export const { selectFolders, closeFolderPopupHandler } = foldersSlice.actions;
export default addFoldersToClassReducer;
