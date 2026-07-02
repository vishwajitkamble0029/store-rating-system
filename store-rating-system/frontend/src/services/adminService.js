import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  createUser: (payload) => api.post('/admin/users', payload).then((r) => r.data),
  listUsers: (params) => api.get('/admin/users', { params }).then((r) => r.data),
  getUserDetails: (id) => api.get(`/admin/users/${id}`).then((r) => r.data),
  createStore: (payload) => api.post('/admin/stores', payload).then((r) => r.data),
  listStores: (params) => api.get('/admin/stores', { params }).then((r) => r.data),
  listOwners: () => api.get('/admin/owners').then((r) => r.data),
};
