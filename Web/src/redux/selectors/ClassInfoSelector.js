import { createSelector } from '@reduxjs/toolkit';

export const classInfoSelector = (state) => state.createClassReducer.classInfo;
export const isErrorClassSelector = (state) => state.createClassReducer.isError;
export const schoolsSelector = (state) => state.createClassReducer.schools;
export const isSchoolsLoadingSelector = (state) => state.createClassReducer.isSchoolsLoading;
export const usersToInviteSelector = (state) => state.createClassReducer.usersToInvite;
export const isUsersLoadingSelector = (state) => state.createClassReducer.isUsersLoading;
