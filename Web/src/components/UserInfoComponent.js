import TextField from '@mui/material/TextField';
import { React, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/component-styles/UserInfo.module.css';
import InviteMemberComponent from './InviteMemberComponent';
import ConfirmDeleteComponent from './ConfirmDeleteComponent';
import AddStudysetToClassPopup from '../screens/popups/AddStudysetToClassPopup';
import AddFolderToClassPopup from '../screens/popups/AddFolderToClassPopup';
import { closeStudysetPopupHandler } from '../redux/reducers/AddStudysetToClassSlice';
import { closeFolderPopupHandler } from '../redux/reducers/AddFolderToClassSlice';
import SendJoinRequestScreen from '../screens/popups/SendJoinRequestScreen';
import { getClassByID, getClassInfoGuestByID } from '../redux/reducers/CreateClassSlice';
import classApi from '../api/classApi';
import { updateToastInfo, setShow } from '../redux/reducers/ToastSlice';
import { ScreenLink, ToastType } from '../assets/TypeEnum';
import { Messages } from '../assets/Messages';
import ConfirmLeaveClassPopup from '../screens/popups/ConfirmLeaveClassPopup';

const UserInfoComponent = ({ classInfo }) => {
  const { name = '', inviteLink = '', description = '', accessModifier = '', currentUserRole = '' } = classInfo;
  const { classId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShows] = useState(false);
  const handleClose = () => setShows(false);
  const handleShow = () => setShows(true);

  const [showConfirmDeleteClass, setShowConfirmDeleteClass] = useState(false);
  const handleCloseConfirmDeleteClass = () => setShowConfirmDeleteClass(false);

  const handleShowConfirmDeleteClass = () => setShowConfirmDeleteClass(true);

  const handleDeleteConfirmDeleteClass = async () => {
    try {
      await classApi.deleteClass(classId);
      dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG08 }));
      dispatch(setShow(true));
      navigate(ScreenLink.HOMEPAGE);
    } catch (error) {
      // let messageError = error.response.data.errors[0].message;
      // dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: messageError }));
    }
    setShowConfirmDeleteClass(false);
  };

  const [showStudySet, setShowStudySet] = useState(false);
  const handleCloseStudySet = () => {
    setShowStudySet(false);
    //Clear selected Study set (AddStudysetToClassPopup)
    dispatch(closeStudysetPopupHandler());
    dispatch(getClassByID(classId));
  };
  const handleShowStudySet = () => setShowStudySet(true);

  const [showFolder, setShowFolder] = useState(false);
  const handleCloseFolder = () => {
    setShowFolder(false);
    //Clear selected Study set (AddFoldersToClassPopup)
    dispatch(closeFolderPopupHandler());
    dispatch(getClassByID(classId));
  };
  const handleShowFolder = () => setShowFolder(true);

  const [showJoinRequest, setShowJoinRequest] = useState(false);
  const handleCloseJoinRequest = () => setShowJoinRequest(false);
  const handleShowJoinRequest = () => setShowJoinRequest(true);

  const handleAcceptInvitation = async () => {
    await classApi.acceptInvitation(classId);
    dispatch(getClassByID(classId));
  };

  const [showLeaveClass, setShowLeaveClass] = useState(false);
  const handleCloseLeaveClass = () => setShowLeaveClass(false);
  const handleShowLeaveClass = () => setShowLeaveClass(true);
  const handleConfirmLeaveClass = async () => {
    await classApi.leaveCLass(classId);
    dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG51 }));
    dispatch(getClassByID(classId));

    setShowLeaveClass(false);
    dispatch(setShow(true));
  };

  useEffect(() => {
    dispatch(closeStudysetPopupHandler());
    dispatch(closeFolderPopupHandler());
  }, []);

  const copyLink = () => {
    return (
      <Col lg={4} className="my-2">
        <Row className="ms-3">
          <Col className="ps-0 d-flex align-items-center" xs={12} lg={12}>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              variant="outlined"
              value={inviteLink}
              disabled={true}
              className="w-100"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                endAdornment: (
                  <button
                    className={`fas fa-copy white-background-color ${styles.copy_icon}`}
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink);
                      dispatch(
                        updateToastInfo({
                          type: ToastType.SUCCESS,
                          title: ToastType.SUCCESS,
                          description: Messages.MSG45,
                        })
                      );
                      dispatch(setShow(true));
                    }}
                  />
                ),
              }}
            />
          </Col>
        </Row>
      </Col>
    );
  };

  const renderSwitch = () => {
    switch (currentUserRole) {
      case 'owner':
        return (
          <Row className="mt-2 mb-2">
            {copyLink()}
            <Col>
              <Row xs="auto">
                <Col className="d-flex align-items-center my-2">
                  <button
                    className="icon-button fas fa-pencil-alt"
                    onClick={() => navigate(`/classes/${classId}/edit`)}
                  />
                </Col>
                <Col className="d-flex align-items-center my-2">
                  <button className="icon-button far fa-trash-alt" onClick={() => handleShowConfirmDeleteClass()} />
                </Col>
                <Col className="d-flex align-items-center my-2">
                  <button className="icon-button fas fa-folder fa-lg" onClick={handleShowFolder} />
                </Col>
                <Col className="d-flex align-items-center my-2">
                  <button className="icon-button" onClick={handleShowStudySet}>
                    <i className="fas fa-plus"></i>
                  </button>
                </Col>
                <Col className="d-flex align-items-center my-2">
                  <Button
                    className={`accept-button ms-3 ${styles.invite_btn}`}
                    onClick={() => {
                      handleShow();
                    }}
                  >
                    Invite
                  </Button>
                </Col>
              </Row>
            </Col>
            {showConfirmDeleteClass ? (
              <ConfirmDeleteComponent
                content="Do you want to delete this class?"
                show={showConfirmDeleteClass}
                handleClose={handleCloseConfirmDeleteClass}
                handleDelete={handleDeleteConfirmDeleteClass}
              />
            ) : null}
            {show ? <InviteMemberComponent show={show} handleClose={handleClose} /> : null}
            {showStudySet ? (
              <AddStudysetToClassPopup show={showStudySet} handleClose={handleCloseStudySet} submitButton="Done" />
            ) : null}
            {showFolder ? (
              <AddFolderToClassPopup show={showFolder} handleClose={handleCloseFolder} submitButton="Done" />
            ) : null}
          </Row>
        );
      case 'editor':
        return (
          <Row>
            {copyLink()}
            <Col className="d-flex align-items-center">
              <Row xs="auto" className="ms-3">
                <Col className="d-flex align-items-center">
                  <button className="icon-button fas fa-plus" onClick={handleShowStudySet} />
                </Col>
                <Col className="d-flex align-items-center">
                  <button className="icon-button fas fa-sign-out-alt" onClick={handleShowLeaveClass} />
                </Col>
              </Row>
            </Col>
            {showStudySet ? (
              <AddStudysetToClassPopup show={showStudySet} handleClose={handleCloseStudySet} submitButton="Done" />
            ) : null}
            {showLeaveClass ? (
              <ConfirmLeaveClassPopup
                content={Messages.mSG50(name)}
                show={showLeaveClass}
                handleClose={handleCloseLeaveClass}
                handleDelete={handleConfirmLeaveClass}
              />
            ) : null}
          </Row>
        );
      case 'viewer':
        return (
          <Row className="mt-2 mb-2">
            {copyLink()}
            <Col className="d-flex align-items-center">
              <button className="icon-button fas fa-sign-out-alt" onClick={handleShowLeaveClass} />
            </Col>
            {showLeaveClass ? (
              <ConfirmLeaveClassPopup
                content={Messages.mSG50(name)}
                show={showLeaveClass}
                handleClose={handleCloseLeaveClass}
                handleDelete={handleConfirmLeaveClass}
              />
            ) : null}
          </Row>
        );
      case 'guest':
        return (
          <Row className="mt-2 mb-2">
            <Col className="d-flex">
              <Button className={`accept-button ${styles.invite_btn}`} onClick={handleShowJoinRequest}>
                Join
              </Button>
            </Col>
            {showJoinRequest ? (
              <SendJoinRequestScreen show={showJoinRequest} handleClose={handleCloseJoinRequest} className={name} />
            ) : null}
          </Row>
        );
      case 'invited-guest':
        return (
          <Row className="mt-2 mb-2">
            <Col className="d-flex">
              <Button className={`accept-button ${styles.invite_btn}`} onClick={handleAcceptInvitation}>
                Accept
              </Button>
            </Col>
          </Row>
        );
      case 'sent-guest':
        return (
          <Row className="mt-2 mb-2">
            <Col className="d-flex">
              <Button className={`accept-button ${styles.invite_btn}`} disabled>
                Requested
              </Button>
            </Col>
          </Row>
        );
    }
  };

  return (
    <Col>
      <Row className="d-flex">
        <Col md="auto" xs="auto" lg="auto" className="d-flex justify-content-center">
          <i className={`fas fa-users ${styles.class_icon}`} />
        </Col>
        <Col className="my-auto mb-2" md="auto" xs={7} lg="auto">
          <Row>
            <Col lg="auto" md="auto" xs="auto" className="d-flex">
              <p className={'m-0 p-0 text-start giant-font bold-black-text-color text-over-flow'}>{name}</p>
              {/* <div className={`rounded m-0 ms-3 mt-2 ${styles.dropdown_accessModifier}`}>{accessModifier}</div> */}
            </Col>
            <Col lg="auto" md="auto" xs="auto" className="d-flex">
              <p className={`rounded m-0 mt-2 ${styles.dropdown_accessModifier}`}>{accessModifier}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="blur-text-color text-start">{description}</div>
            </Col>
          </Row>
        </Col>
      </Row>
      {renderSwitch()}
    </Col>
  );
};

export default UserInfoComponent;
