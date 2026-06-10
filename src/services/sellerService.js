import { api } from './api';

export const sellerService = {
  getOrders: (params) => api.get('/seller/orders', { params }),
  getDashboard: () => api.get('/seller/dashboard'),
  getStatistics: () => api.get('/seller/statistics'),
  getProfile: (userId) => api.get(`/sellers/${userId}`),
  getProducts: (userId, params) => api.get(`/sellers/${userId}/products`, { params }),
  getReviews: (userId, params) => api.get(`/sellers/${userId}/reviews`, { params }),
};
