import React from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import '../styles/component-styles/UserCardStyle.css';

const member = <i className="fas fa-user theme-text-color me-1"></i>;
const studySet = <i className="fas fa-clone theme-text-color me-1"></i>;

const ClassCardComponent = ({ classCard }) => {
  const navigate = useNavigate();
  const { id, name, school, createdAt, numOfSets, numOfMembers } = classCard;

  const handleClick = () => {
    navigate(`/classes/${id}`);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {name}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="top" delay={{ show: 100, hide: 100 }} overlay={renderTooltip}>
      <div
        className="shadow-box px-4 py-3 white-background-color-clickable noselect h-100"
        key={id}
        onClick={handleClick}
      >
        <Row>
          <Col className="text-start theme-text-color big-font justify-content-center align-self-center text-over-flow">
            {name}
          </Col>
          <Col className="text-end blur-text-color justify-content-center align-self-center" md={5}>
            {createdAt}
          </Col>
        </Row>
        <Row>
          <Col className="text-start blur-text-color">{school.name}</Col>
        </Row>
        <Row>
          <Col className="text-start d-flex ms-4 mt-3 blur-text-color">
            <div>
              {member} {numOfMembers} {numOfMembers > 1 ? 'members' : 'member'}
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-start d-flex ms-4 mt-1 blur-text-color">
            <div>
              {studySet} {numOfSets} {numOfSets > 1 ? 'study sets' : 'study set'}
            </div>
          </Col>
        </Row>
      </div>
    </OverlayTrigger>
  );
};

export default ClassCardComponent;
