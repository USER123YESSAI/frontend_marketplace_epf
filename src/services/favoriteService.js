import { api } from './api';

export const favoriteService = {
  getAll: (params) => api.get('/favorites', { params }),
  add: (productId) => api.post('/favorites/add', { product_id: productId }),
  remove: (productId) => api.delete(`/favorites/${productId}`),
};
