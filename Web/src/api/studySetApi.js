import axiosClient from './axiosClient';
import { auth } from '../config/firebase-config';

const studySetApi = {
  getStudySetInfoById: async (id) => {
    const url = `/sets/${id}/info`;
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
  getFlashcardById: async (data) => {
    const { id, limit } = data;
    const url = `/sets/${id}/flashcards`;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    return axiosClient.get(url, {
      params: {
        limit: limit,
      },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  getRecommendFlashcardById: async (id) => {
    const url = `/sets/${id}/recommendation`;
    return axiosClient.get(url);
  },
  visitStudySet: async (id) => {
    const url = `/sets/${id}/visit`;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    return axiosClient.put(
      url,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },
  rateStudySet: async (data) => {
    const { id, rate } = data;
    const url = `/sets/${id}/rate`;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    return axiosClient.post(
      url,
      {},
      {
        params: {
          rate: rate,
        },
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },
  saveStudySet: async (data) => {
    const { id, folderId, name } = data;
    const url = `/sets/${id}/save`;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    return axiosClient.post(
      url,
      { folderId: folderId, name: name },
      {
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },

  saveFlashcard: async (data) => {
    const { id, studySetId } = data;
    const url = `/sets/flashcards/${id}/save`;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    return axiosClient.post(
      url,
      { studySetId: studySetId },
      {
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },

  createStudyset: async (body) => {
    const url = '/sets/create';
    const auths = await auth.currentUser.getIdToken();
    return axiosClient.post(url, body, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  editStudyset: async ({ studySetId, body }) => {
    const url = `/sets/${studySetId}/edit`;
    const auths = await auth.currentUser.getIdToken();
    return axiosClient.post(url, body, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  deleteStudySet: async (id) => {
    const url = `/sets/${id}`;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
};

export default studySetApi;
