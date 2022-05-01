import axiosClient from './axiosClient';

const dataApi = {
  getAll: (params) => {
    const url = '/products';
    return axiosClient.get(url, { params });
  },

  getOne: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  postDemo: (data) => {
    const url = '/products';
    return axiosClient.post(url, data);
  },

  putDemo: (id, data) => {
    const url = `/products/${id}`;
    return axiosClient.put(url, data);
  },

  deleteDemo: (id) => {
    const url = `/products/${id}`;
    return axiosClient.delete(url);
  },

  getAllWithAuth: (params) => {
    const url = '/auth/products';
    return axiosClient.get(url, {
      params,
      headers: {
        Authorization: 'Bearer my-token',
        'My-Custom-Header': 'foobar',
      },
    });
  },
};

export default dataApi;
