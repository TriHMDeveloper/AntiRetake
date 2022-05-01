import { React, useRef, useEffect, useState } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';

import styles from '../styles/component-styles/CreateStudySetCardStyle.module.css';
import {
  handleRemoveItem,
  inputFlashcard,
  scrollHeight,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
} from '../redux/reducers/CreateFlashcardSlice';
import { useDispatch } from 'react-redux';

const CreateStudySetCardComponent = ({ flashcard, i }) => {
  const dispatch = useDispatch();
  const { id, term, definition } = flashcard;
  // const [inputError, setInputError] = useState(false);
  const setTerm = (term, definition) => {
    dispatch(inputFlashcard({ id, term, definition }));
  };

  useEffect(() => {
    dispatch(scrollHeight());
  }, []);

  const resizeHeight = (e) => {
    const elementTerm = document.getElementById('term' + id);
    const elementDefine = document.getElementById('define' + id);
    elementTerm.style.height = '5px';
    elementTerm.style.height = elementTerm.scrollHeight + 'px';
    elementDefine.style.height = '5px';
    elementDefine.style.height = elementDefine.scrollHeight + 'px';
  };

  return (
    <div className="m-0">
      <Container
        className={`white-background-color p-2 rounded-1 mb-3 m-0 ${styles.study_set_card}`}
        draggable
        onDragStart={(e) => dispatch(handleDragStart(i))}
        onDragOver={(e) => dispatch(handleDragOver(i))}
        onDragEnd={(e) => dispatch(handleDragEnd())}
      >
        <Row>
          <Col className="text-start">
            <div>
              <i className="fas fa-ellipsis-v"></i>
              <i className="fas fa-ellipsis-v"></i> {i + 1}
            </div>
          </Col>
          <Col className={'d-flex justify-content-md-end'}>
            <Button
              className={`text-center p-0 far fa-trash-alt theme-text-color ${styles.trash_icon}`}
              variant="outline-danger"
              onClick={() => dispatch(handleRemoveItem(id))}
            />
          </Col>
        </Row>
        <Row className="mt-3 d-flex align-items-end">
          <Col>
            <Form.Control
              id={'term' + id}
              as="textarea"
              style={{ resize: 'none', overflowY: 'hidden' }}
              rows={1}
              className={`p-0 ${styles.term_input}`}
              placeholder="Term"
              value={term}
              onChange={(e) => {
                resizeHeight(e);
                setTerm(e.target.value, definition);
              }}
              type="text"
            />
          </Col>
          <Col>
            <Form.Control
              as="textarea"
              id={'define' + id}
              style={{ resize: 'none', overflowY: 'hidden' }}
              rows={1}
              className={`p-0 ${styles.term_input}`}
              placeholder="Definition"
              value={definition}
              onChange={(e) => {
                resizeHeight(e);
                setTerm(term, e.target.value);
              }}
              type="text"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateStudySetCardComponent;
