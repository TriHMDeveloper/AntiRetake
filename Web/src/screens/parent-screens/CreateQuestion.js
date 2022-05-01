import MarkdownIt from 'markdown-it';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useParams, useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { TagType } from '../../assets/TypeEnum';
import FilterComponent from '../../components/FilterComponent';
import styles from '../../styles/component-styles/QuestionCardComponent-style.module.css';
import { storage } from '../../config/firebase-config';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import questionApi from '../../api/questionApi';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import { ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';

const mdParser = new MarkdownIt();

const CreateQuestion = () => {
  let { questionId } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [value, setValue] = useState({});
  const [filter, setFilter] = useState([]);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const getInfoEdit = async () => {
    try {
      setIsError(false);
      const response = await questionApi.getInfoEditQuestion(questionId);
      if (response.tagList.length !== 0) {
        setFilter(response.tagList);
      }
      setValue(response);
    } catch (error) {
      setIsError(true);
      console.log('Fail to fetch: ', error);
    }
  };

  useEffect(() => {
    if (questionId) {
      getInfoEdit();
    }
  }, [questionId]);

  const handleClickDone = async () => {
    if (value.title && value.content && value.title.trim().length !== 0 && value.content.trim().length !== 0) {
      setValid(true);
      let newCreate;
      const tagList = splitCurrentTags(filter);
      try {
        const data = {
          title: value.title,
          content: value.content,
          textbooks: tagList.textbook,
          subjects: tagList.subject,
          schools: tagList.school,
        };
        if (questionId === undefined) {
          try {
            let response = await questionApi.createQuestion(data);
            dispatch(
              updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG10 })
            );
            navigate(`/forum/${response}`);
          } catch (error) {
            let messageError = error.response.data.errors[0].message;
            dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: messageError }));
          }
          dispatch(setShow(true));
        } else {
          try {
            await questionApi.editQuestion(questionId, data);
            dispatch(
              updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG10 })
            );
            navigate(`/forum/${questionId}`);
          } catch (error) {
            let messageError = error.response.data.errors[0].message;
            dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: messageError }));
          }
          dispatch(setShow(true));
        }
      } catch (error) {
        console.log('Fail to fetch: ', error);
      }
    }
    setSubmitted(true);
  };

  const splitCurrentTags = (currentTags) => {
    let subject = [];
    let textbook = [];
    let school = [];
    if (currentTags) {
      currentTags.map((tag) => {
        if (tag.type === TagType.TEXTBOOK) {
          textbook.push(tag.id);
        }
        if (tag.type === TagType.SUBJECT) {
          subject.push(tag.id);
        }
        if (tag.type === TagType.SCHOOL) {
          school.push(tag.id);
        }
      });
    }
    return { subject: subject, textbook: textbook, school: school };
  };

  useEffect(() => {
    setValue((values) => ({
      ...values,
      tags: filter,
    }));
  }, [filter]);

  const handleTitleInput = (event) => {
    setValue((values) => ({
      ...values,
      title: event.target.value,
    }));
  };

  const handleEditorChange = ({ html, text }) => {
    setValue((values) => ({
      ...values,
      content: text,
    }));
  };

  const onImageUpload = (file) => {
    if (!file) {
      return;
    }
    const img = new Promise((resolve) => {
      const storageRef = ref(storage, `contentImage/${file.name + '>'}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
    return img;
  };

  if (!questionId || Object.keys(value).length !== 1) {
    return (
      <Container className="mb-5">
        <Row className="mb-4 mt-5" md="auto" xs="auto">
          <Col>
            <i className={` fas fa-comments fa-3x ${styles.color_button}`}></i>
          </Col>
          <Col className="text-start my-auto ">
            <h2>{questionId === undefined ? 'Create' : 'Edit'} Question</h2>
          </Col>
        </Row>

        <Container className="shadow-box white-background-color pb-5">
          <Col className="ms-5 me-5">
            <Row className="text-start">
              <Col className="mt-4 pt-3 mb-3">
                <label className={styles.text_theme}>Title</label> <label className={styles.error}>*</label>
              </Col>
            </Row>
            <TextareaAutosize
              className={`${styles.my_textarea}`}
              type="text"
              as="textarea"
              rows={1}
              onChange={handleTitleInput}
              value={value.title}
              placeholder="Enter title"
            />
            <br />
            {submitted && (!value.title || value.title.trim().length === 0) ? (
              <p className={` text-start ${styles.error}`}>Title is required</p>
            ) : null}
            <Row>
              <Col className="mt-2" xs={10}>
                <FilterComponent
                  setFilter={setFilter}
                  type={[TagType.TEXTBOOK, TagType.SUBJECT, TagType.SCHOOL]}
                  // currentTags={value.tagList}
                  filter={filter}
                  isForum={true}
                />
              </Col>
            </Row>

            <Row className="text-start">
              <Col className="mt-2 pt-3 mb-3">
                <label className={styles.text_theme}>Body</label> <label className={styles.error}>*</label>
              </Col>
            </Row>

            <MdEditor
              value={value.content}
              style={{ height: '500px', textAlign: 'left' }}
              onImageUpload={onImageUpload}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
            {submitted && (!value.content || value.content.trim().length === 0) ? (
              <p className={` text-start ${styles.error}`}>Body is required</p>
            ) : null}
            <Row>
              <Col className="text-end mt-4">
                <Button className={`${styles.btn_color}`} type="submit" variant="success" onClick={handleClickDone}>
                  {questionId === undefined ? 'Create' : 'Done'}
                </Button>
              </Col>
            </Row>
          </Col>
        </Container>
      </Container>
    );
  } else {
    return (
      <Container>
        {isError ? (
          <h1 className="blur-text-color mt-5">Loading info question fail...</h1>
        ) : (
          <CircularProgress className=" mt-5" />
        )}
      </Container>
    );
  }
};

export default CreateQuestion;
