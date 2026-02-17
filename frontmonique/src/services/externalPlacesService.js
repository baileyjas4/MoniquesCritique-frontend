import api from './api';

const externalPlacesService = {
  async searchPlaces(query, location, limit = 20) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (location) params.append('location', location);
    params.append('limit', limit);

    const response = await api.get(`/external/search?${params.toString()}`);
    return response.data;
  },

  async importPlace(externalId) {
    const response = await api.post(`/external/import/${externalId}`);
    return response.data;
  }
};

export default externalPlacesService;
