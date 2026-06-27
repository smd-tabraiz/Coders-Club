import api from '../../api/axios';

export const getTeams = () =>
  api.get('/teams');

export const getTeamBatch = (batch) =>
  api.get(`/teams/${batch}`);
