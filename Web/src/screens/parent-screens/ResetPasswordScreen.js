import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Messages } from '../../assets/Messages';
import { auth } from '../../config/firebase-config';
import styles from '../../styles/screen-styles/ResetPassword.module.css';
const ResetPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialValues = {
    password: '',
    confirmPassword: '',
  };
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Please enter your password')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, Messages.MSG04),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], Messages.MSG02)
      .required('Confirm password is required'),
  });

  const verifyResetPassword = (values) => {
    const actionCode = searchParams.get('oobCode');
    auth.verifyPasswordResetCode(actionCode).then((email) => {
      const newPassword = values.password;
      auth.confirmPasswordReset(actionCode, newPassword).then((response) => {
        auth.signInWithEmailAndPassword(email, newPassword);
      });
    });
  };

  const onSubmit = (values, props) => {
    verifyResetPassword(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {(formik) => (
        <div className={`${styles.img}`}>
          <div className="m-auto">
            <div className="offset-sm-2 offset-md-7 col-sm-10 col-md-5 ">
              <div className={`${styles.bodys} m-auto`}>
                <div className={`${styles.containers} `}>
                  <Form id="form" className={`${styles.form}`}>
                    <h2 className={`${styles.header}`}>Reset Password</h2>
                    <div className={`${styles.form_control}`}>
                      <i className={`fas fa-lock ${styles.icon}`}></i>
                      <Field
                        className={`${styles.text_input}`}
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                      />
                      {formik.errors.password ? (
                        <p className={`${styles.error} text-start`}>{formik.errors.password}</p>
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
                      {formik.errors.confirmPassword ? (
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
  );
};

export default ResetPassword;
