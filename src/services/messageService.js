import { api } from './api';

export const messageService = {
  send: (data) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getThread: (userId) => api.get(`/messages/with/${userId}`),
  getUnreadCount: () => api.get('/messages/unread-count'),
};
