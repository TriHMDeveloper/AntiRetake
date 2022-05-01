import React, { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthAction, ScreenLink, ToastType } from '../../assets/TypeEnum';
import { auth } from '../../config/firebase-config';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setShow, updateToastInfo } from '../../redux/reducers/ToastSlice';
import { Messages } from '../../assets/Messages';

const BufferScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerifyEmail = async (actionCode) => {
    await auth
      .applyActionCode(actionCode)
      .then((response) => {
        // TODO: add user to mongodb
        location.href = ScreenLink.HOMEPAGE;
        // window.location.reload(false);
      })
      .catch((error) => {
        dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG54 }));
        dispatch(setShow(true));
        navigate(ScreenLink.CHECK_EMAIL);
      });
  };

  const handleResetPassword = (actionCode) => {
    navigate(`${ScreenLink.RESET_PASSWORD}?oobCode=${actionCode}`);
  };

  useEffect(() => {
    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');
    if (mode) {
      switch (mode) {
        case AuthAction.VERIFY_EMAIL:
          handleVerifyEmail(actionCode);
          break;
        case AuthAction.RESET_PASSWORD:
          handleResetPassword(actionCode);
          break;
      }
    }
  }, []);
  return <CircularProgress className="position-absolute bottom-50 end-50" />;
};
export default BufferScreen;
