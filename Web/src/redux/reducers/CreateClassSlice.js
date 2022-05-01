import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import classApi from '../../api/classApi';
import commonApi from '../../api/commonApi';

export const getClassByID = createAsyncThunk('class/getClass', async (id) => {
  const response = await classApi.getClassInfoUser(id);
  return response;
});

export const getClassInfoGuestByID = createAsyncThunk('class/getClassGuest', async (id) => {
  const response = await classApi.getClassInfoGuest(id);
  return response;
});

export const getSchools = createAsyncThunk('common/getSchoolToCreateClass', async (searchText) => {
  const response = await commonApi.getSchools(searchText);
  return response;
});

export const getUsersToInvite = createAsyncThunk('class/getUsersToInvite', async ({ classId, searchText }) => {
  const response = await classApi.getUserToInvite({ classId, searchText });
  return response;
});

export const inviteMember = createAsyncThunk('class/inviteMemberToClass', async ({ classId, memberList }) => {
  const response = await classApi.inviteMember({ classId, memberList });
  return response;
});

export const postClass = createAsyncThunk('class/postClass', async (body) => {
  const response = await classApi.createClass(body);
  return response;
});

export const putClass = createAsyncThunk('class/putClass', async ({ classId, body }) => {
  const response = await classApi.editClass({ classId, body });
  return response;
});

const createClass = createSlice({
  name: 'createClass',
  initialState: {
    classInfo: {},
    isError: '',
    schools: [],
    isSchoolsLoading: true,
    usersToInvite: [],
    isUsersLoading: true,
  },
  reducers: {
    resetState: (state, action) => {
      state.classInfo = {};
      state.isError = '';
      state.schools = [];
    },
  },
  extraReducers: {
    [getClassByID.pending]: (state, action) => {
      state.isError = '';
      // state.classInfo = {};
    },
    [getClassByID.fulfilled]: (state, action) => {
      state.classInfo = action.payload;
      state.isError = '';
    },
    [getClassByID.rejected]: (state, action) => {
      state.isError = action.error.message;
    },

    [getClassInfoGuestByID.pending]: (state, action) => {
      state.isError = '';
      state.classInfo = {};
    },
    [getClassInfoGuestByID.fulfilled]: (state, action) => {
      state.classInfo = action.payload;
      state.isError = '';
    },
    [getClassInfoGuestByID.rejected]: (state, action) => {
      state.isError = action.error.message;
    },

    [getSchools.pending]: (state, action) => {
      state.isSchoolsLoading = true;
    },
    [getSchools.fulfilled]: (state, action) => {
      state.schools = action.payload;
      state.isSchoolsLoading = false;
    },
    [getSchools.rejected]: (state, action) => {
      state.isSchoolsLoading = false;
    },

    [postClass.pending]: (state, action) => {},
    [postClass.fulfilled]: (state, action) => {},
    [postClass.rejected]: (state, action) => {},

    [putClass.pending]: (state, action) => {},
    [putClass.fulfilled]: (state, action) => {},
    [putClass.rejected]: (state, action) => {},

    [getUsersToInvite.pending]: (state, action) => {
      state.isUsersLoading = true;
    },
    [getUsersToInvite.fulfilled]: (state, action) => {
      state.usersToInvite = action.payload;
      state.isUsersLoading = false;
    },
    [getUsersToInvite.rejected]: (state, action) => {
      state.isUsersLoading = false;
    },

    [inviteMember.pending]: (state, action) => {},
    [inviteMember.fulfilled]: (state, action) => {},
    [inviteMember.rejected]: (state, action) => {},
  },
});

const createClassReducer = createClass.reducer;
export const { resetState } = createClass.actions;
export default createClassReducer;
