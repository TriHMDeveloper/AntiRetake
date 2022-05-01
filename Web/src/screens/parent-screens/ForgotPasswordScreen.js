import React, { useState } from 'react';
import styles from '../../styles/screen-styles/ForgotPassword.module.css';
import { auth } from '../../config/firebase-config';
import { Link, useNavigate } from 'react-router-dom';
import { AuthAction, ScreenLink } from '../../assets/TypeEnum';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
const ForgotPassword = () => {
  const [errorCode, setErrorCode] = useState('');
  const initialValues = {
    email: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('please enter valid email').required('Required'),
  });
  const navigate = useNavigate();

  const handleForgotPassword = async (values) => {
    const { email } = values;
    const methods = await auth.fetchSignInMethodsForEmail(email);
    const isEmailExist = methods.length > 0;
    if (isEmailExist) {
      navigate(ScreenLink.CHECK_EMAIL + `?mode=${AuthAction.RESET_PASSWORD}`, { state: { email: email } });
    } else {
      setErrorCode('auth/user-not-found');
    }
  };
  const onSubmit = (values, props) => {
    handleForgotPassword(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {(formik) => (
        <div className={`${styles.img}`}>
          <div className="m-auto">
            <div className="offset-sm-2 offset-md-7 col-sm-10 col-md-5 ">
              <div className={`${styles.bodys} m-auto`}>
                <div className={`${styles.containers}`}>
                  <Form id="form" className={`${styles.form}`}>
                    <p className={`${styles.header}`}>Forgot Password</p>
                    <div className={`${styles.form_control}`}>
                      <p className={`${styles.text} `}> Please enter your email address to reset password.</p>
                      {errorCode === 'auth/user-not-found' ? (
                        <p className={`${styles.error} text-start`}>Email does not exist!</p>
                      ) : null}
                      <i className={`fas fa-user icon ${styles.icon}`}></i>
                      <Field className={`${styles.input}`} type="email" placeholder="Enter your email" name="email" />
                      {formik.errors.email ? (
                        <p className={`${styles.error} text-start`}>{formik.errors.email}</p>
                      ) : null}{' '}
                    </div>
                    <div className="text-end ms-3">
                      <button
                        className={`p-2 bd-highlight ${styles.decline_button}`}
                        onClick={() => navigate(ScreenLink.SIGN_IN)}
                      >
                        Cancel
                      </button>
                      <button className={`p-2 bd-highlight ${styles.accept_button}`} type="submit">
                        Send
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
  );
};

export default ForgotPassword;
