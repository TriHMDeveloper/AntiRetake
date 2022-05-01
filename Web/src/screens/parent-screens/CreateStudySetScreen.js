import { CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Field, Form, Formik } from 'formik';
import { React, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Messages } from '../../assets/Messages';
import { ToastType } from '../../assets/TypeEnum';
import FlashcardContainerComponent from '../../components/FlashcardContainerComponent';
import {
  createStudyset,
  editStudyset,
  getStudySetInfoByID,
  getSubjects,
  getTextbooks,
  resetCreateFlashcardState,
  newFlashCardContainer,
} from '../../redux/reducers/CreateFlashcardSlice';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';
import {
  flashcardContainerSelector,
  isErrorStudySetInfoSelector,
  isSubjectsLoadingSelector,
  isTextbooksLoadingSelector,
  studySetInfoSelector,
  subjectsSelector,
  textbooksSelector,
} from '../../redux/selectors/Selectors';
import styles from '../../styles/screen-styles/CreateStudySet.module.css';

const CreateStudySetScreen = () => {
  let { studySetId } = useParams();
  const title = studySetId === undefined ? 'Create Study Set' : 'Edit Study Set';
  const submitButton = studySetId === undefined ? 'Create' : 'Done';

  const studySetInfo = useSelector(studySetInfoSelector);
  const flashcards = useSelector(flashcardContainerSelector);
  const isError = useSelector(isErrorStudySetInfoSelector);

  const subjects = useSelector(subjectsSelector);
  const isSubjectsLoading = useSelector(isSubjectsLoadingSelector);

  const textbooks = useSelector(textbooksSelector);
  const isTextbooksLoading = useSelector(isTextbooksLoadingSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { name = '', textbook, subject, description = '', accessModifier = 'private' } = studySetInfo;

  const [studysetName, setStudysetName] = useState(name);
  const [descriptionInput, setDescriptionInput] = useState(description);
  const [accessModifierSelect, setAccessModifierSelect] = useState(accessModifier);

  const [selectedSubject, setSelectedSubject] = useState({ id: '', name: '' });
  const [searchSubject, setSearchSubject] = useState('');

  const handleInputSubject = (event, value) => {
    setSearchSubject(value);
    setSelectedSubject({ id: '', name: value });
  };

  const handleChangeSubject = (event, value) => {
    setSelectedSubject(value ? value : { id: '', name: '' });
  };

  useEffect(() => {
    if (!isSubjectsLoading) {
      const delaySearch = setTimeout(() => {
        dispatch(getSubjects(searchSubject));
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [searchSubject]);

  const [selectedTextbook, setSelectedTextbook] = useState({ id: '', name: '' });
  const [searchTextbook, setSearchTextbook] = useState('');

  const handleInputTextbook = (event, value) => {
    setSearchTextbook(value);
    setSelectedTextbook({ id: '', name: value });
  };

  const handleChangeTextbook = (event, value) => {
    setSelectedTextbook(value ? value : { id: '', name: '' });
  };

  useEffect(() => {
    if (!isTextbooksLoading) {
      const delaySearch = setTimeout(() => {
        dispatch(getTextbooks(searchTextbook));
      }, 500);
      return () => clearTimeout(delaySearch);
    }
  }, [searchTextbook]);

  useEffect(() => {
    dispatch(getTextbooks(searchTextbook));
    dispatch(getSubjects(searchSubject));

    if (studySetId !== undefined) {
      dispatch(getStudySetInfoByID(studySetId));
    } else {
      dispatch(resetCreateFlashcardState());
      dispatch(newFlashCardContainer());
      setStudysetName('');
      setDescriptionInput('');
      setSelectedSubject({ id: '', name: '' });
      setSelectedTextbook({ id: '', name: '' });
    }
  }, [title]);

  // useEffect(() => {
  //   dispatch(resetCreateFlashcardState());
  //   dispatch(newFlashCardContainer());
  //   setStudysetName('');
  //   setDescriptionInput('');
  //   setSelectedSubject({ id: '', name: '' });
  //   setSelectedTextbook({ id: '', name: '' });
  // }, [title === 'Create Study Set']);

  useEffect(() => {
    if (Object.keys(studySetInfo).length !== 0) {
      setStudysetName(name);
      setDescriptionInput(description);

      setAccessModifierSelect(accessModifier);
      setSelectedSubject(subject);
      setSelectedTextbook(textbook);
    }
  }, [studySetInfo]);

  const validateSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    flashcards: Yup.array()
      .min(4, 'Study set must have at least 4 flashcards')
      .test(
        'term-define',
        'Term and Definition can not empty in each flashcard',
        (value) => value.filter((item) => !item.term || !item.definition).length === 0
      ),
  });

  if (!studySetId || Object.keys(studySetInfo).length !== 0) {
    return (
      <div className={`${styles.container_90} mx-auto mt-5`}>
        <Formik
          enableReinitialize
          initialValues={{
            name: studysetName,
            subject: selectedSubject,
            textbook: selectedTextbook,
            description: descriptionInput,
            accessModifier: accessModifierSelect,
            flashcards: flashcards,
          }}
          validationSchema={validateSchema}
          onSubmit={async (values) => {
            const body = {
              name: values.name,
              accessModifier: values.accessModifier,
              subject: values.subject.name,
              textbook: values.textbook.name,
              description: values.description,
              flashcardList: values.flashcards.map((item) => {
                return { term: item.term, definition: item.definition };
              }),
            };
            if (studySetId) {
              const response = await dispatch(editStudyset({ studySetId, body }))
                .unwrap()
                .then((originalPromiseResult) => {
                  dispatch(
                    updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG15 })
                  );
                  dispatch(setShow(true));
                  navigate(`/sets/${studySetId}`);
                });
            } else {
              const response = await dispatch(createStudyset(body))
                .unwrap()
                .then((originalPromiseResult) => {
                  studySetId = originalPromiseResult.id;
                  dispatch(
                    updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG07 })
                  );
                  dispatch(setShow(true));
                  navigate(`/sets/${studySetId}`);
                });
            }
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <Row className="m-0">
                <Col className="p-0">
                  <p className="text-start giant-font bold-black-text-color mb-2">{title}</p>
                </Col>

                <Col className="p-0">
                  <Button
                    className="accept-button float-end me-0 ms-3 white-text-color"
                    variant="outline-dark"
                    type="submit"
                  >
                    {submitButton}
                  </Button>
                  {/* TODO: vao mot ngay khong xa */}
                  {/* <Button className="decline-button float-end" variant="outline-dark">
                  Import
                </Button> */}
                  <Field
                    name="accessModifier"
                    as="select"
                    onChange={(event, value) => setAccessModifierSelect(event.target.value)}
                    className={`rounded float-end ${styles.dropdown_accessModifier}`}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Field>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className={`text-start big-font mb-0 ${styles.bold_text}`}>
                    Study Set Name <label className={styles.required_text}>*</label>
                  </p>
                  <Field
                    name="name"
                    value={studysetName}
                    onChange={(event, value) => {
                      setStudysetName(event.target.value);
                    }}
                    className={`under-line-input mb-2 ps-0 background-color justify-self-start d-flex w-100 ${styles.no_border}`}
                    placeholder="Enter study set name"
                  />
                  {touched.name && errors.name && (
                    <div className={`justify-self-start d-flex ${styles.required_text}`}>{errors.name}</div>
                  )}

                  <p className={`text-start big-font mb-0 ${styles.bold_text}`}>Subject</p>
                  <Autocomplete
                    name="subject"
                    autoHighlight
                    freeSolo
                    size="small"
                    value={selectedSubject}
                    loading={isSubjectsLoading}
                    // isOptionEqualToValue={() => true}
                    onChange={(event, value) => {
                      setFieldValue('subject', value ? value.name : '');
                      handleChangeSubject(event, value);
                    }}
                    onInputChange={(event, value) => {
                      setFieldValue('subject', value ? value : '');
                      handleInputSubject(event, value);
                    }}
                    options={subjects}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Enter subject" size="small" variant="standard" />
                    )}
                  />

                  <p className={`text-start big-font mb-0 ${styles.bold_text}`}>Textbook</p>
                  <Autocomplete
                    name="textbook"
                    autoHighlight
                    freeSolo
                    size="small"
                    value={selectedTextbook}
                    loading={isTextbooksLoading}
                    onChange={handleChangeTextbook}
                    onInputChange={(event, value) => {
                      setFieldValue('textbook', value ? value : '');
                      handleInputTextbook(event, value);
                    }}
                    options={textbooks}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Enter textbook"
                        className={styles.text_field}
                        size="small"
                        variant="standard"
                      />
                    )}
                  />

                  <p className={`text-start big-font mb-0 ${styles.bold_text}`}>Description</p>
                  <Field
                    name="description"
                    value={descriptionInput}
                    onChange={(event, value) => {
                      setDescriptionInput(event.target.value);
                    }}
                    className={`under-line-input mb-2 ps-0 background-color justify-self-start d-flex w-100 ${styles.no_border}`}
                    placeholder="Enter description"
                  />
                </Col>
              </Row>
              <hr className="theme-text-color mt-2" />

              <div className="mb-4">
                {errors.flashcards && (
                  <div className={`justify-self-start d-flex ${styles.required_text}`}>{errors.flashcards}</div>
                )}
                <FlashcardContainerComponent />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  } else {
    return (
      <Container>
        {isError ? (
          <h1 className="blur-text-color mt-5">Loading info study set fail...</h1>
        ) : (
          <CircularProgress className=" mt-5" />
        )}
      </Container>
    );
  }
};

export default CreateStudySetScreen;
