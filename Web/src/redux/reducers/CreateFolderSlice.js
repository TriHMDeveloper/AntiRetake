import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import FolderApi from '../../api/folderApi';
import { Messages } from '../../assets/Messages';

export const getFolderByID = createAsyncThunk('folder/getFolder', async (id) => {
  const response = await FolderApi.getFolderInfo(id);
  return response.folderInfo;
});

export const postFolder = createAsyncThunk('folder/postFolder', async (body) => {
  const response = await FolderApi.createFolder(body);
  return response;
});

export const putFolder = createAsyncThunk('folder/putFolder', async ({ folderId, body }) => {
  const response = await FolderApi.editFolder({ folderId, body });
  return response;
});

export const deleteFolder = createAsyncThunk('folder/deleteFolder', async (folderId, { rejectWithValue }) => {
  const response = await FolderApi.deleteFolder(folderId);
  return response;
});

const createFolder = createSlice({
  name: 'createFolder',
  initialState: {
    folderInfo: {},
    isError: false,
  },
  reducers: {
    resetCreateFolderState: (state, action) => {
      state.folderInfo = {};
    },
  },
  extraReducers: {
    [getFolderByID.pending]: (state, action) => {
      state.isError = false;
    },
    [getFolderByID.fulfilled]: (state, action) => {
      state.folderInfo = action.payload;
      state.isError = false;
    },
    [getFolderByID.rejected]: (state, action) => {
      state.isError = true;
    },
    [postFolder.pending]: (state, action) => {},
    [postFolder.fulfilled]: (state, action) => {},
    [postFolder.rejected]: (state, action) => {},
    [putFolder.pending]: (state, action) => {},
    [putFolder.fulfilled]: (state, action) => {},
    [putFolder.rejected]: (state, action) => {},
    [deleteFolder.pending]: (state, action) => {},
    [deleteFolder.fulfilled]: (state, action) => {},
    [deleteFolder.rejected]: (state, action) => {},
  },
});

const createFolderReducer = createFolder.reducer;
export const { resetCreateFolderState } = createFolder.actions;
export default createFolderReducer;
