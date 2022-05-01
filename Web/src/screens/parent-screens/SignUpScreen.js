import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import styles from '../../styles/screen-styles/SignUp.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { ScreenLink, Default } from '../../assets/TypeEnum';
import { auth } from '../../config/firebase-config';
import { FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { Messages } from '../../assets/Messages';
import profileApi from '../../api/profileApi';
import { useDispatch, useSelector } from 'react-redux';
import { changeLogged, changeVerify } from '../../redux/reducers/AuthSlice';
import { getCurrentUserInfo } from '../../redux/reducers/CurrentUserInfoSlice';
const SignUp = () => {
  const gg = require('../../assets/images/gg.png');
  const fb = require('../../assets/images/fb.png');
  const [errorCode, setErrorCode] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const dispatch = useDispatch();
  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('please enter valid email').required('Required'),
    password: Yup.string()
      .required('Please enter your password')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, Messages.MSG04),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], Messages.MSG02)
      .required('Confirm password is required'),
    // username: Yup.string().email('please enter your username').required('Required'),
    username: Yup.string().min(4, 'Too Short!').max(40, 'Too Long!').required('Please enter your username'),
  });
  const navigate = useNavigate();

  const signUpWithEmailPassword = (data, props) => {
    const { email, password, username } = data;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await user.updateProfile({
          displayName: username,
          photoURL: Default.AVATAR_URL,
        });
        if (user) {
          await profileApi.addUser();
        }
        dispatch(getCurrentUserInfo());
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorCode(error.code);
        seterrorMessage(error.message);
        console.log(`Error: ${errorCode} - ${errorMessage}`);
      });
  };

  const onSubmit = (values, props) => {
    signUpWithEmailPassword(values);
  };

  const loginWithGoogle = () => {
    auth.signInWithPopup(new GoogleAuthProvider()).then(async (userCre) => {
      const { isNewUser } = userCre.additionalUserInfo;
      if (isNewUser) {
        await profileApi.addUser();
      }
      dispatch(getCurrentUserInfo());
      // TODO: Insert user to mongodb if new user
    });
  };

  const loginWithFacebook = () => {
    auth.signInWithPopup(new FacebookAuthProvider()).then(async (userCre) => {
      const isNewUser = userCre.additionalUserInfo.isNewUser;
      const user = userCre.user;
      // user.email
      //   ? user.emailVerified &&
      //     user.sendEmailVerification().then(async () => {
      //       navigate(ScreenLink.CHECK_EMAIL);
      //       if (isNewUser) {
      //         await profileApi.addUser();
      //       }
      //       dispatch(getCurrentUserInfo());
      //       // TODO: Insert user to mongodb after verified
      //     })
      //   : auth.signOut();
      if (user.email) {
        if (!user.emailVerified) {
          if (isNewUser) {
            await profileApi.addUser();
          }
          dispatch(getCurrentUserInfo());
          navigate(ScreenLink.CHECK_EMAIL);
        }
      } else {
        auth.signOut();
      }
      // TODO: Insert user to mongodb if new user
    });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {(formik) => (
        <div className={`${styles.img}`}>
          <div className="m-auto">
            <div className="offset-sm-2 offset-md-7 col-sm-10 col-md-5 ">
              <div className={`${styles.bodys} m-auto`}>
                <div className={`${styles.containers} mt-5`}>
                  <Form id="form" className={`${styles.form}`}>
                    <div className={`${styles.title}`}>
                      <h2 className={`${styles.header}`}>Sign Up</h2>
                      {errorCode !== '' ? (
                        <p className={`${styles.error} text-center`}>Sign up fail. Try again!</p>
                      ) : null}
                    </div>
                    <div className={`${styles.form_control}`}>
                      <i className={`fas fa-user icon ${styles.icon}`}></i>
                      <Field className={`${styles.input}`} type="email" placeholder="Enter your email" name="email" />
                      {formik.touched.email && formik.errors.email ? (
                        <p className={`${styles.error} text-start`}>{formik.errors.email}</p>
                      ) : null}
                    </div>
                    <div className={`${styles.form_control}`}>
                      <i className={`fas fa-lock ${styles.icon}`}></i>
                      <Field
                        className={`${styles.input}`}
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <p className={`${styles.error} text-start`}>{formik.errors.password}</p>
                      ) : null}
                    </div>
                    <div className={`${styles.form_control}`}>
                      <i className={`fas fa-lock ${styles.icon}`}></i>
                      <Field
                        className={`${styles.input}`}
                        type="password"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                      />
                      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <p className={`${styles.error} text-start`}>{formik.errors.confirmPassword}</p>
                      ) : null}
                    </div>
                    <div className={`${styles.form_control}`}>
                      <i className={`fas fa-user icon ${styles.icon}`}></i>
                      <Field
                        className={`${styles.input}`}
                        type="username"
                        placeholder="Enter your username"
                        name="username"
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <p className={`${styles.error} text-start`}>{formik.errors.username}</p>
                      ) : null}
                    </div>
                    <button type="submit" className={` ${styles.signup}`}>
                      Sign up
                    </button>
                    <p className={`${styles.or} `}>OR</p>
                    <hr className="solid " style={{ width: '108%' }} />
                  </Form>

                  <button className={`${styles.gg} ms-4   `} onClick={loginWithGoogle}>
                    {' '}
                    Sign in with <img src={gg} width="25" height="25" className={`${styles.google}`} />{' '}
                  </button>
                  <button className={`${styles.fb} ms-4 mt-4`} onClick={loginWithFacebook}>
                    Sign in with <img src={fb} width="25" height="25" className={`${styles.google}`} />
                  </button>

                  <p className={`${styles.account} mt-auto text-center`}>
                    Already have an Account?{' '}
                    <Link className={`${styles.signin}`} to={ScreenLink.SIGN_IN}>
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default SignUp;
