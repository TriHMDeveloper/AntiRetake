import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import classApi from '../../api/classApi';

export const getMemberClassByID = createAsyncThunk('class/memberFetched', async (classId) => {
  const response = await classApi.getClassMember(classId);
  return response;
});

let membersSearch = [];

const membersClass = createSlice({
  name: 'member',
  initialState: {
    members: [],
  },
  reducers: {
    editRole: (state, action) => {
      //ToDo: Call API
      state.members = state.members.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, role: action.payload.role };
        }
        return item;
      });
    },
    deleteUser: (state, action) => {
      //ToDo: Call API
      state.members = state.members.filter((item) => item.id !== action.payload);
    },

    searchUser: (state, action) => {
      state.members = membersSearch;
      const input = action.payload.toLowerCase();
      state.members = state.members.filter(
        (item) => item.name.toLowerCase().includes(input) || item.email.toLowerCase().includes(input)
      );
    },

    resetMemberTab: (state, action) => {
      state.members = [];
    },
  },
  extraReducers: {
    [getMemberClassByID.pending]: (state, action) => {},
    [getMemberClassByID.fulfilled]: (state, action) => {
      state.members = action.payload;
      membersSearch = state.members;
    },
    [getMemberClassByID.rejected]: (state, action) => {},
  },
});

const membersReducer = membersClass.reducer;
export const { editRole, deleteUser, searchUser, resetMemberTab } = membersClass.actions;
export default membersReducer;
