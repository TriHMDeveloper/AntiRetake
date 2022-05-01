import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ScreenLink } from '../assets/TypeEnum';
import CheckEmailScreen from '../screens/parent-screens/CheckEmailScreen';
import ForgotPasswordScreen from '../screens/parent-screens/ForgotPasswordScreen';
import Forum from '../screens/parent-screens/Forum';
import LandingPageScreen from '../screens/parent-screens/LandingPageScreen';
import SearchScreen from '../screens/parent-screens/SearchScreen';
import SignInScreen from '../screens/parent-screens/SignInScreen';
import SignUpScreen from '../screens/parent-screens/SignUpScreen';
import ViewClassScreen from '../screens/parent-screens/ViewClassScreen';
import ViewFolder from '../screens/parent-screens/ViewFolder';
import ViewQuestion from '../screens/parent-screens/ViewQuestion';
import ViewStudySetScreen from '../screens/parent-screens/ViewStudySetScreen';
import ViewUserProfileScreen from '../screens/parent-screens/ViewUserProfileScreen';
import LearnStudySetScreen from '../screens/parent-screens/LearnStudySetScreen';
import ResetPassword from '../screens/parent-screens/ResetPasswordScreen';
import BufferScreen from '../screens/parent-screens/BufferScreen';
import TitleBarGuest from '../layouts/TitleBarGuest';
const AuthRouters = () => {
  return (
    <>
      <TitleBarGuest />
      <Routes>
        <Route path={ScreenLink.LANDING} element={<LandingPageScreen />} />
        <Route path={ScreenLink.SIGN_UP} element={<SignUpScreen />} />
        <Route path={ScreenLink.SIGN_IN} element={<SignInScreen />} />
        <Route path={ScreenLink.FORGOT_PASSWORD} element={<ForgotPasswordScreen />} />
        <Route path={ScreenLink.CHECK_EMAIL} element={<CheckEmailScreen />} />
        <Route path={ScreenLink.SEARCH} element={<SearchScreen />} />
        <Route path={ScreenLink.VIEW_USER_PROFILE} element={<ViewUserProfileScreen />} />
        <Route path={ScreenLink.VIEW_CLASS} element={<ViewClassScreen />} />
        <Route path={ScreenLink.VIEW_FOLDER} element={<ViewFolder />} />
        <Route path={ScreenLink.VIEW_STUDY_SET} element={<ViewStudySetScreen />} />
        <Route path={ScreenLink.LEARN_STUDY_SET} element={<LearnStudySetScreen />} />
        <Route path={ScreenLink.FORUM} element={<Forum />} />
        <Route path={ScreenLink.VIEW_QUESTION} element={<ViewQuestion />} />
        <Route path={ScreenLink.AUTH_ACTION} element={<BufferScreen />} />
        <Route path={ScreenLink.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path="*" element={<Navigate to={ScreenLink.SIGN_IN} />} />
      </Routes>
    </>
  );
};

export default AuthRouters;
