import React from 'react';
import { Row, Col, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from '../styles/component-styles/NotificationCardComponent.module.css';
import { NotiType } from '../assets/TypeEnum';
import { useNavigate } from 'react-router-dom';

const classes = <i className="fas fa-user-friends theme-text-color me-1"></i>;
const studySet = <i className="fas fa-clone theme-text-color me-2"></i>;

const NotificationCardComponent = ({ notification }) => {
  const navigate = useNavigate();
  const { id, user, message, redirectUrl, createdAt, isRead, notiType } = notification;

  const handleClick = () => {
    location.href = redirectUrl;
  };

  const renderNotiType = () => {
    switch (notiType) {
      case NotiType.CLASS:
        return <i className={`fas fa-user-friends theme-text-color ${styles.Noti_type_icon}`}></i>;
      case NotiType.FORUM:
        return <i className={`fas fa-comments theme-text-color ${styles.Noti_type_icon}`}></i>;
      default:
        break;
    }
  };

  return (
    <div
      className="noselect"
      // key={id}
      onClick={handleClick}
    >
      <Row>
        <Col xs={3} md={2} lg={2} className="position-relative">
          <Image
            src={user.avatarUrl}
            alt="new"
            width="45"
            height="45"
            roundedCircle={true}
            referrerPolicy="no-referrer"
          />
          {renderNotiType()}
        </Col>
        <Col xs={9} md={10} lg={10}>
          <Row>
            <p className={`${styles.word_wrap_break} p-0 m-0`}>{message}</p>
          </Row>
          <Row className="blur-text-color">{createdAt}</Row>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationCardComponent;
