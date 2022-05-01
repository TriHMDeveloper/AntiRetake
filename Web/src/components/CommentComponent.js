import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteComment,
  deleteDownVoteComment,
  deleteUpVoteComment,
  downVoteComment,
  upVoteComment,
  getQUestionDetail,
} from '../redux/reducers/QuestionDetailSlice';
import { questionDetailSelector } from '../redux/selectors/QuestionDetailSelector';
import styles from '../styles/component-styles/QuestionCardComponent-style.module.css';
import CommentBarComponent from './CommentBarComponent';
import questionApi from '../api/questionApi';
import { auth } from '../config/firebase-config';
import { updateToastInfo, setShow } from '../redux/reducers/ToastSlice';
import { ToastType } from '../assets/TypeEnum';
import { Messages } from '../assets/Messages';
import ConfirmDeleteComponent from '../components/ConfirmDeleteComponent';

const CommentComponent = ({ dataComment, recentId, recentAva, recentName }) => {
  const {
    id,
    owner,
    content,
    numOfUpvotes,
    numOfDownvotes,
    voteList,
    replyToQuestion,
    replyToComment,
    commentList,
    createdAt,
  } = dataComment;
  const [isOwnerComment, setIsOwnerComment] = useState(owner.id === recentId);
  const [isReplyClick, setIsReplyClick] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const dispatch = useDispatch();
  const commentLists = useSelector(questionDetailSelector);
  var commentContent = content;

  const [showDelete, setShowDelete] = useState(false);

  const handleClose = () => {
    setShowDelete(false);
  };

  const delComment = async () => {
    try {
      await questionApi.deleteComment(id);
      dispatch(
        updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: 'Delete comment success!!' })
      );
      dispatch(
        deleteComment({
          replyToComment: replyToComment,
          deleteId: id,
        })
      );
      dispatch(setShow(true));
    } catch (error) {
      // let messageError = error.response.data.errors[0].message;
      // dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: messageError }));
    }
    setShowDelete(false);
    // dispatch(getQUestionDetail(replyToQuestion));
  };

  const getComment = () => {
    commentLists.commentList.forEach((comment) => {
      if (comment.id === id) {
        commentContent = comment.content;
      } else {
        comment.commentList.forEach((childElement) => {
          if (childElement.id === id) {
            commentContent = childElement.content;
          }
        });
      }
    });
  };

  const [isUpVote, setIsUpVote] = useState(false);
  const [isDownVote, setIsDownVote] = useState(false);

  useEffect(() => {
    getComment();
    checkUpDownVote();
  }, [isEdit]);

  const handleUpVote = () => {
    if (auth.currentUser) {
      if (!isUpVote) {
        if (isDownVote) {
          questionApi.deleteVoteComment(replyToQuestion, id);
          dispatch(
            deleteDownVoteComment({
              commentId: id,
              userId: recentId,
            })
          );
        }
        questionApi.voteComment(replyToQuestion, id, 'upvote');
        setIsUpVote(true);
        dispatch(
          upVoteComment({
            commentId: id,
            vote: {
              votedBy: recentId,
              type: 'upvote',
            },
          })
        );
      } else {
        questionApi.deleteVoteComment(replyToQuestion, id);
        setIsUpVote(false);
        dispatch(
          deleteUpVoteComment({
            commentId: id,
            userId: recentId,
          })
        );
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

  const handleDownVote = () => {
    if (auth.currentUser) {
      if (!isDownVote) {
        if (isUpVote) {
          questionApi.deleteVoteComment(replyToQuestion, id);
          dispatch(
            deleteUpVoteComment({
              commentId: id,
              userId: recentId,
            })
          );
        }
        questionApi.voteComment(replyToQuestion, id, 'downvote');
        setIsDownVote(true);
        dispatch(
          downVoteComment({
            commentId: id,
            vote: {
              votedBy: recentId,
              type: 'downvote',
            },
          })
        );
      } else {
        questionApi.deleteVoteComment(replyToQuestion, id);
        setIsDownVote(false);
        dispatch(
          deleteDownVoteComment({
            commentId: id,
            userId: recentId,
          })
        );
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

  const checkUpDownVote = () => {
    voteList.map((vote) => {
      if (vote.votedBy === recentId) {
        if (vote.type === 'upvote') {
          setIsUpVote(true);
        } else {
          setIsDownVote(true);
        }
      }
    });
  };

  const rendercommennt = () => {
    return (
      <Container className="ms-1">
        <ConfirmDeleteComponent
          content={'Are you sure delete this comment?'}
          show={showDelete}
          handleClose={handleClose}
          handleDelete={delComment}
        />
        <hr></hr>
        <Row className="me-1">
          <Col xs={2} md={1} className="m-auto d-flex text-center p-0">
            <Image className="m-auto" src={owner.avaUrl} roundedCircle="true" width={35} height={35}></Image>
          </Col>
          <Col xs={8} md={10} className={`mx-auto ${styles.text_style}`}>
            <Row>
              <Col>
                <h6 className="mb-0 mt-1">{owner.name}</h6>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4}>
                <span className={`${styles.text_size_small}`}>{createdAt}</span>
              </Col>
            </Row>
          </Col>
          <Col xs={2} md={1} className="text-end">
            {isOwnerComment ? (
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
                    <Dropdown.Item className={`${styles.dropdown_item}`} onClick={() => setIsEdit(true)} href="">
                      Edit comment
                    </Dropdown.Item>
                    <Dropdown.Item className={`${styles.dropdown_item}`} onClick={() => setShowDelete(true)} href="">
                      Delete comment
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Row>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col xs={2} md={1} className="ms-0">
            <Row>
              <button className={`${styles.no_btn}`} onClick={handleUpVote}>
                <i className={`fas fa-sort-up fa-1x ${isUpVote ? styles.color_button : null}`}></i>
              </button>
            </Row>
            <Row className="text-center">
              <h6 className="m-auto">{numOfUpvotes - numOfDownvotes}</h6>
            </Row>
            <Row>
              <button className={`${styles.no_btn}`} onClick={handleDownVote}>
                <i className={`fas fa-sort-down fa-1x ${isDownVote ? styles.color_button : null}`}></i>
              </button>
            </Row>
            <Row className="mt-1">
              <button
                className={`${styles.no_btn} px-0`}
                onClick={() => {
                  setIsReplyClick(true);
                  setIsReply(!isReply);
                }}
              >
                <i className="fas fa-reply"></i>
              </button>
            </Row>
          </Col>
          <Col xs={10} md={11}>
            <p className="paragraphs">{commentContent}</p>
          </Col>
        </Row>
        {isReplyClick ? (
          <Row className="ps-3 ms-1">
            <CommentBarComponent
              id={id}
              isAdd={true}
              ava={recentAva}
              recentName={recentName}
              recentId={recentId}
              check={isReply}
              isOfComment={true}
              replyToComment={replyToComment}
              replyToQuestion={replyToQuestion}
              setIsEdit={setIsEdit}
              setIsReplyClick={setIsReplyClick}
            />
          </Row>
        ) : null}
      </Container>
    );
  };

  return isEdit ? (
    <Row>
      <CommentBarComponent
        id={id}
        ava={recentAva}
        recentName={recentName}
        recentId={recentId}
        check={isReply}
        isOfComment={true}
        text={content}
        setIsEdit={setIsEdit}
      />
      <button
        onClick={() => setIsEdit(false)}
        className={` text-left ms-4 ps-4 mt-2 ${styles.link_gray_style} ${styles.no_btn2}`}
      >
        Cancel
      </button>
    </Row>
  ) : (
    rendercommennt()
  );
};

export default CommentComponent;
