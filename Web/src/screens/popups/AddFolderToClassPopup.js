import TextField from '@mui/material/TextField';
import { React, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FolderCardComponent from '../../components/FolderCardComponent';
import { getFoldersToAddToClass, addFolderToClass, saveStudySet } from '../../redux/reducers/AddFolderToClassSlice';
import { resetToggle } from '../../redux/reducers/ViewFolderCardSlice';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';
import styles from '../../styles/screen-styles/AddStudysetToClassPopup.module.css';
import {
  getFoldersToAddClassSelector,
  isSelectSelector,
  selectedFolderSelector,
  isEndLoadPersonalFoldersSelector,
  isLoadingFolderSelector,
} from '../../redux/selectors/Selectors';
import { useParams } from 'react-router-dom';
import { ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import { closeFolderPopupHandler } from '../../redux/reducers/AddFolderToClassSlice';

const AddFolderToClassPopup = ({ show, handleClose, submitButton, studysetName }) => {
  const isAddPopup = submitButton === 'Done' ? true : false;
  const dispatch = useDispatch();
  const { classId, studySetId } = useParams();

  const folders = useSelector(getFoldersToAddClassSelector);
  const isSelected = useSelector(isSelectSelector);
  const isEnd = useSelector(isEndLoadPersonalFoldersSelector);
  const isLoading = useSelector(isLoadingFolderSelector);
  const folderId = useSelector(selectedFolderSelector);

  const [newNameValue, setNewNameValue] = useState(studysetName);
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [limitCount, setLimit] = useState(1);

  const handleGetFoldersToAddToClassAPI = () => {
    const data = { limit: limitCount * 8, searchText: searchText, classId: classId };
    dispatch(getFoldersToAddToClass(data));
    setLimit(limitCount + 1);
  };

  const handleGetFoldersToSaveStudySetAPI = () => {
    const data = { limit: limitCount * 8, searchText: searchText };
    dispatch(getFoldersToAddToClass(data));
    setLimit(limitCount + 1);
  };

  const handleSearch = (event, value) => {
    setSearchValue(event.target.value ?? '');
    setLimit(1);
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
    isAddPopup
      ? await dispatch(addFolderToClass({ classId, folderId }))
          .unwrap()
          .then((originalPromiseResult) => {
            dispatch(
              updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG52 })
            );
            dispatch(setShow(true));
            dispatch(resetToggle());
          })
      : await dispatch(saveStudySet({ id: studySetId, folderId: folderId, name: newNameValue }))
          .unwrap()
          .then((originalPromiseResult) => {
            dispatch(
              updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG39 })
            );
            dispatch(setShow(true));
            dispatch(resetToggle());
          });
    handleClose();
  };

  const resetLimit = () => {
    setLimit(1);
    dispatch(closeFolderPopupHandler());
    isAddPopup ? handleGetFoldersToAddToClassAPI() : handleGetFoldersToSaveStudySetAPI();
  };

  useEffect(() => {
    resetLimit();
  }, [searchText, show]);

  const trackScrolling = () => {
    const wrappedElement = document.getElementById('scrollable');
    if ((wrappedElement.scrollHeight - wrappedElement.scrollTop - 0.5).toFixed() <= wrappedElement.clientHeight) {
      isAddPopup
        ? !isEnd
          ? handleGetFoldersToAddToClassAPI()
          : null
        : !isEnd
        ? handleGetFoldersToSaveStudySetAPI()
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
              {isAddPopup ? 'Add Folder To Class' : 'Save Study Set'}
            </p>
          </Modal.Header>

          <Modal.Body className={`${styles.modal_body}`}>
            {!isAddPopup ? (
              <Row className="mb-4">
                <Col className="d-flex pe-0" xs={4} lg={3}>
                  <p className="big-font my-auto">New name</p>
                </Col>
                <Col>
                  <TextField
                    sx={{
                      '& legend': { display: 'none' },
                      '& fieldset': { top: 0 },
                    }}
                    value={newNameValue}
                    onChange={(e) => setNewNameValue(e.target.value)}
                    size="small"
                    disabled={folders.length === 0}
                    className="w-100 pe-4"
                  />
                </Col>
              </Row>
            ) : null}

            <Row className="mb-4">
              <Col xs={6} className="d-flex">
                <p className="big-font my-auto">Choose Folder</p>
              </Col>
              <Col>
                <TextField
                  label="Search"
                  size="small"
                  onChange={handleSearch}
                  // disabled={isEnd}
                  className="ms-3 float-end w-100 pe-4"
                />
              </Col>
            </Row>

            <div className={`${styles.scrollable}`} id="scrollable" onScroll={trackScrolling}>
              <Row className="mb-3 pe-4">
                {folders.map((item, index) => {
                  return (
                    <Col key={item.id} xs={6} md={6} lg={6} className="pe-3 mb-2">
                      <FolderCardComponent flashInfo={item} selectable={true} />
                    </Col>
                  );
                })}
                {isLoading ? (
                  <div className="text-center">
                    <CircularProgress className="mt-2" />
                  </div>
                ) : folders.length === 0 ? (
                  <div>
                    <p className="huge-font blur-text-color fw-bolder text-center mt-3 mb-1"> You have no folder</p>
                    <div className={`d-flex justify-content-center ${styles.icon_slash_container}`}>
                      <i className={`far fa-folder ${styles.icon}`}></i>
                    </div>
                  </div>
                ) : null}
              </Row>
            </div>

            <Row className="mt-4 mb-2">
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
                <Button
                  className={'accept-button mx-auto'}
                  onClick={handleSubmit}
                  disabled={isAddPopup ? !isSelected : newNameValue === ''}
                >
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
export default AddFolderToClassPopup;
