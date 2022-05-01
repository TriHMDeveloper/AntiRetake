import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { addCommentLevel1, addCommentLevel2, editComment } from '../redux/reducers/QuestionDetailSlice';
import styles from '../styles/component-styles/QuestionCardComponent-style.module.css';
import questionApi from '../api/questionApi';
import { auth } from '../config/firebase-config';
import { updateToastInfo, setShow } from '../redux/reducers/ToastSlice';
import { ToastType } from '../assets/TypeEnum';

const CommentBarComponent = ({
  id,
  isAdd,
  ava,
  recentName,
  recentId,
  check,
  isOfComment,
  text,
  setIsEdit,
  replyToComment,
  replyToQuestion,
  setIsReplyClick,
}) => {
  const commentInput = useRef(null);
  const avaDefault =
    'https://firebasestorage.googleapis.com/v0/b/anti-retake-user-mcs.appspot.com/o/avatar%2Favt_default.png?alt=media&token=a8e82f42-2769-419a-8eb2-3f3fd8b097bf';
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    content: text,
  });

  const handleInputChange = (event) => {
    setValues((values) => ({
      ...values,
      content: event.target.value,
    }));
  };

  useEffect(() => {
    if (isOfComment) {
      commentInput.current.focus();
    }
  }, [check]);

  const sendComment = async () => {
    if (auth.currentUser) {
      if (id === undefined) {
        const newCommentLv1 = await questionApi.addComment(replyToQuestion, {
          replyToComment: '',
          content: values.content,
        });
        dispatch(addCommentLevel1(newCommentLv1));
      } else {
        if (isAdd) {
          let newCommentLv2;
          if (replyToComment) {
            newCommentLv2 = await questionApi.addComment(replyToQuestion, {
              replyToComment: replyToComment,
              content: values.content,
            });
          } else {
            newCommentLv2 = await questionApi.addComment(replyToQuestion, {
              replyToComment: id,
              content: values.content,
            });
          }

          dispatch(
            addCommentLevel2({
              commentId: id,
              replyToComment: replyToComment,
              newComment: newCommentLv2,
            })
          );
          setIsReplyClick(false);
        } else {
          await questionApi.editComment(id, {
            content: values.content,
          });
          dispatch(
            editComment({
              commentId: id,
              content: values.content,
            })
          );
          setIsEdit(false);
        }
      }
      // setIsReplyClick(false);
    } else {
      dispatch(
        updateToastInfo({
          type: ToastType.ERROR,
          title: ToastType.ERROR,
          description: 'You must login first to add comment',
        })
      );
      dispatch(setShow(true));
    }

    setValues((values) => ({
      ...values,
      content: '',
    }));
  };

  return (
    <Row className="me-0 pe-0">
      <Row>
        <hr className={`mt-3 ${styles.custom_hr}`}></hr>
      </Row>
      <Row className="pe-0 me-0">
        <Col xs={11} md={11} className="text-style d-flex p-0 ">
          <Image
            className="mx-auto me-3"
            src={auth.currentUser ? ava : avaDefault}
            roundedCircle="true"
            width={35}
            height={35}
          ></Image>
          <TextareaAutosize
            className={`${styles.my_textarea} w-100 `}
            type="text"
            as="textarea"
            rows={1}
            placeholder="Enter comment"
            ref={commentInput}
            value={values.content}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={1} md={1} className="text-center p-0 m-auto">
          <button className={`${styles.no_btn} ${styles.color_button} pe-0 ps-2 ms-1`} onClick={sendComment}>
            <i className={'fas fa-paper-plane'}></i>
          </button>
        </Col>
      </Row>
    </Row>
  );
};

export default CommentBarComponent;
