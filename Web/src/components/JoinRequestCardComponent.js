import React from 'react';
import { Button, Row, Col, Image } from 'react-bootstrap';
import styles from '../styles/component-styles/JoinRequestCardStyle.module.css';
import { getJoinRequestClassByID } from '../redux/reducers/JoinRequestSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ResponseJoinRequestType, ToastType } from '../assets/TypeEnum';
import classApi from '../api/classApi';
import { setShow, updateToastInfo } from '../redux/reducers/ToastSlice';
import { Messages } from '../assets/Messages';

const JoinRequestCardComponent = ({ joinRequestDetail }) => {
  const { id, name, message, sentAt, avatarUrl } = joinRequestDetail;
  const { classId } = useParams();
  const dispatch = useDispatch();

  const handleResponse = async (type) => {
    try {
      await classApi.responseJoinRequest({ id: classId, userId: id, type: type });
      dispatch(getJoinRequestClassByID(classId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="shadow-box py-3 px-3 white-background-color">
      <Row className="m-0">
        <Col xs={3} md={2} lg={1} className="my-auto p-0">
          <Image className="mx-auto" src={avatarUrl} roundedCircle="true" width={64} height={64}></Image>
        </Col>
        <Col xs={6} md={4} lg={7} className={'text-start my-auto'}>
          <h5 className="mb-1">{name}</h5>
          <div>{message}</div>
        </Col>
        <Col xs={3} md={1} lg={1} className={`${styles.join_request_time} my-auto`}>
          {sentAt}
        </Col>
        <Col xs={12} md={5} lg={3} className={`${styles.join_request_col} my-auto`}>
          <Button
            className="accept-button me-3"
            variant="success"
            onClick={() => handleResponse(ResponseJoinRequestType.ACCEPT)}
          >
            Accept
          </Button>
          <Button
            className="decline-button"
            variant="success"
            onClick={() => handleResponse(ResponseJoinRequestType.DECLINE)}
          >
            Decline
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default JoinRequestCardComponent;
