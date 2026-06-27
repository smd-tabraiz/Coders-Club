import api from '../../api/axios';

export const getAnalytics = () =>
  api.get('/analytics');
