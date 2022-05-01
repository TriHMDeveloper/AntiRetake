import axiosClient from './axiosClient';
import { auth } from '../config/firebase-config';

const FolderApi = {
  getFolderInfo: async (id) => {
    const url = `/folders/${id}/info`;
    return axiosClient.get(url);
  },

  getStudySetsByFolderId: async (data) => {
    const { limit, searchText, sortBy, filter, id } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/folders/${id}/sets`;
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

  createFolder: async (body) => {
    const auths = await auth.currentUser.getIdToken();
    const url = '/folders';
    return axiosClient.post(url, body, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  editFolder: async ({ folderId, body }) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/folders/${folderId}`;

    return axiosClient.put(url, body, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  removeStudySet: async (data) => {
    const { folderId, studySetId } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/folders/${folderId}/sets/${studySetId}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  deleteFolder: async (id) => {
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/folders/${id}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  saveStudySetToFolder: async (data) => {
    const { folderId, studySetId } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/folders/${folderId}/add-study-set-to-folder`;
    return axiosClient.post(
      url,
      {},
      {
        params: {
          studySetId: studySetId,
        },
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },
};
export default FolderApi;
