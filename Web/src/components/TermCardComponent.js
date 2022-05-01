import React, { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../styles/component-styles/TermCardComponent-style.module.css';
import { currentUserInfoSelector } from '../redux/selectors/CurrentUserInfo';

const TermCardComponent = ({ termCardData, handleShow, setTermCardId }) => {
  const { id, term, definition } = termCardData;

  const currentUser = useSelector(currentUserInfoSelector);

  const handleSaveFlashcard = () => {
    setTermCardId(id);
    handleShow();
  };

  return (
    <Container className={`${styles.term_card_border} shadow-box white-background-color`}>
      <Row className="p-4">
        <Col xs={10} md={11} lg={11}>
          <Row>
            <Col md={4} xs={12} lg={4} className="py-2 paragraphs text-start">
              {term}
            </Col>
            <Col md={8} xs={12} lg={8} className={`${styles.definition_border} py-2 paragraphs text-start`}>
              {definition}
            </Col>
          </Row>
        </Col>
        <Col xs={2} md={1} lg={1} className="text-end">
          {currentUser.id ? (
            <button className={`${styles.btn_save_flashcard}`} onClick={handleSaveFlashcard}>
              <i className="fas fa-save fa-2x"></i>
            </button>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default TermCardComponent;
