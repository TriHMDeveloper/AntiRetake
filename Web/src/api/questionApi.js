import axiosClient from './axiosClient';
import { auth } from '../config/firebase-config';

const questionApi = {
  createQuestion: async (data) => {
    const auths = await auth.currentUser.getIdToken();
    const url = '/forum/questions';
    return axiosClient.post(url, data, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  editQuestion: async (id, data) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/questions/${id}`;
    return axiosClient.put(url, data, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  deleteQuestion: async (id) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/questions/${id}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },

  viewQuestionDetail: async (id) => {
    const url = `/forum/questions/${id}`;
    return axiosClient.get(url);
  },

  voteQuestion: async (questionId, typeVote) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/questions/${questionId}/vote`;
    return axiosClient.post(
      url,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + auths,
        },
        params: {
          type: typeVote,
        },
      }
    );
  },
  deleteVoteQuestion: async (questionId) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/questions/${questionId}/vote`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  voteComment: async (questionId, commentId, typeVote) => {
    const auths = await auth.currentUser.getIdToken();

    const url = `/forum/questions/${questionId}/comments/${commentId}/vote`;
    return axiosClient.post(
      url,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + auths,
        },
        params: {
          type: typeVote,
        },
      }
    );
  },
  deleteVoteComment: async (questionId, commentId) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/questions/${questionId}/comments/${commentId}/vote`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  addComment: async (questionId, data) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/question/${questionId}/comments`;
    return axiosClient.post(url, data, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  editComment: async (commentId, data) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/comments/${commentId}`;
    return axiosClient.put(url, data, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  deleteComment: async (commentId) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/comments/${commentId}`;
    return axiosClient.delete(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
  getInfoEditQuestion: async (id) => {
    const auths = await auth.currentUser.getIdToken();
    const url = `/forum/questions/${id}/edit`;
    return axiosClient.get(url, {
      headers: {
        Authorization: 'Bearer ' + auths,
      },
    });
  },
};

export default questionApi;
