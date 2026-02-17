import api from './api';

export const favoritesService = {
  // Get user's favorites
  getUserFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  // Add a place to favorites
  addFavorite: async (placeId) => {
    const response = await api.post('/favorites', { placeId });
    return response.data;
  },

  // Remove a place from favorites
  removeFavorite: async (placeId) => {
    const response = await api.delete(`/favorites/${placeId}`);
    return response.data;
  }
};
