import React from 'react';
import { Row, Col, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const classes = <i className="fas fa-user-friends theme-text-color me-1"></i>;
const studySet = <i className="fas fa-clone theme-text-color me-2"></i>;

const UserCardComponent = ({ userCard }) => {
  const navigate = useNavigate();
  const { uid, username, email, avatarUrl, numOfClasses, numOfSets } = userCard;

  const handleClick = () => {
    navigate(`/users/${uid}`);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {username}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="top" delay={{ show: 100, hide: 100 }} overlay={renderTooltip}>
      <div
        className="shadow-box px-4 py-3 white-background-color-clickable noselect h-100"
        key={uid}
        onClick={handleClick}
      >
        <Row>
          <Col className="text-start d-flex">
            <Image src={avatarUrl} alt="new" width="35" height="35" roundedCircle={true} />
            <Col className="ps-3 justify-content-center align-self-center text-start theme-text-color big-font text-over-flow">
              {username}
            </Col>
          </Col>
        </Row>
        <Row>
          <Col className="text-start d-flex ms-3 mt-3 blur-text-color">
            <div>
              {classes} {numOfClasses} {numOfClasses > 1 ? 'classes' : 'class'}
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-start d-flex ms-3 mt-1 blur-text-color">
            <div>
              {studySet} {numOfSets} {numOfSets > 1 ? 'study sets' : 'study set'}
            </div>
          </Col>
        </Row>
      </div>
    </OverlayTrigger>
  );
};

export default UserCardComponent;
