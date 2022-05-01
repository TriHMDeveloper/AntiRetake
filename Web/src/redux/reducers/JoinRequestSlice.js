import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import classApi from '../../api/classApi';

export const getJoinRequestClassByID = createAsyncThunk('class/joinRequest', async (id) => {
  const response = await classApi.getJoinRequest(id);
  return response;
});

export const responseJoinRequest = createAsyncThunk('class/responseJoinRequest', async (data) => {
  const response = await classApi.responseJoinRequest(data);
  return response;
});

const joinRequest = createSlice({
  name: 'joinRequest',
  initialState: {
    requests: [],
    isLoading: true,
    isError: '',
  },
  reducers: {},
  extraReducers: {
    [getJoinRequestClassByID.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = '';
    },
    [getJoinRequestClassByID.fulfilled]: (state, action) => {
      state.requests = action.payload;
      state.isLoading = false;
      state.isError = '';
    },
    [getJoinRequestClassByID.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload.error.message;
    },
    [responseJoinRequest.pending]: (state, action) => {
      state.isError = '';
    },
    [responseJoinRequest.fulfilled]: (state, action) => {
      state.isError = '';
    },
    [responseJoinRequest.rejected]: (state, action) => {
      state.isError = action.payload.error.message;
    },
  },
});

const joinRequestReducer = joinRequest.reducer;
export const { acceptRequest, declineRequest, loadMoreStudyset } = joinRequest.actions;
export default joinRequestReducer;
