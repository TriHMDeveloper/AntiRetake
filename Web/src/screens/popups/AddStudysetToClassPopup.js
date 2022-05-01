import TextField from '@mui/material/TextField';
import { React, useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import StudySetCardForSaveComponent from '../../components/StudySetCardForSaveComponent';
import {
  addStudysetToClass,
  getStudysetToAddToClass,
  saveFlashcard,
  saveStudySetToFolder,
  closeStudysetPopupHandler,
} from '../../redux/reducers/AddStudysetToClassSlice';
import { resetToggle } from '../../redux/reducers/ViewStudySetCardSlice';
import {
  getStudysetsToAddClassSelector,
  isSelectStudysetSelector,
  selectedStudysetSelector,
  isEndLoadPersonalStudysetsSelector,
  isLoadingStudysetSelector,
} from '../../redux/selectors/Selectors';
import styles from '../../styles/screen-styles/AddStudysetToClassPopup.module.css';
import { useParams } from 'react-router-dom';
import { ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';

const AddStudysetToClassPopup = ({ show, handleClose, submitButton, flashcardId }) => {
  const isAddPopup = submitButton === 'Done' ? true : false;
  const dispatch = useDispatch();
  const { classId, folderId } = useParams();

  const studyset = useSelector(getStudysetsToAddClassSelector);
  const isSelected = useSelector(isSelectStudysetSelector);
  const isEnd = useSelector(isEndLoadPersonalStudysetsSelector);
  const isLoading = useSelector(isLoadingStudysetSelector);
  const studySetId = useSelector(selectedStudysetSelector);

  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [limitCount, setLimit] = useState(1);

  const handleGetStudysetsToAddToClassAPI = () => {
    const data = { limit: limitCount * 8, searchText: searchText, classId: classId };
    dispatch(getStudysetToAddToClass(data));
    setLimit(limitCount + 1);
  };

  const handleGetStudysetsToSaveFlashcardAPI = () => {
    const data = { limit: limitCount * 8, searchText: searchText };
    dispatch(getStudysetToAddToClass(data));
    setLimit(limitCount + 1);
  };

  const handleGetStudysetsToAddToFolderAPI = () => {
    const data = { limit: limitCount * 8, searchText: searchText, folderId: folderId };
    dispatch(getStudysetToAddToClass(data));
    setLimit(limitCount + 1);
  };

  const handleSearch = (event, value) => {
    setSearchValue(event.target.value ?? '');
    // setLimit(1);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      // Send Axios request here
      setSearchText(searchValue);
    }, 500);
    return () => {
      clearTimeout(delaySearch);
    };
  }, [searchValue]);

  const handleSubmit = async () => {
    folderId
      ? await dispatch(saveStudySetToFolder({ folderId, studySetId }))
          .unwrap()
          .then((originalPromiseResult) => {
            dispatch(
              updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG41 })
            );
            dispatch(setShow(true));
            dispatch(resetToggle());
          })
      : isAddPopup
      ? await dispatch(addStudysetToClass({ classId, studySetId }))
          .unwrap()
          .then((originalPromiseResult) => {
            dispatch(
              updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG41 })
            );
            dispatch(setShow(true));
            dispatch(resetToggle());
          })
      : await dispatch(saveFlashcard({ id: flashcardId, studySetId: studySetId }))
          .unwrap()
          .then((originalPromiseResult) => {
            dispatch(
              updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG40 })
            );
            dispatch(setShow(true));
            dispatch(resetToggle());
          });

    handleClose();
  };

  useEffect(() => {
    dispatch(closeStudysetPopupHandler());
    folderId
      ? handleGetStudysetsToAddToFolderAPI()
      : isAddPopup
      ? handleGetStudysetsToAddToClassAPI()
      : handleGetStudysetsToSaveFlashcardAPI();
  }, [searchText, show]);

  const trackScrolling = () => {
    const wrappedElement = document.getElementById('scrollable');
    if ((wrappedElement.scrollHeight - wrappedElement.scrollTop - 0.5).toFixed() <= wrappedElement.clientHeight) {
      folderId
        ? !isEnd
          ? handleGetStudysetsToAddToFolderAPI()
          : null
        : isAddPopup
        ? !isEnd
          ? handleGetStudysetsToAddToClassAPI()
          : null
        : !isEnd
        ? handleGetStudysetsToSaveFlashcardAPI()
        : null;
    }
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName={styles.container_modal}
        contentClassName={styles.content_modal}
        centered
      >
        <Modal.Dialog className={styles.modal_dialog} contentClassName={styles.content_modal}>
          <Modal.Header className={styles.modal_header}>
            <p className={`my-auto huge-font ms-3 ${styles.header_text}`}>
              {folderId ? 'Add Study Set To Folder' : isAddPopup ? 'Add Study Set To Class' : 'Save Flashcard'}
            </p>
          </Modal.Header>

          <Modal.Body className={`${styles.modal_body}`}>
            <Row className="mb-4">
              <Col
                className="d-flex"
                xs={{ span: 12, order: 'last' }}
                md={{ span: 6, order: 'first' }}
                lg={{ span: 6, order: 'first' }}
              >
                <p className="big-font my-auto">Choose study set</p>
              </Col>
              <Col xs={{ span: 12, order: 'first' }} md={{ span: 6, order: 'last' }} lg={{ span: 6, order: 'last' }}>
                <TextField
                  label="Search"
                  size="small"
                  onChange={handleSearch}
                  // disabled={isEnd}
                  className="ms-3 float-end w-100 pe-4"
                />
              </Col>
            </Row>

            <div className={styles.scrollable} id="scrollable" onScroll={trackScrolling}>
              <Row className="mb-3 pe-4">
                {studyset.map((item, index) => {
                  return (
                    <Col key={index} xs={12} md={6} lg={6} className="pe-3 mb-2">
                      <StudySetCardForSaveComponent studySet={item} />
                    </Col>
                  );
                })}
                {isLoading ? (
                  <div className="text-center">
                    <CircularProgress className="mt-2" />
                  </div>
                ) : studyset.length === 0 ? (
                  <div>
                    <p className="huge-font blur-text-color fw-bolder text-center mt-3 mb-1"> You have no study set</p>
                    <div className={`d-flex justify-content-center ${styles.icon_slash_container}`}>
                      <i className={`fas fa-clone ${styles.icon}`}></i>
                    </div>
                  </div>
                ) : null}
              </Row>
            </div>

            <Row className="mt-4 mb-2">
              {/* TODO: Điều hướng cho button */}
              <Col xs={6} md={6} lg={6} className="d-flex">
                <Button
                  className={'decline-button mx-auto'}
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs={6} md={6} lg={6} className="d-flex">
                {' '}
                <Button className={'accept-button mx-auto'} onClick={handleSubmit} disabled={!isSelected}>
                  {submitButton}
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    </div>
  );
};
export default AddStudysetToClassPopup;
