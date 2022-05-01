import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToastComponent from './components/ToastComponent';
import { auth } from './config/firebase-config';
import { changeLogged, changeVerify } from './redux/reducers/AuthSlice';
import { getCurrentUserInfo } from './redux/reducers/CurrentUserInfoSlice';
import { isLoggedSelector, isVerifySelector } from './redux/selectors/AuthSelector';
import AuthRouters from './routes/AuthRouters';
import NoneAuthRouters from './routes/NoneAuthRouters';

function App() {
  const [isLoading, setIsloading] = useState(true);
  const isLogged = useSelector(isLoggedSelector);
  const isVerify = useSelector(isVerifySelector);
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: Check userCredential & emailVerified for route
    // auth.currentUser.emailVerified
    const unsubscribe = auth.onAuthStateChanged((userCredential) => {
      if (userCredential) {
        dispatch(changeLogged(!!userCredential));
        dispatch(getCurrentUserInfo());
        if (userCredential?.emailVerified) {
          dispatch(changeVerify(userCredential.emailVerified));
        }
        setIsloading(false);
      } else {
        dispatch(changeLogged(!!userCredential));
        if (userCredential?.emailVerified) {
          dispatch(changeVerify(userCredential.emailVerified));
        }
        setIsloading(false);
      }
      return () => unsubscribe();
    });
  }, []);

  return (
    <div className="App">
      {isLoading ? <div></div> : isLogged ? <AuthRouters /> : <NoneAuthRouters />}
      <ToastComponent />
    </div>
  );
}

export default App;
