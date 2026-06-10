import { api } from './api';

export const cartService = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) =>
    api.post('/cart/add', { product_id: productId, quantity }),
  updateItem: (cartItemId, quantity) =>
    api.put(`/cart/items/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/items/${cartItemId}`),
  clear: () => api.delete('/cart/clear'),
};
