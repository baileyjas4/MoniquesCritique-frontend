import api from './api';

export const recommendationsService = {
  // Get personalized recommendations for the authenticated user
  getRecommendations: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  }
};
