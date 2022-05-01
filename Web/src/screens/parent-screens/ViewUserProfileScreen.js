import React, { useEffect, useState } from 'react';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { TabBarType } from '../../assets/TypeEnum';
import TabBarComponent from '../../components/TabBarComponent';
import { getUserInfo } from '../../redux/reducers/UserInfoSlice';
import { userInfoSelector, isErrorUserInfoSelector } from '../../redux/selectors/UserInfoSelector';
import styles from '../../styles/screen-styles/ViewUserProfile.module.css';
import ChangeAvatarPopup from '../popups/ChangeAvatarPopup';
import EditUsernamePopup from '../popups/EditUsernamePopup';
import ViewClassListScreen from '../sub-screens/ViewClassListScreen';
import ViewFolderListScreen from '../sub-screens/ViewFolderListScreen';
import ViewQuestionListScreen from '../sub-screens/ViewQuestionListScreen';
import ViewStudySetListScreen from '../sub-screens/ViewStudySetListScreen';

import { currentUserInfoSelector } from '../../redux/selectors/CurrentUserInfo';
import { CircularProgress } from '@mui/material';

const ViewUserProfileScreen = () => {
  const { userId } = useParams();
  const currentUser = useSelector(currentUserInfoSelector);
  const isError = useSelector(isErrorUserInfoSelector);
  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showChangeAvatarPopup, setShowChangeAvatarPopup] = useState(false);
  const [showEditNamePopup, setShowEditNamePopup] = useState(false);

  useEffect(() => {
    dispatch(getUserInfo(userId));
  }, [userId]);

  useEffect(() => {
    const count = location.pathname.split('/').length - 1;
    if (count < 3) {
      navigate('sets', { replace: true });
    }
  }, [location]);

  const handleCloseChangeAvatarPopup = () => {
    setShowChangeAvatarPopup(false);
  };

  const handleCloseEditNamePopup = () => {
    setShowEditNamePopup(false);
  };

  const handleShowChangeAvatarPopup = () => setShowChangeAvatarPopup(true);
  const handleShowEditNamePopup = () => setShowEditNamePopup(true);

  const renderEditUser = () => {
    return (
      <Col className="d-flex">
        <Dropdown>
          <Dropdown.Toggle
            variant="none"
            className={`${styles.dropdown_toggle} ${styles.btn} p-0 icon-button`}
            id="dropdown-menu-align-end"
          >
            <i className="far fa-edit"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu align="start" className="p-0">
            <Dropdown.Item className={styles.dropdown_item} onClick={handleShowChangeAvatarPopup}>
              Change avatar
            </Dropdown.Item>
            <Dropdown.Item className={styles.dropdown_item} onClick={handleShowEditNamePopup}>
              Edit name
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    );
  };
  if (Object.keys(userInfo).length !== 0) {
    return (
      <Container>
        <Row className="mt-5 mb-4">
          <Col md="auto" xs="auto" lg="auto">
            <img src={userInfo.avatarUrl} alt="new" width="40" height="40" className="rounded-circle" />
          </Col>
          <Col md="auto" xs="auto" lg="auto" className="text-start giant-font theme-text-color">
            {userInfo.username}
          </Col>
          {userId === currentUser.id ? renderEditUser() : <></>}
        </Row>
        <ChangeAvatarPopup show={showChangeAvatarPopup} handleClose={handleCloseChangeAvatarPopup} />
        <EditUsernamePopup
          show={showEditNamePopup}
          handleClose={handleCloseEditNamePopup}
          oldName={userInfo.username}
        />
        <TabBarComponent tabType={TabBarType.USER} param={userId} />
        <Routes>
          <Route index path="sets" element={<ViewStudySetListScreen />} />
          <Route path="folders" element={<ViewFolderListScreen />} />
          <Route path="classes" element={<ViewClassListScreen />} />
          <Route path="questions" element={<ViewQuestionListScreen />} />
        </Routes>
      </Container>
    );
  } else {
    return (
      <Container>
        {isError ? (
          <h1 className="blur-text-color mt-5">Loading User Profile fail...</h1>
        ) : (
          <CircularProgress className=" mt-5" />
        )}
      </Container>
    );
  }
};

export default ViewUserProfileScreen;
