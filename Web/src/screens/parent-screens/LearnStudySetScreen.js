import { Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Col, Container, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import MultichoiceCardComponent from '../../components/MultichoiceCardComponent';
import {
  changeRefresh,
  changeMiddleQuestion,
  changeNumberQuestion,
  changeSwitchType,
  switchList,
} from '../../redux/reducers/LearnStudySetSlice';
import {
  getListQuestionReducer,
  getNumberQuestionReducer,
  getSwitchReducer,
} from '../../redux/selectors/LearnStudySetSelector';
import styles from '../../styles/screen-styles/LearnStudySet.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import learnApi from '../../api/learnApi';
import studySetApi from '../../api/studySetApi';

const LearnStudySetScreen = () => {
  let { studySetId } = useParams();
  const navigate = useNavigate();

  const getSwitchType = useSelector(getSwitchReducer);
  const getAllQuestion = useSelector(getListQuestionReducer);
  const getNumberQuestion = useSelector(getNumberQuestionReducer);

  const [show, setShow] = useState(false);
  const [name, setName] = useState('');

  const [isChecked, setChecked] = useState('');
  const dispatch = useDispatch();

  const handleRangeNumber = (val) => {
    dispatch(changeNumberQuestion(val));
  };

  const getNameStudySet = async () => {
    const studyset = await studySetApi.getStudySetInfoById(studySetId);
    setName(studyset.name);
  };

  useEffect(async () => {
    getNameStudySet();
    setChecked(getSwitchType);
  });

  const handleTermOption = () => {
    if (getSwitchType === 'definition') {
      setChecked('term');
      switchListAnswer();
    }
  };

  const handleDefinitionOption = () => {
    if (getSwitchType === 'term') {
      setChecked('definition');
      switchListAnswer();
    }
  };

  const switchListAnswer = () => {
    if (getSwitchType === 'term') {
      dispatch(changeSwitchType('definition'));
    }
    if (getSwitchType === 'definition') {
      dispatch(changeSwitchType('term'));
    }
    getAllQuestion.forEach((element) => {
      dispatch(
        switchList({
          id: element.id,
          term: element.definition,
          definition: element.term,
        })
      );
    });
  };

  const handleReset = async () => {
    await learnApi.resetLearn(studySetId);
    refreshPage();
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const handleBack = () => {
    // dispatch(changeRefresh(true));
    navigate(`/sets/${studySetId}`);
  };

  return (
    <>
      <Container key={studySetId} fluid className=" py-2 mb-5 white-background-color">
        <Row>
          <Col xs={2} md={3} className="text-start my-auto">
            <button className={`px-2 ${styles.no_btn} icon-color`} onClick={handleBack}>
              <i className="fas fa-arrow-left fa-lg"></i>
            </button>
          </Col>
          <Col xs={6} md={6} className="my-auto text-center">
            <h6 className="m-0">{name}</h6>
          </Col>
          <Col xs={4} md={3} className="text-end">
            <button className={`btn decline-button ${styles.option_btn}`} onClick={() => setShow(true)}>
              <i className="fas fa-cog"></i>
            </button>
            <Modal show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title className="mx-4">Setting</Modal.Title>
              </Modal.Header>
              <Modal.Body className="mx-4 pb-4">
                <Row>
                  <Col xs={12} md={6}>
                    <h6>Answer with</h6>
                    <Col className="mt-3 mb-4">
                      <ButtonGroup>
                        <button
                          className={`btn btn-outline-success ${
                            isChecked === 'term' ? styles.checked_btn : styles.checkbox_btn
                          }`}
                          type="radio"
                          value="term"
                          onClick={handleTermOption}
                        >
                          Definition
                        </button>
                        <button
                          className={`btn btn-outline-success ${
                            isChecked === 'definition' ? styles.checked_btn : styles.checkbox_btn
                          }`}
                          type="radio"
                          // checked={false}
                          value="definition"
                          onClick={handleDefinitionOption}
                        >
                          Term
                        </button>
                      </ButtonGroup>
                    </Col>
                  </Col>
                  <Col xs={12} md={6}>
                    <h6>Reset learning progress</h6>
                    <Col className="mt-3 mb-4">
                      <button type="button" onClick={handleReset} className="btn btn-success accept-button">
                        Reset
                      </button>
                    </Col>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <h6>The number of questions in one study </h6>
                    <Slider
                      min={4}
                      defaultValue={8}
                      step={1}
                      value={getNumberQuestion}
                      max={10}
                      marks
                      aria-label="Default"
                      valueLabelDisplay="auto"
                      onChangeCommitted={(e, val) => handleRangeNumber(val)}
                    />
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </Container>
      <Container>
        <MultichoiceCardComponent key={studySetId} />
      </Container>
    </>
  );
};

export default LearnStudySetScreen;
