import { Field, Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Messages } from '../../assets/Messages';
import { ScreenLink, ToastType } from '../../assets/TypeEnum';
import { auth } from '../../config/firebase-config';
import { EmailAuthProvider } from 'firebase/auth';
import styles from '../../styles/screen-styles/ChangePassword.module.css';
import { useDispatch } from 'react-redux';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';

const ChangePasswordScreen = () => {
  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const [errorCode, setErrorCode] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required('Please enter your password')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, Messages.MSG04),
    newPassword: Yup.string()
      .required('Please enter your password')
      .notOneOf([Yup.ref('oldPassword'), null], Messages.MSG05)
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, Messages.MSG04),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], Messages.MSG02)
      .required('Confirm password is required'),
  });

  const handleChangePassword = async (values) => {
    const { oldPassword, newPassword } = values;
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
    currentUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        currentUser.updatePassword(newPassword).then(() => {
          navigate(ScreenLink.HOMEPAGE);
          dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG46 }));
          dispatch(setShow(true));
        });
      })
      .catch((error) => {
        setErrorCode(error.code);
        seterrorMessage(error.message);
        console.log(`Error: ${error.code} - ${error.message}`);
      });
  };

  const onSubmit = (values, props) => {
    handleChangePassword(values);
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        {(formik) => (
          <div className={`${styles.img}`}>
            <div className="m-auto">
              <div className="offset-sm-2 offset-md-7 col-sm-10 col-md-5 ">
                <div className={`${styles.bodys} m-auto`}>
                  <div className={`${styles.containers} `}>
                    <Form id="form" className={`${styles.form} mt-5`}>
                      <div className={`${styles.title}`}>
                        <h3 className={`${styles.header}`}>Change Password</h3>
                        {errorCode !== '' ? (
                          <p className={`${styles.error} text-center`}>Change password fail. Try again!</p>
                        ) : null}
                      </div>
                      <div className={`${styles.form_control}`}>
                        <i className={`fas fa-lock ${styles.icon}`}></i>
                        <Field
                          className={`${styles.text_input}`}
                          type="password"
                          placeholder="Enter your old password"
                          name="oldPassword"
                        />
                        {formik.touched.oldPassword && formik.errors.oldPassword ? (
                          <p className={`${styles.error} text-start`}>{formik.errors.oldPassword}</p>
                        ) : null}
                      </div>
                      <div className={`${styles.form_control}`}>
                        <i className={`fas fa-lock ${styles.icon}`}></i>
                        <Field
                          className={`${styles.text_input}`}
                          type="password"
                          placeholder="Enter your new password"
                          name="newPassword"
                        />
                        {formik.touched.newPassword && formik.errors.newPassword ? (
                          <p className={`${styles.error} text-start`}>{formik.errors.newPassword}</p>
                        ) : null}
                      </div>
                      <div className={`${styles.form_control}`}>
                        <i className={`fas fa-lock ${styles.icon}`}></i>
                        <Field
                          className={`${styles.text_input}`}
                          type="password"
                          placeholder="Confirm your new password"
                          name="confirmPassword"
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                          <p className={`${styles.error} text-start`}>{formik.errors.confirmPassword}</p>
                        ) : null}
                      </div>
                      <div className={`${styles.btn} `}>
                        <button type="submit" className={` ${styles.accept_button}`}>
                          Confirm
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default ChangePasswordScreen;
