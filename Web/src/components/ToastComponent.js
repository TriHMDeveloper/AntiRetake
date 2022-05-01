import { Toast, ToastContainer, Container } from 'react-bootstrap';
import React, { useEffect, useState, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastInfoSelector, showToastSelector } from '../redux/selectors/ToastSelector';
import { updateToastInfo, setShow } from '../redux/reducers/ToastSlice';
import { ToastType } from '../assets/TypeEnum';
import styles from '../styles/component-styles/ToastComponent.module.css';

const ToastComponent = () => {
  const dispatch = useDispatch();
  const toastInfo = useSelector(toastInfoSelector);
  const show = useSelector(showToastSelector);

  return (
    <Container className={styles.toast}>
      {/* <Button onClick={() => setShow(true)}>Create class</Button> */}
      <ToastContainer position="bottom-start" className={'ms-3 mb-3'}>
        <Toast
          onClose={() => {
            dispatch(setShow(false));
          }}
          show={show}
          delay={10000}
          autohide
        >
          <Toast.Header>
            {toastInfo.type === ToastType.SUCCESS ? (
              <i className="fas fa-check-circle me-2 theme-text-color fa-lg"></i>
            ) : (
              <i className="fas fa-times-circle me-2 error-text-color fa-lg"></i>
            )}
            <strong className="me-auto">{toastInfo.title}</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className="text-start">{toastInfo.description}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ToastComponent;
