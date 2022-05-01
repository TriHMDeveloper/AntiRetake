import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Messages } from '../../assets/Messages';
import { ToastType } from '../../assets/TypeEnum';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthAction, ScreenLink } from '../../assets/TypeEnum';
import { auth } from '../../config/firebase-config';
import { updateToastInfo, setShow } from '../../redux/reducers/ToastSlice';
import styles from '../../styles/screen-styles/CheckEmail.module.css';

const CheckEmail = () => {
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const location = useLocation();

  useEffect(() => {
    if (mode) {
      auth
        .sendPasswordResetEmail(location.state.email)
        .then(() => {
          dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG47 }));
          dispatch(setShow(true));
        })
        .catch((e) => {
          dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG48 }));
          dispatch(setShow(true));
        });
    } else {
      auth.currentUser
        .sendEmailVerification()
        .then(() => {
          dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG32 }));
          dispatch(setShow(true));
        })
        .catch((e) => {
          dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG49 }));
          dispatch(setShow(true));
        });
    }
  }, []);

  useEffect(() => {
    if (seconds !== 0) {
      const delaySendVerify = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return function cleanUp() {
        clearTimeout(delaySendVerify);
      };
    }
  }, [seconds]);

  const handleSendVerify = () => {
    if (mode) {
      setSeconds(10);
      auth
        .sendPasswordResetEmail(location.state.email)
        .then(() => {
          dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG47 }));
          dispatch(setShow(true));
        })
        .catch((e) => {
          dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG48 }));
          dispatch(setShow(true));
        });
    } else {
      setSeconds(10);
      auth.currentUser
        .sendEmailVerification()
        .then(() => {
          dispatch(updateToastInfo({ type: ToastType.SUCCESS, title: ToastType.SUCCESS, description: Messages.MSG32 }));
          dispatch(setShow(true));
        })
        .catch((e) => {
          dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG49 }));
          dispatch(setShow(true));
        });
    }
  };

  return (
    <div className={`${styles.img}`}>
      <div className="m-auto">
        <div className="offset-sm-2 offset-md-7 col-sm-10 col-md-5 ">
          <div className={`${styles.bodys} m-auto`}>
            <div className={`${styles.containers}`}>
              <form id="form" className={`${styles.form}`}>
                <p className={`${styles.header}`}>Check your Email</p>
                <div className={`${styles.form_control}`}>
                  <p className={`${styles.text} `}>
                    {' '}
                    We have sent a link to your email address.Please check your email and click the link to continue.
                  </p>
                </div>
                <Button
                  className="accept-button white-text-color rounded"
                  onClick={handleSendVerify}
                  disabled={seconds !== 0}
                >
                  {seconds === 0 ? 'Send Again' : 'wait ' + seconds + ' seconds to send again'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
