import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import styles from '../../styles/component-styles/QuestionCardComponent-style.module.css';
import ViewStudySetListScreen from '../sub-screens/ViewStudySetListScreen';
import FolderApi from '../../api/folderApi';
import AddStudysetToClassPopup from '../popups/AddStudysetToClassPopup';
import { ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import ConfirmDeleteComponent from '../../components/ConfirmDeleteComponent';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { currentUserInfoSelector } from '../../redux/selectors/CurrentUserInfo';
import { deleteFolder } from '../../redux/reducers/CreateFolderSlice';
import { CircularProgress } from '@mui/material';

const ViewFolder = () => {
  const [infoFolder, setInfoFolder] = useState({});
  const [isError, setIsError] = useState(false);

  const getCurrentUser = useSelector(currentUserInfoSelector);
  const recentId = getCurrentUser.id;
  let { folderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showStudySet, setShowStudySet] = useState(false);
  const handleCloseStudySet = () => {
    getInfoFolder();
    setShowStudySet(false);
  };
  const handleShowStudySet = () => setShowStudySet(true);

  const [showDelete, setShowDelete] = useState(false);
  const handleDelete = async () => {
    dispatch(deleteFolder(folderId))
      .unwrap()
      .then((originalPromiseResult) => {
        dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG13 }));
        dispatch(setShow(true));
        navigate(`/users/${recentId}/folders`);
      });

    setShowDelete(false);
  };

  const handleClose = () => {
    setShowDelete(false);
  };

  const getInfoFolder = async () => {
    try {
      setIsError(false);
      const response = await FolderApi.getFolderInfo(folderId);
      setInfoFolder(response.folderInfo);
    } catch (error) {
      setIsError(true);
      console.log('Fail to fetch: ', error);
    }
  };

  useEffect(() => {
    getInfoFolder();
  }, []);

  if (Object.keys(infoFolder).length !== 0) {
    return (
      <Container key={folderId}>
        <Row className="mt-5 mx-2">
          <Col xs={12} md={6} className="text-start my-auto">
            <Row xs="auto" className="mb-2">
              <Col className="my-auto">
                <p className="m-0">{infoFolder.numOfSets + ' sets   '}</p>
              </Col>
              <Col className="my-auto">
                <p className="m-0 p-0">|</p>
              </Col>
              <Col>
                <p className="m-0">
                  create by{' '}
                  <a href="" className={styles.link_black_style}>
                    {infoFolder.username}
                  </a>
                </p>
              </Col>
            </Row>
            <Row xs="auto" className="mb-2">
              <Col>
                <i className="fas fa-folder fa-3x icon-color"></i>
              </Col>
              <Col>
                <h3 className="p-0 mt-2">{infoFolder.name}</h3>
              </Col>
            </Row>
            <Row xs="auto">
              <p>{infoFolder.description}</p>
            </Row>
          </Col>
          <Col xs={12} md={6} className="my-auto">
            {infoFolder.ownerId === recentId ? (
              <Row className="text-start">
                <Col md={5} xs={0} lg={7}></Col>
                <Col xs={2} md={2} lg={1} className="mx-1 px-1">
                  <button className="icon-button" onClick={handleShowStudySet}>
                    <i className="fas fa-plus"></i>
                  </button>
                </Col>
                <Col xs={2} md={2} lg={1} className="mx-1 px-1">
                  <button
                    className="icon-button fas fa-pencil-alt"
                    onClick={() => navigate(`/folders/${folderId}/edit`)}
                  />
                </Col>
                <Col xs={2} md={2} lg={1} className="mx-1 px-1">
                  <button className="icon-button" onClick={() => setShowDelete(true)}>
                    <i className="far fa-trash-alt"></i>
                  </button>
                </Col>
              </Row>
            ) : null}
          </Col>
        </Row>
        <Row>
          <ViewStudySetListScreen resetFolder={getInfoFolder} />
        </Row>
        <AddStudysetToClassPopup show={showStudySet} handleClose={handleCloseStudySet} submitButton="Done" />
        <ConfirmDeleteComponent
          content={Messages.mSG21(infoFolder.name)}
          show={showDelete}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      </Container>
    );
  } else {
    return (
      <Container>
        {isError ? (
          <h1 className="blur-text-color mt-5">Loading folder fail...</h1>
        ) : (
          <CircularProgress className=" mt-5" />
        )}
      </Container>
    );
  }
};

export default ViewFolder;
