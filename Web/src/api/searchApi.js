import axiosClient from './axiosClient';

const searchApi = {
  searchQuestion: async (data) => {
    const { page, limit, searchText, sortBy, filter } = data;
    const url = '/search/questions';
    return axiosClient.post(url, filter, {
      params: {
        page: page,
        limit: limit,
        searchText: searchText,
        sortBy: sortBy,
      },
    });
  },
  searchStudySet: async (data) => {
    const { page, limit, searchText, sortBy, filter } = data;
    const url = '/search/sets';
    return axiosClient.post(url, filter, {
      params: {
        page: page,
        limit: limit,
        searchText: searchText,
        sortBy: sortBy,
      },
    });
  },
  searchClass: async (data) => {
    const { page, limit, searchText, sortBy, filter } = data;
    const url = '/search/classes';
    return axiosClient.post(url, filter, {
      params: {
        page: page,
        limit: limit,
        searchText: searchText,
        sortBy: sortBy,
      },
    });
  },
  searchUser: async (data) => {
    const { page, limit, searchText } = data;
    const url = '/search/users';
    return axiosClient.get(url, {
      params: {
        page: page,
        limit: limit,
        searchText: searchText,
      },
    });
  },
};

export default searchApi;
