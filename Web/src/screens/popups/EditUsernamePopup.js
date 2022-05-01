import { TextField } from '@mui/material';
import { React, useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import profileApi from '../../api/profileApi';
import { Messages } from '../../assets/Messages';
import { ToastType } from '../../assets/TypeEnum';
import { getCurrentUserInfo } from '../../redux/reducers/CurrentUserInfoSlice';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';
import { getUserInfo } from '../../redux/reducers/UserInfoSlice';
import { currentUserInfoSelector } from '../../redux/selectors/CurrentUserInfo';
import styles from '../../styles/screen-styles/AddStudysetToClassPopup.module.css';
import * as Yup from 'yup';

const EditUsernamePopup = ({ show, handleClose, oldName }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserInfoSelector);
  const [username, setUsername] = useState(oldName);

  const validateUsernameSchema = Yup.object().shape({
    username: Yup.string().min(4, 'Too Short').max(40, 'Too Long').required('Required'),
  });
  const [error, setError] = useState('');

  const getErrorMessages = ({ path, message, inner }) => {
    if (inner && inner.length) {
      return inner.reduce((acc, { path, message }) => {
        acc[path] = message;
        return acc;
      }, {});
    }
    return { [path]: message };
  };

  const handleChangeName = (e) => {
    setUsername(e.target.value);
    setError('');
    try {
      validateUsernameSchema.validateSync({ username: e.target.value.trim() });
    } catch (err) {
      setError(getErrorMessages(err).username);
    }
  };

  const handleSubmit = async (e) => {
    try {
      const response = await profileApi.editUserInfo({ name: username });
      handleClose();
      await dispatch(getUserInfo(currentUser.id));
      await dispatch(getCurrentUserInfo());
      dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG34 }));
      dispatch(setShow(true));
    } catch (error) {
      handleClose();
    }
  };

  useEffect(() => {
    setUsername(oldName);
    setError('');
  }, [show]);

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
            <p className={`my-auto huge-font ms-3 ${styles.header_text}`}>Edit your name</p>
          </Modal.Header>

          <Modal.Body className={`${styles.modal_body}`}>
            <Row className="my-2 px-4">
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                defaultValue={oldName}
                onChange={handleChangeName}
              />
            </Row>
            <Row className="mb-4 px-4">
              <div className={`justify-self-start d-flex ${styles.required_text}`}>{error}</div>
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
                <Button
                  className={'accept-button mx-auto'}
                  onClick={handleSubmit}
                  disabled={username === oldName || error !== ''}
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
export default EditUsernamePopup;
