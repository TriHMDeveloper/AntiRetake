import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import styles from '../styles/component-styles/ResultMultichoiceBarStyle.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { getListLearnReducer } from '../redux/selectors/LearnStudySetSelector';
import { changeCurrent } from '../redux/reducers/LearnStudySetSlice';

const ResultMultichoiceBarComponent = ({
  content,
  currentQuestion,
  lengthListLearn,
  setListQuestion,
  setIsAnswer,
  setIsEnd,
}) => {
  const dispatch = useDispatch();
  const listLearn = useSelector(getListLearnReducer);

  const handleClick = () => {
    if (currentQuestion < lengthListLearn - 1) {
      dispatch(changeCurrent(currentQuestion + 1));
    } else {
      if (listLearn.length !== 0) {
        setListQuestion(listLearn);
        dispatch(changeCurrent(0));
        setIsAnswer(false);
      } else {
        setIsEnd(true);
      }
    }
  };

  return (
    <div>
      <Modal.Dialog className={styles.full_width_modal}>
        <Modal.Body className={styles.modal_body}>
          <Row className="mx-5 my-1">
            <Col className="my-auto text-start p-1" xs={12} md={6}>
              <p className="big-font my-auto">{content}</p>
            </Col>
            <Col className="text-end p-1" xs={5} md={6}>
              <Button onClick={handleClick} className="accept-button p-2 float-right" variant="success">
                Continue
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};

export default ResultMultichoiceBarComponent;
