import { Field, Form, Formik } from 'formik';
import { React, useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { getFolderByID, postFolder, putFolder, resetCreateFolderState } from '../../redux/reducers/CreateFolderSlice';
import { createFolderSelector, isErrorCreateFolderSelector } from '../../redux/selectors/Selectors';
import styles from '../../styles/screen-styles/CreateFolder.module.css';
import { useNavigate } from 'react-router-dom';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import { ToastType } from '../../assets/TypeEnum';
import { Messages } from '../../assets/Messages';
import { CircularProgress } from '@mui/material';

const CreateFolderScreen = () => {
  const folderInfo = useSelector(createFolderSelector);
  const isError = useSelector(isErrorCreateFolderSelector);
  let { name = '', description = '' } = folderInfo;
  const dispatch = useDispatch();
  const { folderId } = useParams();

  const title = folderId === undefined ? 'Create Folder' : 'Edit Folder';
  const submitButton = folderId === undefined ? 'Create' : 'Done';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (folderId !== undefined) {
      dispatch(getFolderByID(folderId));
    } else {
      dispatch(resetCreateFolderState());
    }
  }, [location.key]);

  const validateSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  });

  if (!folderId || Object.keys(folderInfo).length !== 0) {
    return (
      <div className={'ms-5 mt-5'}>
        <p className="text-start giant-font bold-black-text-color">{title}</p>
        <Formik
          enableReinitialize
          initialValues={{
            name: name,
            description: description,
          }}
          validationSchema={validateSchema}
          onSubmit={async (values) => {
            let response;
            const body = {
              name: values.name,
              description: values.description,
            };

            if (folderId !== undefined) {
              response = await dispatch(putFolder({ folderId, body }))
                .unwrap()
                .then((originalPromiseResult) => {
                  dispatch(
                    updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG17 })
                  );
                  dispatch(setShow(true));
                  navigate(`/folders/${folderId}`);
                });
              dispatch(setShow(true));
            } else {
              response = await dispatch(postFolder(body))
                .unwrap()
                .then((originalPromiseResult) => {
                  dispatch(
                    updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG09 })
                  );
                  dispatch(setShow(true));
                  const newFolderId = originalPromiseResult.id;
                  navigate(`/folders/${newFolderId}`);
                });

              dispatch(setShow(true));
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <p className={`text-start huge-font mb-0 ${styles.bold_text}`}>
                Folder Name <label className={styles.required_text}>*</label>
              </p>
              <Field
                name="name"
                placeholder="Enter folder name"
                className={`under-line-input background-color justify-self-start d-flex big-font w-75 ${styles.no_border}`}
              />
              {touched.name && errors.name && (
                <div className={`justify-self-start d-flex ${styles.required_text}`}>{errors.name}</div>
              )}

              <p className={`text-start huge-font mt-4 mb-0 ${styles.bold_text}`}>Description</p>
              <Field
                name="description"
                placeholder="Enter description"
                className={`under-line-input background-color justify-self-start d-flex big-font w-75 ${styles.no_border}`}
              />

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
          <h1 className="blur-text-color mt-5">Loading info folder fail...</h1>
        ) : (
          <CircularProgress className=" mt-5" />
        )}
      </Container>
    );
  }
};

export default CreateFolderScreen;
