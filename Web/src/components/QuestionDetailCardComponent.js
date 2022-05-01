/* eslint-disable react/no-children-prop */
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmDeleteComponent from './ConfirmDeleteComponent';
import { updateToastInfo, setShow } from '../redux/reducers/ToastSlice';
import { ToastType } from '../assets/TypeEnum';
import { Messages } from '../assets/Messages';
import { auth } from '../config/firebase-config';
import {
  deleteDownVote,
  deleteUpVote,
  downVote,
  upVote,
  getQUestionDetail,
  resetQuestion,
} from '../redux/reducers/QuestionDetailSlice';
import { questionDetailSelector, isErrorQuestionSelector } from '../redux/selectors/QuestionDetailSelector';
import { currentUserInfoSelector } from '../redux/selectors/CurrentUserInfo';
import styles from '../styles/component-styles/QuestionCardComponent-style.module.css';
import CommentBarComponent from './CommentBarComponent';
import CommentComponent from './CommentComponent';
import TagComponent from './TagComponent';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/common-styles/CommonImage.css';
import questionApi from '../api/questionApi';

const QuestionDetailCardComponent = ({ questionData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getCurrentUser = useSelector(currentUserInfoSelector);
  // const questionData = useSelector(questionDetailSelector);

  // const [recentId, setRecentId] = useState(getCurrentUser.id)
  const recentId = getCurrentUser.id;
  const recentName = getCurrentUser.username;
  const recentAva = getCurrentUser.avatarUrl;

  let { questionId } = useParams();

  const handleClickEditQuestion = () => {
    navigate(`/forum/${questionData.id}/edit`);
  };

  useEffect(() => {
    if (Object.keys(questionData).length !== 0) {
      checkUpDownVote();
    }
  }, [CommentBarComponent, questionData]);

  const renderComments = () => {
    const renderComment = questionData.commentList.map((comment) => {
      const renderReplyComment = comment.commentList.map((reply) => {
        return (
          <Row key={reply.id} className="ps-5">
            <CommentComponent dataComment={reply} recentId={recentId} recentAva={recentAva} recentName={recentName} />
          </Row>
        );
      });
      return (
        <Row key={comment.id}>
          <Row className="pe-0">
            <CommentComponent dataComment={comment} recentId={recentId} recentAva={recentAva} recentName={recentName} />
            {renderReplyComment}
          </Row>
        </Row>
      );
    });
    return renderComment;
  };

  const [isCommentClick, setIsCommentClick] = useState(false);
  const [isUpVote, setIsUpVote] = useState(false);
  const [isDownVote, setIsDownVote] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleUpVote = async () => {
    if (auth.currentUser) {
      if (!isUpVote) {
        if (isDownVote) {
          questionApi.deleteVoteQuestion(questionData.id);
          dispatch(deleteDownVote(recentId));
        }
        questionApi.voteQuestion(questionData.id, 'upvote');
        setIsUpVote(true);
        dispatch(
          upVote({
            votedBy: recentId,
            type: 'upvote',
          })
        );
      } else {
        questionApi.deleteVoteQuestion(questionData.id);
        setIsUpVote(false);
        dispatch(deleteUpVote(recentId));
      }
      setIsDownVote(false);
    } else {
      dispatch(
        updateToastInfo({
          type: ToastType.ERROR,
          title: ToastType.ERROR,
          description: 'You must login first to vote',
        })
      );
      dispatch(setShow(true));
    }
  };

  const handleDownVote = async () => {
    if (auth.currentUser) {
      if (!isDownVote) {
        if (isUpVote) {
          questionApi.deleteVoteQuestion(questionData.id);
          dispatch(deleteUpVote(recentId));
        }
        questionApi.voteQuestion(questionData.id, 'downvote');
        setIsDownVote(true);
        dispatch(
          downVote({
            votedBy: recentId,
            type: 'downvote',
          })
        );
      } else {
        questionApi.deleteVoteQuestion(questionData.id);
        setIsDownVote(false);
        dispatch(deleteDownVote(recentId));
      }
      setIsUpVote(false);
    } else {
      dispatch(
        updateToastInfo({
          type: ToastType.ERROR,
          title: ToastType.ERROR,
          description: 'You must login first to vote',
        })
      );
      dispatch(setShow(true));
    }
  };

  const handleDelete = async () => {
    try {
      await questionApi.deleteQuestion(questionId);
      dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG14 }));
      dispatch(setShow(true));
      navigate(`/users/${recentId}/questions`);
    } catch (error) {
      // let messageError = error.response.data.errors[0].message;
      // dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: messageError }));
    }
    setShowDelete(false);
  };

  const handleClose = () => {
    setShowDelete(false);
  };

  const checkUpDownVote = () => {
    if (questionData.voteList.length === 0) {
      setIsUpVote(false);
      setIsDownVote(false);
    } else {
      questionData.voteList.map((vote) => {
        if (vote.votedBy === recentId) {
          if (vote.type === 'upvote') {
            setIsUpVote(true);
          }
          if (vote.type === 'downvote') {
            setIsDownVote(true);
          }
        }
      });
    }
  };
  const renderSubjecTags = () => {
    const renderSubjectTag = questionData.subjects.map((subject) => {
      return (
        <Col key={subject.id}>
          <TagComponent name={subject.name} type="subject" />
        </Col>
      );
    });
    return renderSubjectTag;
  };

  const renderTextBookTags = () => {
    const renderTextBookTag = questionData.textbooks.map((textbook) => {
      return (
        <Col key={textbook.id}>
          <TagComponent name={textbook.name} type="textbook" />
        </Col>
      );
    });
    return renderTextBookTag;
  };

  const renderSchoolTags = () => {
    const renderSchoolTag = questionData.schools.map((school) => {
      return (
        <Col key={school.id}>
          <TagComponent name={school.name} type="school" />
        </Col>
      );
    });
    return renderSchoolTag;
  };

  if (Object.keys(questionData).length !== 0) {
    return (
      <Container
        key={questionId}
        className={`pt-3 pb-4 mb-5 shadow-box white-background-color ${styles.container_markdown}`}
      >
        <Row className="">
          <Col xs={2} md={1} className="m-auto text-center p-1">
            <Image
              className="m-auto"
              src={questionData.owner.avaUrl}
              roundedCircle="true"
              width={50}
              height={50}
            ></Image>
          </Col>
          <Col xs={8} md={10} className={`m-auto ${styles.text_style}`}>
            <Row>
              <Col>
                <h5 className="mb-1">{questionData.owner.name}</h5>
              </Col>
            </Row>
            <Row>
              <Col xs={4}>{questionData.createdAt}</Col>
            </Row>
          </Col>
          <Col xs={2} md={1} className="text-end">
            {questionData.owner.id === recentId ? (
              <Row>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="none"
                    className={`${styles.dropdown_toggle} ${styles.btn}`}
                    id="dropdown-menu-align-end"
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end" className={`${styles.no_padding}`}>
                    <Dropdown.Item className={`${styles.dropdown_item}`} onClick={handleClickEditQuestion}>
                      Edit question
                    </Dropdown.Item>
                    <Dropdown.Item className={`${styles.dropdown_item}`} onClick={() => setShowDelete(true)}>
                      Delete question
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Row>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col xs={2} md={1} className="mt-3 text-center">
            <Container className="p-0">
              <Row>
                <button className={`${styles.no_btn}`} onClick={handleUpVote}>
                  <i className={`fas fa-sort-up fa-2x ${isUpVote ? styles.color_button : null}`}></i>
                </button>
              </Row>
              <Row className="text-center">
                <h4>{questionData.numOfUpvotes - questionData.numOfDownvotes}</h4>
              </Row>
              <Row>
                <button className={`${styles.no_btn}`} onClick={handleDownVote}>
                  <i className={`fas fa-sort-down fa-2x ${isDownVote ? styles.color_button : null}`}></i>
                </button>
              </Row>
            </Container>
            <Row className="mt-3 text-center">
              <h4>{questionData.numOfComments}</h4>
            </Row>
            <Row>
              <button className={`${styles.no_btn}`} onClick={() => setIsCommentClick(true)}>
                <i className="far fa-comment-dots fa-2x"></i>
              </button>
            </Row>
          </Col>
          <Col xs={10} md={11} className={`${styles.text_style}`}>
            <Row className="mb-1 mt-3">
              <h5>{questionData.title}</h5>
            </Row>
            <Row className="me-2 d-flex ms-1 my-3">
              <ReactMarkdown children={questionData.content} remarkPlugins={[remarkGfm]} />
            </Row>
            <Row className="me-1">
              <Col>
                <Row xs="auto">
                  {renderSubjecTags()}
                  {renderTextBookTags()}
                  {renderSchoolTags()}
                </Row>
              </Col>
            </Row>
            <Row>
              <CommentBarComponent
                ava={recentAva}
                recentId={recentId}
                replyToQuestion={questionData.id}
                isFocus={isCommentClick}
              />
            </Row>
            {renderComments()}
          </Col>
        </Row>
        <ConfirmDeleteComponent
          content={Messages.MSG22}
          show={showDelete}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      </Container>
    );
  } else {
    {
      return (
        <Container>
          <CircularProgress className="mt-2" />
          {/* {isError ? <ToastComponent type={ToastType.ERROR} title={'ERROR'} description={Messages.MSG28} /> : null} */}
        </Container>
      );
    }
  }
};

export default QuestionDetailCardComponent;
