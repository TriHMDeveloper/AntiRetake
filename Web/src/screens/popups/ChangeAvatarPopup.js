import { React, useEffect, useState, useRef } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import LinearProgress from '@mui/material/LinearProgress';
import { storage } from '../../config/firebase-config';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import Avatar from 'react-avatar-edit';
import { ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import styles from '../../styles/screen-styles/AddStudysetToClassPopup.module.css';
import ToastComponent from '../../components/ToastComponent';

import { useDispatch, useSelector } from 'react-redux';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import profileApi from '../../api/profileApi';
import { getUserInfo } from '../../redux/reducers/UserInfoSlice';
import { currentUserInfoSelector } from '../../redux/selectors/CurrentUserInfo';
import { getCurrentUserInfo } from '../../redux/reducers/CurrentUserInfoSlice';

const ChangeAvatarPopup = ({ show, handleClose, userId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserInfoSelector);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState();

  // useEffect(() => {}, [dispatch]);

  const onBeforeFileLoad = (e) => {
    if (e.target.files[0].type.split('/')[0] !== 'image') {
      dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG31 }));
      dispatch(setShow(true));
      handleClose();
      e.target.value = '';
    }
  };

  const onFileLoad = (file) => {
    setImage(file);
  };

  const uploadFiles = (file) => {
    //
    if (!file) {
      return;
    }
    const storageRef = ref(storage, `avatar/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => {
        setProgress(0);
        dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG30 }));
        dispatch(setShow(true));
        handleClose();
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const response = await profileApi.editUserInfo({ avatarUrl: downloadURL });
            handleClose();
            await dispatch(getUserInfo(currentUser.id));
            await dispatch(getCurrentUserInfo());
            setProgress(0);
            dispatch(
              updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG29 })
            );
            dispatch(setShow(true));
          } catch (error) {
            setProgress(0);
            handleClose();
          }
        });
      }
    );
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
            <p className={`my-auto huge-font ms-3 ${styles.header_text}`}>Change Avatar</p>
          </Modal.Header>

          <Modal.Body className={`${styles.modal_body}`}>
            <Row className="mb-4">
              <Avatar
                width="100%"
                height={300}
                cropRadius={10000}
                shadingOpacity={0}
                // onCrop={this.onCrop}
                // onClose={this.onClose}
                onBeforeFileLoad={onBeforeFileLoad}
                onFileLoad={onFileLoad}
                // src={this.state.src}
              />
            </Row>
            <Row>
              <LinearProgress variant="determinate" value={progress} hidden={progress === 0} />
            </Row>
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
                <Button
                  className={'accept-button mx-auto'}
                  onClick={() => {
                    // TODO: Thêm Toast hiện success hay fail sau khi chạy API submit
                    uploadFiles(image);
                  }}
                  disabled={!image}
                >
                  Done
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    </div>
  );
};
export default ChangeAvatarPopup;
