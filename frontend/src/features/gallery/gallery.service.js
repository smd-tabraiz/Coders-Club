import api from '../../api/axios';

export const getGallery = (params = {}) =>
  api.get('/gallery', { params });

export const uploadPhoto = (formData) =>
  api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletePhoto = (id) =>
  api.delete(`/gallery/${id}`);
