import axiosClient from './axiosClient';

const commonApi = {
  getSchools: async (searchText) => {
    const url = '/common/schools';
    return axiosClient.get(url, { params: { searchText: searchText } });
  },

  getSubjects: async (searchText) => {
    const url = '/common/subjects';
    return axiosClient.get(url, { params: { searchText: searchText } });
  },

  getTextbooks: async (searchText) => {
    const url = '/common/textbooks';
    return axiosClient.get(url, { params: { searchText: searchText } });
  },

  getTags: async (data) => {
    const { tagTypeList, textbook, subject, school, searchText } = data;
    const url = '/common/tags';
    return axiosClient.post(
      url,
      { tagTypeList, textbook, subject, school },
      {
        params: { searchText: searchText },
      }
    );
  },
};

export default commonApi;
