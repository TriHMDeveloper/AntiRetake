import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import classApi from '../../api/classApi';
import { Messages } from '../../assets/Messages';
import { ToastType } from '../../assets/TypeEnum';
import { getClassByID } from '../../redux/reducers/CreateClassSlice';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';
import styles from '../../styles/screen-styles/SendJoinRequest.module.css';

const SendJoinRequestScreen = ({ show, handleClose, className }) => {
  const [message, setMessage] = useState('');
  const { classId } = useParams();
  const dispatch = useDispatch();

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName={styles.container_modal}
      contentClassName={styles.content_modal}
      centered
    >
      <Modal.Body>
        <div className="text-start">
          <h4 className={`${styles.title}`}>Join Request</h4>
        </div>
        <div className={`${styles.body}`}>
          <p className={`${styles.text} text-start`}>
            Want in? Write a message to <b>{className}</b>’s owner to ask for access, or switch to an account joined
            this class.
          </p>
        </div>
        <textarea
          maxLength="200"
          rows="6"
          value={message}
          className={`${styles.textarea}`}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="d-flex justify-content-around">
          <Button className={'decline-button'} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className={'accept-button'}
            onClick={async () => {
              const body = { message: message };
              try {
                await classApi.sendJoinRequest(classId, body);
                await dispatch(getClassByID(classId));
                dispatch(
                  updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG43 })
                );
                dispatch(setShow(true));
              } catch (error) {
                console.log('Fail to fetch: ', error);
              }
              handleClose();
            }}
          >
            Send
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SendJoinRequestScreen;
