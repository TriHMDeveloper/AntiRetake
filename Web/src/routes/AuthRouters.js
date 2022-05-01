import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';
import { ScreenLink } from '../assets/TypeEnum';
import ChangePasswordScreen from '../screens/parent-screens/ChangePasswordScreen';
import CreateClassScreen from '../screens/parent-screens/CreateClassScreen';
import CreateFolderScreen from '../screens/parent-screens/CreateFolderScreen';
import CreateQuestion from '../screens/parent-screens/CreateQuestion';
import CreateStudySetScreen from '../screens/parent-screens/CreateStudySetScreen';
import Forum from '../screens/parent-screens/Forum';
import HomepageScreen from '../screens/parent-screens/HomepageScreen';
import SearchScreen from '../screens/parent-screens/SearchScreen';
import ViewClassScreen from '../screens/parent-screens/ViewClassScreen';
import ViewFolder from '../screens/parent-screens/ViewFolder';
import ViewQuestion from '../screens/parent-screens/ViewQuestion';
import ViewStudySetScreen from '../screens/parent-screens/ViewStudySetScreen';
import ViewUserProfileScreen from '../screens/parent-screens/ViewUserProfileScreen';
import LearnStudySetScreen from '../screens/parent-screens/LearnStudySetScreen';
import CheckEmailScreen from '../screens/parent-screens/CheckEmailScreen';
import BufferScreen from '../screens/parent-screens/BufferScreen';
import TitleBarUser from '../layouts/TitleBarUser';

const AuthRouters = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const checkPasswordProvider = () => {
    const currentUser = auth.currentUser;
    const checkPasswordProvider = currentUser.providerData.find((provider) => provider.providerId === 'password');
    return checkPasswordProvider;
  };

  useEffect(() => {
    if (
      !auth.currentUser.emailVerified &&
      location.pathname !== ScreenLink.AUTH_ACTION &&
      location.pathname !== ScreenLink.CHECK_EMAIL
    ) {
      navigate(ScreenLink.CHECK_EMAIL);
    }
  }, [location]);

  return (
    <>
      {/* {location.pathname === ScreenLink.CHECK_EMAIL ? <></> : <TitleBarUser />} */}
      <TitleBarUser />
      <Routes>
        <Route path={ScreenLink.HOMEPAGE} element={<HomepageScreen />} />
        {!auth.currentUser.emailVerified && <Route path={ScreenLink.CHECK_EMAIL} element={<CheckEmailScreen />} />}
        {checkPasswordProvider() && <Route path={ScreenLink.CHANGE_PASSWORD} element={<ChangePasswordScreen />} />}
        <Route path={ScreenLink.SEARCH} element={<SearchScreen />} />
        <Route path={ScreenLink.VIEW_USER_PROFILE} element={<ViewUserProfileScreen />} />
        <Route path={ScreenLink.VIEW_CLASS} element={<ViewClassScreen />} />
        <Route path={ScreenLink.VIEW_FOLDER} element={<ViewFolder />} />
        <Route path={ScreenLink.VIEW_STUDY_SET} element={<ViewStudySetScreen />} />
        <Route path={ScreenLink.LEARN_STUDY_SET} element={<LearnStudySetScreen />} />
        <Route path={ScreenLink.CREATE_CLASS} element={<CreateClassScreen />} />
        <Route path={ScreenLink.EDIT_CLASS} element={<CreateClassScreen />} />
        <Route path={ScreenLink.CREATE_FOLDER} element={<CreateFolderScreen />} />
        <Route path={ScreenLink.EDIT_FOLDER} element={<CreateFolderScreen />} />
        <Route path={ScreenLink.CREATE_STUDY_SET} element={<CreateStudySetScreen />} />
        <Route path={ScreenLink.EDIT_STUDY_SET} element={<CreateStudySetScreen />} />
        <Route path={ScreenLink.FORUM} element={<Forum />} />
        <Route path={ScreenLink.VIEW_QUESTION} element={<ViewQuestion />} />
        <Route path={ScreenLink.CREATE_QUESTION} element={<CreateQuestion />} />
        <Route path={ScreenLink.EDIT_QUESTION} element={<CreateQuestion />} />
        <Route path={ScreenLink.AUTH_ACTION} element={<BufferScreen />} />
        <Route path="*" element={<Navigate to={ScreenLink.HOMEPAGE} />} />
      </Routes>
    </>
  );
};

export default AuthRouters;
