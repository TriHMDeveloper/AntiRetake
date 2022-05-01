import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import QuestionDetailCardComponent from '../../components/QuestionDetailCardComponent';
import styles from '../../styles/component-styles/QuestionCardComponent-style.module.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQUestionDetail } from '../../redux/reducers/QuestionDetailSlice';
import { isErrorQuestionSelector, questionDetailSelector } from '../../redux/selectors/QuestionDetailSelector';
import { CircularProgress } from '@mui/material';

const ViewQuestion = () => {
  let { questionId } = useParams();
  const questionData = useSelector(questionDetailSelector);
  const isError = useSelector(isErrorQuestionSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getQUestionDetail(questionId));
  }, []);

  if (Object.keys(questionData).length !== 0) {
    return (
      <Container>
        <Row className="mb-4 mt-5 px-1" md="auto" xs="auto">
          <Col className="text-start">
            <i className={` fas fa-comments fa-3x ${styles.color_button}`}></i>
          </Col>
          <Col className="text-start my-auto">
            <h2 className="my-0">Question</h2>
          </Col>
        </Row>
        <QuestionDetailCardComponent questionData={questionData}></QuestionDetailCardComponent>
      </Container>
    );
  } else {
    return (
      <Container>
        {isError ? (
          <h1 className="blur-text-color mt-5">Loading question fail...</h1>
        ) : (
          <CircularProgress className=" mt-5" />
        )}
      </Container>
    );
  }
};

export default ViewQuestion;
