export const currentUserInfoSelector = (state) => state.currentUserInfoReducer.currentUserInfo;
export const notificationSelector = (state) => state.currentUserInfoReducer.notification;
export const isLoadingNotificationSelector = (state) => state.currentUserInfoReducer.isLoading;
