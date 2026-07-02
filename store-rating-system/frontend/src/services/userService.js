import api from './api';

export const userService = {
  listStores: (params) => api.get('/user/stores', { params }).then((r) => r.data),
  submitRating: (payload) => api.post('/user/ratings', payload).then((r) => r.data),
  updateRating: (id, payload) => api.put(`/user/ratings/${id}`, payload).then((r) => r.data),
};
