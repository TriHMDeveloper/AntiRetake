import React, { useState } from 'react';
import { Row, Col, Image, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { currentUserInfoSelector } from '../redux/selectors/CurrentUserInfo';
import ConfirmDeleteComponent from './ConfirmDeleteComponent';
import { classInfoSelector } from '../redux/selectors/ClassInfoSelector';
import styles from '../styles/component-styles/StudySetCardStyle.module.css';
import { UserClassRole } from '../assets/TypeEnum';
import { Messages } from '../assets/Messages';

const star = <i className="fas fa-star star-color me-1"></i>;
const StudySetCardComponent = ({ studySet, removable, handleShowDelete, setStudySetDelete }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserInfoSelector);
  const classInfo = useSelector(classInfoSelector);
  const { id, name, createdAt, numOfTerms, rating, owner, textbook, subject } = studySet;

  const handleClick = () => {
    navigate(`/sets/${id}`);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {name}
    </Tooltip>
  );

  const handleRemove = (e) => {
    e.stopPropagation();
    setStudySetDelete({ id: id, name: name });
    handleShowDelete();
  };

  return (
    <OverlayTrigger placement="top" delay={{ show: 100, hide: 100 }} overlay={renderTooltip}>
      <div className="shadow-box px-4 py-3 white-background-color-clickable h-100" key={id} onClick={handleClick}>
        {removable && (owner.id === currentUser.id || classInfo.currentUserRole === UserClassRole.OWNER) ? (
          <>
            <Dropdown>
              <Dropdown.Toggle
                variant="none"
                onClick={handleRemove}
                className={`${styles.dropdown_toggle} ${styles.btn}`}
                id="dropdown-menu-align-end"
              >
                <i className={`fas fa-times blur-text-color ${styles.remove_icon}`}></i>
              </Dropdown.Toggle>
            </Dropdown>
          </>
        ) : (
          <></>
        )}

        <Row>
          <Col
            className={'text-start theme-text-color big-font justify-content-center align-self-center text-over-flow'}
            xs={7}
            md={7}
            lg={7}
          >
            {name}
          </Col>
          <Col className="text-end blur-text-color align-middle justify-content-center align-self-center" xs={5} md={5}>
            {createdAt}
          </Col>
        </Row>
        <Row md="auto">
          <Col className="text-start blur-text-color">
            {numOfTerms} {numOfTerms > 1 ? 'terms' : 'term'}
          </Col>
          <Col className="text-start">
            {star}
            {rating}
          </Col>
        </Row>
        <Row className="my-2">
          <Col className="text-start d-flex">
            <div>
              <Image
                src={owner.avaUrl}
                alt="new"
                width="40"
                height="40"
                roundedCircle={true}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="ms-2 text-start align-items-center d-flex bold-black-text-color">{owner.name}</div>
          </Col>
        </Row>
        <Row xs="auto">
          {subject.name ? (
            <Col className={`text-start ${styles.tag_container}`}>
              <div className={`subject-color ${styles.tag_style} text-over-flow`}>{subject.name}</div>
            </Col>
          ) : (
            <></>
          )}
          {textbook.name ? (
            <Col className={`text-start ${styles.tag_container}`}>
              <div className={`textbook-color ${styles.tag_style} text-over-flow`}>{textbook.name}</div>
            </Col>
          ) : (
            <></>
          )}
          {!subject.name && !textbook.name ? (
            <Col className={`text-start ${styles.tag_container}`}>
              <div className={`${styles.tag_style} text-over-flow`}>.</div>
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </div>
    </OverlayTrigger>
  );
};

export default StudySetCardComponent;
