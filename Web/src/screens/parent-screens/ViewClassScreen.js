/* eslint-disable indent */
import CircularProgress from '@mui/material/CircularProgress';
import { React, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { TabBarType, UserClassRole } from '../../assets/TypeEnum';
import ClassInfoComponent from '../../components/ClassInfoComponent';
import TabBarComponent from '../../components/TabBarComponent';
import UserInfoComponent from '../../components/UserInfoComponent';
import { getClassByID, getClassInfoGuestByID, resetState } from '../../redux/reducers/CreateClassSlice';
import { classInfoSelector, isErrorClassSelector } from '../../redux/selectors/ClassInfoSelector';
import ViewFolderListScreen from '../sub-screens/ViewFolderListScreen';
import ViewJoinRequestScreen from '../sub-screens/ViewJoinRequestScreen';
import ViewMemberListScreen from '../sub-screens/ViewMemberListScreen';
import ViewStudySetListScreen from '../sub-screens/ViewStudySetListScreen';
import { auth } from '../../config/firebase-config';

const ViewClassScreen = () => {
  const classInfo = useSelector(classInfoSelector);
  const isError = useSelector(isErrorClassSelector);

  const { classId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(resetState());
    const currentUser = await auth.currentUser;
    if (currentUser) {
      dispatch(getClassByID(classId));
    } else {
      dispatch(getClassInfoGuestByID(classId));
    }
  }, [classId]);

  useEffect(() => {
    const count = location.pathname.split('/').length - 1;
    if (count < 3) {
      navigate('sets', { replace: true });
    }
  }, [location]);

  if (Object.keys(classInfo).length !== 0) {
    return (
      <Container key={classInfo}>
        <Row className="m-0 mb-3 mt-4">
          <Col xs={12} md={12} lg={8}>
            <UserInfoComponent classInfo={classInfo} />
          </Col>
          <Col xs={12} md={12} lg={4} className="d-flex align-items-end">
            <ClassInfoComponent classInfo={classInfo} />
          </Col>
        </Row>

        {classInfo.currentUserRole === UserClassRole.OWNER ? (
          <TabBarComponent tabType={TabBarType.CLASS_OWNER} param={classId} />
        ) : (
          <TabBarComponent tabType={TabBarType.CLASS} param={classId} />
        )}

        {(classInfo.currentUserRole === UserClassRole.GUEST ||
          classInfo.currentUserRole === UserClassRole.INVITED_GUEST ||
          classInfo.currentUserRole === UserClassRole.SENT_GUEST ||
          !classInfo.currentUserRole) &&
        classInfo.accessModifier === 'private' ? (
          <h3 className="blur-text-color mt-5">This class is private, you must join to see all study set.</h3>
        ) : (
          <Routes>
            <Route index path="sets" element={<ViewStudySetListScreen />} />
            <Route path="folders" element={<ViewFolderListScreen />} />
            <Route path="members" element={<ViewMemberListScreen />} />
            <Route path="requests" element={<ViewJoinRequestScreen />} />
          </Routes>
        )}
      </Container>
    );
  } else {
    {
      return (
        <Container>
          {isError ? (
            <h1 className="blur-text-color mt-5">Loading class fail...</h1>
          ) : (
            <CircularProgress className=" mt-5" />
          )}
        </Container>
      );
    }
  }
};

export default ViewClassScreen;
