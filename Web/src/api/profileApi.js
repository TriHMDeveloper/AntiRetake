import axiosClient from './axiosClient';
import { auth } from '../config/firebase-config';

const profileApi = {
  getCurrentInfo: async () => {
    const url = '/profile';
    const auths = await auth.currentUser.getIdToken();
    return axiosClient.get(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  getRecentStudySets: async () => {
    const url = '/homepage/recent-sets';
    const auths = await auth.currentUser.getIdToken();
    return axiosClient.get(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  getUserInfoById: async (id) => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },

  editUserInfo: async (data) => {
    const { name, avatarUrl } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = '/profile';
    return axiosClient.put(url, data, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  getStudySetsByUserId: async (data) => {
    const { limit, searchText, sortBy, filter, id } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/users/${id}/sets`;
    return axiosClient.post(url, filter, {
      params: {
        limit: limit,
        searchText: searchText,
        sortBy: sortBy,
      },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  getClassesByUserId: async (data) => {
    const { limit, searchText, sortBy, filter, id } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/users/${id}/classes`;
    return axiosClient.post(url, filter, {
      params: {
        limit: limit,
        searchText: searchText,
        sortBy: sortBy,
      },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  getFolderByUserId: async (data) => {
    const { limit, searchText, id } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `users/${id}/folders`;
    return axiosClient.get(url, {
      params: {
        limit: limit,
        searchText: searchText,
      },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  getQuestionsByUserId: async (data) => {
    const { limit, searchText, sortBy, filter, id } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/users/${id}/questions`;
    return axiosClient.post(url, filter, {
      params: {
        limit: limit,
        searchText: searchText,
        sortBy: sortBy,
      },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  getPersonalFolder: async (data) => {
    const { limit, searchText, classId } = data;
    const auths = await auth.currentUser.getIdToken();

    const url = '/users/folders/personal';
    return axiosClient.get(url, {
      params: {
        limit: limit,
        searchText: searchText,
        classId: classId,
      },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  getPersonalStudySets: async (data) => {
    const { limit, searchText, classId, folderId } = data;
    const auths = await auth.currentUser.getIdToken();

    const url = '/users/sets/personal';
    return axiosClient.get(url, {
      params: {
        limit: limit,
        searchText: searchText,
        classId: classId,
        folderId: folderId,
      },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  addUser: async () => {
    const url = '/auth/add-user';
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

  getNotification: async (limit) => {
    const url = '/profile/notifications';
    const auths = await auth.currentUser.getIdToken();
    return axiosClient.get(url, {
      params: {
        limit: limit,
      },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  readAllNotification: async () => {
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = '/profile/notifications';
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
};
export default profileApi;
