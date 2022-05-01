import { LinearProgress } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import learnApi from '../api/learnApi';
import {
  addLearn,
  changeCurrent,
  changeMiddleQuestion,
  changeRefresh,
  changSetCount,
  deleteLearn,
  getAllListLearn,
  changeDefinitionList,
  changeTermList,
  changeSwitchType,
} from '../redux/reducers/LearnStudySetSlice';
import {
  getCountSetReducer,
  getCurrentReducer,
  getLength,
  getListLearnReducer,
  getListQuestionReducer,
  getNumberQuestionReducer,
  getRefresh,
  getSetQuestionReducer,
  getSwitchReducer,
  getTearmList,
  getDefinitionLists,
} from '../redux/selectors/LearnStudySetSelector';
import styles from '../styles/component-styles/MultichoiceCardComponentStyle.module.css';
import ResultMultichoiceBarComponent from './ResultMultichoiceBarComponent';

const MultichoiceCardComponent = () => {
  const getAllQuestion = useSelector(getListQuestionReducer);
  const getSetQuestion = useSelector(getSetQuestionReducer);
  const listLearn = useSelector(getListLearnReducer);
  const currentQuestion = useSelector(getCurrentReducer);
  const getCountSet = useSelector(getCountSetReducer);
  const getSwitchType = useSelector(getSwitchReducer);
  const getNumberQuestion = useSelector(getNumberQuestionReducer);
  const getLengthLearn = useSelector(getLength);
  const isRefresh = useSelector(getRefresh);
  const getTermList = useSelector(getTearmList);
  const getDefinitionList = useSelector(getDefinitionLists);

  const [listQuestion, setListQuestion] = useState(getSetQuestion);
  const [listAnswer, setListAnswer] = useState([]);
  const [question, setQuestion] = useState('');
  const [isAnswer, setIsAnswer] = useState(false);
  const [chooseNumber, setChooseNumber] = useState();
  const [showCorrect, setShowCorrect] = useState();
  const [isEnd, setIsEnd] = useState(false);
  const [message, setMessage] = useState('');
  const [isFist, setisFist] = useState(true);
  const [isFist2, setisFist2] = useState(false);
  const [titleState, setTitleState] = useState(getSwitchType);

  let { studySetId } = useParams();

  useEffect(() => {
    setTitleState(getSwitchType);
  }, [getSwitchType]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  var listAnswerRandom = [];
  var now = (100 / getSetQuestion.length) * (getSetQuestion.length - listLearn.length);
  var all = ((getCountSet + getSetQuestion.length) / getLengthLearn) * 100;

  const reset = () => {
    dispatch(changSetCount(0));
    dispatch(changeCurrent(0));
    dispatch(changeMiddleQuestion([{ id: '', term: '', definition: '', status: 'notlearn' }]));
    dispatch(addLearn([]));
    dispatch(changeDefinitionList(['A', 'B', 'C', 'D', 'T', 'True']));
    dispatch(changeTermList(['A', 'B', 'C', 'D', 'T', 'True']));
    dispatch(changeSwitchType('term'));
  };

  const handleClickFinish = () => {
    dispatch(changeRefresh(true));
    setisFist(true);
    setisFist2(false);
    navigate(`/sets/${studySetId}`);
  };
  const load = () => {
    reset();
    // dispatch(changeRefresh(false));
    dispatch(getAllListLearn(studySetId));
    setisFist(false);
    setisFist2(true);
  };

  useEffect(() => {
    if (isFist) {
      load();
    }
    getLearnList();
    setListQuestion(getSetQuestion);
    getQuestion();
  }, [getSetQuestion, getSwitchType]);

  useEffect(() => {
    // if (isRefresh) {
    //   refreshPage();
    // }
    if (isFist2) {
      getQuestion();
      getListAnswerRandom();
      randomAnswer();
      setIsAnswer(false);
      setMessage('');
    }
  }, [currentQuestion, getSwitchType, listQuestion]);

  const getLearnList = () => {
    dispatch(addLearn(getSetQuestion));
  };

  const checkNumberAnswer = (list) => {
    let countList = [];
    list.forEach((answer) => {
      if (!countList.includes(answer)) {
        countList.push(answer);
      }
    });
    return countList;
  };

  const getListAnswerRandom = () => {
    if (getSwitchType === 'definition') {
      getTermList.forEach((answer) => {
        listAnswerRandom.push(answer);
      });
    } else {
      getDefinitionList.forEach((answer) => {
        listAnswerRandom.push(answer);
      });
    }
    if (
      listAnswerRandom.includes('A') ||
      listAnswerRandom.includes('B') ||
      listAnswerRandom.includes('C') ||
      listAnswerRandom.includes('D')
    ) {
      listAnswerRandom.push('A');
      listAnswerRandom.push('B');
      listAnswerRandom.push('C');
      listAnswerRandom.push('D');
    }

    if (
      listAnswerRandom.includes('a') ||
      listAnswerRandom.includes('b') ||
      listAnswerRandom.includes('c') ||
      listAnswerRandom.includes('d')
    ) {
      listAnswerRandom.push('a');
      listAnswerRandom.push('b');
      listAnswerRandom.push('c');
      listAnswerRandom.push('d');
    }
  };

  const getRandomAnswer = () => {
    let randomIndex = Math.floor(Math.random() * listAnswerRandom.length);
    return listAnswerRandom[randomIndex];
  };

  const checkAnswerIsDupplicate = (listRandom) => {
    let check;
    let answerRandom;
    do {
      check = 0;
      answerRandom = getRandomAnswer();
      listRandom.forEach((answer) => {
        if (answer.toLowerCase() === answerRandom.toLowerCase()) {
          check = 1;
        }
      });
    } while (check === 1);
    return answerRandom;
  };

  const checkAnswer = (answer, index) => {
    setChooseNumber(index);
    if (answer === listQuestion[currentQuestion].definition) {
      setIsAnswer(true);
      setMessage('Well done! Keep it up');
      dispatch(deleteLearn(listQuestion[currentQuestion].id));
    } else {
      setIsAnswer(true);
      setMessage('Do not give up! You will remember it soon');
    }
  };

  const randomAnswer = () => {
    let answerCorrect = listQuestion[currentQuestion].definition;
    let listRandom = [];
    let anwerWrong = '';
    let number = 2;
    let checkList = false;
    if (answerCorrect.toLowerCase() === 'T'.toLowerCase() || answerCorrect.toLowerCase() === 'True'.toLowerCase()) {
      number = 2;
      if (answerCorrect.toLowerCase() === 'T'.toLowerCase()) {
        anwerWrong = 'F';
      } else {
        anwerWrong = 'False';
      }
    } else if (
      answerCorrect.toLowerCase() === 'F'.toLowerCase() ||
      answerCorrect.toLowerCase() === 'False'.toLowerCase()
    ) {
      number = 2;
      if (answerCorrect.toLowerCase() === 'F'.toLowerCase()) {
        anwerWrong = 'T';
      } else {
        anwerWrong = 'True';
      }
    } else if (checkNumberAnswer(listAnswerRandom).length < 4) {
      number = checkNumberAnswer(listAnswerRandom).length;
      checkList = true;
    } else {
      number = 4;
    }
    let randomIndexCorrect = Math.floor(Math.random() * number);

    listRandom[randomIndexCorrect] = answerCorrect;
    for (let index = 0; index < number; index++) {
      if (index === randomIndexCorrect) {
        continue;
      } else {
        if (number === 2 && !checkList) {
          listRandom[index] = anwerWrong;
        } else {
          listRandom[index] = checkAnswerIsDupplicate(listRandom);
        }
      }
    }
    setListAnswer(listRandom);
    setShowCorrect(randomIndexCorrect);
  };

  const handleClickAgain = () => {
    let oldCountSet = getCountSet;
    dispatch(changSetCount(null));
    dispatch(changSetCount(oldCountSet));
    dispatch(changeCurrent(0));
    setChooseNumber(null);
    setShowCorrect(null);
    setIsAnswer(false);
    setIsEnd(false);
  };

  const returnListLearn = () => {
    const list = [];
    getSetQuestion.map((item) => {
      list.push(item.id);
    });
    learnApi.setIsLearned(studySetId, {
      flashcardIds: list,
    });
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const resetLearn = async () => {
    await learnApi.resetLearn(studySetId);
    refreshPage();
  };

  const handleClickCountinue = () => {
    returnListLearn();
    dispatch(changSetCount(getCountSet + getNumberQuestion));
    dispatch(changeCurrent(0));
    setChooseNumber(null);
    setShowCorrect(null);
    setIsAnswer(false);
    setIsEnd(false);
    // setisFist(true);
    // setisFist2(false);
  };

  const renderAnswers = () => {
    const renderAnswer = listAnswer.map((answer, index) => {
      return (
        <Col md={6} key={index} className="my-2 paragraphs">
          {isAnswer && (chooseNumber === index) | (showCorrect === index) ? (
            <button
              disabled={true}
              className={`w-100 white-background-color h-100 p-3 ${
                answer === listQuestion[currentQuestion].definition ? styles.correct : styles.wrong
              } `}
            >
              <Row>
                <Col xs={11} className="text-start pe-0">
                  <label>{answer}</label>
                </Col>
                <Col xs={1} className="my-auto mx-auto p-0">
                  {answer === listQuestion[currentQuestion].definition ? (
                    <i className="fas fa-check correct-text-color"></i>
                  ) : (
                    <i className="fas fa-times error-text-color"></i>
                  )}
                </Col>
              </Row>
            </button>
          ) : (
            <button
              onClick={() => checkAnswer(answer, index)}
              disabled={isAnswer}
              className={`w-100 white-background-color p-3 h-100 ${
                isAnswer ? styles.no_choice : styles.multichoice_button
              } `}
            >
              <Row>
                <Col className="text-start">
                  <label>{answer}</label>
                </Col>
              </Row>
            </button>
          )}
        </Col>
      );
    });
    return renderAnswer;
  };

  const getQuestion = () => {
    setQuestion(listQuestion[currentQuestion].term);
  };

  const renderQuestion = () => {
    return (
      <Col className="text-start paragraphs">
        <p>{question}</p>
      </Col>
    );
  };

  if (getAllQuestion[0].id !== '') {
    return !isEnd ? (
      <>
        <Container key={studySetId} className="shadow-box white-background-color pb-5 mt-4 px-0">
          <Row className="px-0 mx-0 my-4">
            <LinearProgress value={now} variant="determinate" />
          </Row>
          <Row>
            <Col className="mx-5 mt-3">
              <Row className="mb-3">
                <Col className="text-start mt-4">
                  {titleState === 'definition' ? (
                    <label className="fw-bold">Definition</label>
                  ) : (
                    <label className="fw-bold">Term</label>
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                {renderQuestion()}
                {/* <Col className="text-start">
                  <p>{listQuestion[currentQuestion].term}</p>
                </Col> */}
              </Row>
              <Row className="mt-3">
                <Col className="text-start">
                  {titleState === 'definition' ? (
                    <label className="fw-bold">Term</label>
                  ) : (
                    <label className="fw-bold">Definition</label>
                  )}
                </Col>
              </Row>
              <Row className="my-auto">{renderAnswers()}</Row>
            </Col>
          </Row>
        </Container>
        {isAnswer ? (
          <div className={styles.result_bar}>
            <ResultMultichoiceBarComponent
              content={message}
              currentQuestion={currentQuestion}
              lengthListLearn={listQuestion.length}
              setListQuestion={setListQuestion}
              setIsAnswer={setIsAnswer}
              setIsEnd={setIsEnd}
            />
          </div>
        ) : null}
      </>
    ) : (
      <Container fluid className="white-background-color pb-5 mt-4">
        {getCountSet + getSetQuestion.length + (getLengthLearn - getAllQuestion.length) === getLengthLearn ? (
          <Row>
            {returnListLearn()}
            <Col className="px-4 my-auto" md={6}>
              <h2 className="mt-3 mb-5">Congratulations !! </h2>
              <h3 className="mb-2">You have learned all the content</h3>
              <p className="mb-5 px-3"> Let&apos;s relearn the study set or try another study set </p>
              <Row className="mt-5 px-4">
                <Col className="mx-auto">
                  <button type="button" onClick={resetLearn} className="btn btn-success decline-button mx-auto my-2">
                    Learn again
                  </button>
                </Col>
                <Col className="mx-auto">
                  <button
                    type="button"
                    className="btn btn-success accept-button mx-auto my-2"
                    onClick={handleClickFinish}
                  >
                    Finish
                  </button>
                </Col>
              </Row>
            </Col>
            <Col className="my-auto" md={6}>
              <Image
                src="https://media.istockphoto.com/vectors/smiling-boy-winner-holding-first-trophy-in-hand-vector-illustration-vector-id1192937908?k=20&m=1192937908&s=170667a&w=0&h=kBmxtj81hu7_BBUnRa-UCV7nu46f31H1tGJZEghOoI8="
                fluid={true}
              ></Image>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col className="mt-3 text-start px-5" md={6}>
              <Row className="mt-3">
                <h2>Keep trying, you are so excellent !! </h2>
              </Row>
              <Row className="mt-5">
                <p>
                  {' '}
                  You have completed {getCountSet + getSetQuestion.length + (getLengthLearn - getAllQuestion.length)}/
                  {getLengthLearn} questions
                </p>
                <Col className="me-5">
                  <LinearProgress value={all} variant="determinate" color="success" />
                </Col>
              </Row>
              <Row className="mt-5">
                <h6>Want to review the questions you just learned ?</h6>
                <Col className="mt-2">
                  <button type="button" className="btn btn-success accept-button" onClick={handleClickAgain}>
                    Learn again
                  </button>
                </Col>
              </Row>
              <Row className="mt-5">
                <h6>Do you want to keep learning new questions ?</h6>
                <Col className="mt-2">
                  <button type="button" className="btn btn-success accept-button" onClick={handleClickCountinue}>
                    Continue
                  </button>
                </Col>
              </Row>
            </Col>
            <Col className="my-auto" md={6}>
              <Image
                src="https://cdn.dribbble.com/users/997338/screenshots/14118567/media/fd193848744e851927a2f7e8ae6c2961.png?compress=1&resize=400x300"
                fluid={true}
              ></Image>
            </Col>
          </Row>
        )}
      </Container>
    );
  } else if (getAllQuestion[0].id === '' && getAllQuestion[0].status === 'learned') {
    {
      return (
        <Container fluid className="white-background-color pb-5 mt-4">
          <Row>
            <Col className="px-4 my-auto" md={6}>
              <h2 className="mt-3 mb-5">Congratulations !! </h2>
              <h3 className="mb-2">You have learned all the content</h3>
              <p className="mb-5 px-3"> Let&apos;s relearn the study set or try another study set </p>
              <Row className="mt-5 px-4">
                <Col className="mx-auto">
                  <button type="button" onClick={resetLearn} className="btn btn-success decline-button mx-auto my-2">
                    Learn again
                  </button>
                </Col>
                <Col className="mx-auto">
                  <button
                    type="button"
                    className="btn btn-success accept-button mx-auto my-2"
                    onClick={handleClickFinish}
                  >
                    Finish
                  </button>
                </Col>
              </Row>
            </Col>
            <Col className="my-auto" md={6}>
              <Image
                src="https://media.istockphoto.com/vectors/smiling-boy-winner-holding-first-trophy-in-hand-vector-illustration-vector-id1192937908?k=20&m=1192937908&s=170667a&w=0&h=kBmxtj81hu7_BBUnRa-UCV7nu46f31H1tGJZEghOoI8="
                fluid={true}
              ></Image>
            </Col>
          </Row>

          {/* {isError ? <ToastComponent type={ToastType.ERROR} title={'ERROR'} description={Messages.MSG28} /> : null} */}
        </Container>
      );
    }
  } else {
    return <CircularProgress className="mt-2" />;
  }
};

export default MultichoiceCardComponent;
