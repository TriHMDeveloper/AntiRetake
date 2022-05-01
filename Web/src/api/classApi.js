import axiosClient from './axiosClient';
import { auth } from '../config/firebase-config';

const classApi = {
  getClassInfoUser: async (id) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${id}/info`;
    return axiosClient.get(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  getClassInfoGuest: async (id) => {
    const auths = 'guest';
    const url = `/classes/${id}/info/guest`;
    return axiosClient.get(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  getUserToInvite: async ({ classId, searchText }) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}/user-to-invite`;
    return axiosClient.get(url, {
      params: { searchText: searchText },
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  inviteMember: async ({ classId, memberList }) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}/members/invite`;
    return axiosClient.post(
      url,
      { memberList: memberList },
      {
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },

  sendJoinRequest: async (classId, body) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}/requests`;
    return axiosClient.post(url, body, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  acceptInvitation: async (classId) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}/accept`;
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

  createClass: async (body) => {
    const auths = await auth.currentUser.getIdToken();
    const url = '/classes';
    return axiosClient.post(url, body, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  editClass: async ({ classId, body }) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}`;
    return axiosClient.put(url, body, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  deleteClass: async (classId) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  getStudySetsByClassId: async (data) => {
    const { limit, searchText, sortBy, filter, id } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/classes/${id}/sets`;
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

  addFolderToClass: async ({ classId, folderId }) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}/folders/add`;
    return axiosClient.post(
      url,
      {},
      {
        params: { folderId: folderId },
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },

  addStudysetToClass: async ({ classId, studySetId }) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}/add-study-set-to-class`;
    return axiosClient.post(
      url,
      {},
      {
        params: { studySetId: studySetId },
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },

  getFolderByClassId: async (data) => {
    const { limit, searchText, id } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `classes/${id}/folders`;
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

  removeStudySet: async (data) => {
    const { classId, studySetId } = data;
    const url = `/classes/${classId}/sets/${studySetId}`;
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

  getClassMember: async (classId) => {
    const url = `/classes/${classId}/members`;
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

  removeFolder: async (data) => {
    const { classId, folderId } = data;
    const url = `/classes/${classId}/folders/${folderId}`;
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

  deleteMember: async (classId, memberId) => {
    const url = `/classes/${classId}/members/${memberId}`;
    const auths = await auth.currentUser.getIdToken();
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  getJoinRequest: async (id) => {
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/classes/${id}/join-request`;
    return axiosClient.get(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  responseJoinRequest: async (data) => {
    const { id, userId, type } = data;
    let auths = 'guest';
    if (auth.currentUser) {
      auths = await auth.currentUser.getIdToken();
    }
    const url = `/classes/${id}/join-request`;
    return axiosClient.post(
      url,
      {},
      {
        params: {
          userId: userId,
          type: type,
        },
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },

  editMemberRole: async (data) => {
    const { classId, memberId, role } = data;
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}/members/${memberId}`;
    return axiosClient.put(
      url,
      {},
      {
        params: {
          role: role,
        },
        headers: {
          Authorization: 'Bearer ' + auths,
        },
      }
    );
  },

  leaveCLass: async (classId) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/classes/${classId}/leave-class`;
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

export default classApi;
