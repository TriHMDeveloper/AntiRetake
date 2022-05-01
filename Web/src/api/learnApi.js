import axiosClient from './axiosClient';
import { auth } from '../config/firebase-config';

const learnApi = {
  getListLearn: async (id) => {
    const url = `/sets/${id}/learn`;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    return axiosClient.get(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  setIsLearned: async (id, data) => {
    const url = `/sets/${id}/learn`;
    const auths = await auth.currentUser.getIdToken();
    return axiosClient.post(url, data, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  resetLearn: async (id) => {
    const url = `/sets/${id}/learn/reset`;
    const auths = await auth.currentUser.getIdToken();
    return axiosClient.post(
      url,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },
};

export default learnApi;
