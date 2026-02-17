import api from './api';

const placesService = {
  /**
   * Search for places with filters and sorting
   * @param {Object} params - Search parameters
   * @returns {Promise} - Array of places
   */
  searchPlaces: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('name', params.query);
    if (params.category) queryParams.append('category', params.category);
    if (params.location) queryParams.append('location', params.location);
    if (params.priceRange) queryParams.append('priceRange', params.priceRange);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const response = await api.get(`/places?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get a single place by ID
   * @param {string} id - Place ID
   * @returns {Promise} - Place object
   */
  getPlaceById: async (id) => {
    const response = await api.get(`/places/${id}`);
    return response.data;
  },

  /**
   * Create a new place
   * @param {Object} placeData - Place data
   * @returns {Promise} - Created place
   */
  createPlace: async (placeData) => {
    const response = await api.post('/places', placeData);
    return response.data;
  },

  /**
   * Update a place
   * @param {string} id - Place ID
   * @param {Object} placeData - Updated place data
   * @returns {Promise} - Updated place
   */
  updatePlace: async (id, placeData) => {
    const response = await api.put(`/places/${id}`, placeData);
    return response.data;
  },

  /**
   * Delete a place
   * @param {string} id - Place ID
   * @returns {Promise}
   */
  deletePlace: async (id) => {
    const response = await api.delete(`/places/${id}`);
    return response.data;
  }
};

export default placesService;
