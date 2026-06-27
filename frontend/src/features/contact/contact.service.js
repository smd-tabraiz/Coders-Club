import api from '../../api/axios';

export const sendContactMessage = (data) =>
  api.post('/contact', data);
