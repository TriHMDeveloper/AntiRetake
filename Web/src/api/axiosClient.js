import axios from 'axios';
import queryString from 'query-string';
import { Messages } from '../assets/Messages';
import { ToastType } from '../assets/TypeEnum';
import { setShow, updateToastInfo } from '../redux/reducers/ToastSlice';

const axiosClient = axios.create({
  baseURL: 'https://antiretake.xyz/api',
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

// axiosClient.interceptors.request.use(async (config) => {
//     return config
// })

let store;

export const injectStore = (_store) => {
  store = _store;
};

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (err) => {
    if (err.response) {
      store.dispatch(
        updateToastInfo({
          type: ToastType.ERROR,
          title: ToastType.ERROR,
          description: err.response.data.errors[0].message,
        })
      );
      store.dispatch(setShow(true));
    } else {
      store.dispatch(updateToastInfo({ type: ToastType.ERROR, title: ToastType.ERROR, description: Messages.MSG28 }));
      store.dispatch(setShow(true));
    }

    throw err;
  }
);

export default axiosClient;
