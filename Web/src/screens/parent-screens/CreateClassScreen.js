import { Field, Form, Formik } from 'formik';
import { React, useEffect, useRef, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { getClassByID, postClass, putClass, getSchools, resetState } from '../../redux/reducers/CreateClassSlice';
import {
  classInfoSelector,
  schoolsSelector,
  isSchoolsLoadingSelector,
  isErrorClassSelector,
} from '../../redux/selectors/ClassInfoSelector';
import styles from '../../styles/screen-styles/CreateStudySet.module.css';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import { ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import { CircularProgress } from '@mui/material';

const CreateClassScreen = () => {
  const classInfo = useSelector(classInfoSelector);
  let { name = '', school, description = '', accessModifier = 'private' } = classInfo;
  const schools = useSelector(schoolsSelector);
  const location = useLocation();
  const isSchoolsLoading = useSelector(isSchoolsLoadingSelector);
  const isError = useSelector(isErrorClassSelector);
  let textInput = useRef(null);

  const filterOptions = createFilterOptions({
    stringify: (option) => option.name + option.country,
  });

  const dispatch = useDispatch();
  const { classId } = useParams();

  const title = classId === undefined ? 'Create Class' : 'Edit Class';
  const submitButton = classId === undefined ? 'Create' : 'Done';
  const navigate = useNavigate();

  const handleInput = (event, value) => {
    setSearchText(value);
  };

  const handleChange = (event, value) => {
    setSelectedOptions(value ? value : '');
  };

  const [selectedOptions, setSelectedOptions] = useState({});
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (classId !== undefined) {
      dispatch(getClassByID(classId));
    } else {
      dispatch(resetState());
      setSelectedOptions('');
      textInput.current.value = '';
    }
  }, [location.key]);

  // useEffect(() => {
  //   dispatch(resetState());
  //   setSelectedOptions();
  // }, [location.key]);

  useEffect(() => {
    if (Object.keys(classInfo).length !== 0) {
      setSelectedOptions(school);
    }
  }, [classInfo]);

  useEffect(() => {
    dispatch(getSchools(searchText));
  }, [searchText]);

  const validateSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    school: Yup.string().required('Required'),
  });

  if (!classId || Object.keys(classInfo).length !== 0) {
    return (
      <div className={'ms-5 mt-5'} key={classId}>
        <p className="text-start giant-font bold-black-text-color">{title}</p>
        <Formik
          enableReinitialize
          initialValues={{
            name: name,
            school: school ? school.id : '',
            description: description,
            accessModifier: accessModifier,
          }}
          validationSchema={validateSchema}
          onSubmit={async (values) => {
            const body = {
              name: values.name,
              school: values.school,
              description: values.description,
              accessModifier: values.accessModifier,
            };
            if (classId !== undefined) {
              await dispatch(putClass({ classId, body }));
              dispatch(
                updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG16 })
              );
              dispatch(setShow(true));
              navigate(`/classes/${classId}`);
            } else {
              const response = await dispatch(postClass(body));
              const newClassId = response.payload.getClass.id;
              dispatch(
                updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG08 })
              );
              dispatch(setShow(true));
              navigate(`/classes/${newClassId}`);
            }
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <p className={`text-start huge-font mb-0 ${styles.bold_text}`}>
                Class Name <label className={styles.required_text}>*</label>
              </p>
              <Field
                name="name"
                placeholder="Enter class name"
                className={`under-line-input background-color justify-self-start d-flex big-font w-75 ${styles.no_border}`}
              />
              {touched.name && errors.name && (
                <div className={`justify-self-start d-flex ${styles.required_text}`}>{errors.name}</div>
              )}

              <p className={`text-start huge-font mt-4 mb-0 ${styles.bold_text}`}>
                School <label className={styles.required_text}>*</label>
              </p>

              <Autocomplete
                name="school"
                autoHighlight
                size="small"
                value={selectedOptions}
                className="w-75"
                loading={isSchoolsLoading}
                ref={textInput}
                filterOptions={filterOptions}
                isOptionEqualToValue={() => true}
                onChange={(event, value) => {
                  setFieldValue('school', value ? value.id : '');
                  handleChange(event, value);
                }}
                onInputChange={handleInput}
                options={schools}
                getOptionLabel={(option) => option.name || ''}
                renderOption={(props, option) => {
                  const { name, country } = option;
                  return (
                    <div {...props} className="d-flex justify-content-between">
                      <p className="ms-2">{name}</p>
                      <p className="me-2">{country}</p>
                    </div>
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Enter school name" size="small" variant="standard" />
                )}
              />
              {touched.school && errors.school && (
                <div className={`justify-self-start d-flex ${styles.required_text}`}>{errors.school}</div>
              )}

              <p className={`text-start huge-font mt-4 mb-0 ${styles.bold_text}`}>Description</p>
              <Field
                name="description"
                placeholder="Enter description"
                className={`under-line-input background-color justify-self-start d-flex big-font w-75 ${styles.no_border}`}
              />

              <div className="justify-content-start d-flex mt-4">
                <Field name="accessModifier" as="select" className={`rounded ${styles.dropdown_accessModifier}`}>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </Field>
              </div>

              <div className="justify-content-start d-flex mt-4">
                <Button className="accept-button white-text-color rounded" type="submit">
                  {submitButton}
                </Button>
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
          <h1 className="blur-text-color mt-5">Loading info class fail...</h1>
        ) : (
          <CircularProgress className=" mt-5" />
        )}
      </Container>
    );
  }
};

export default CreateClassScreen;
