import api from './api';

export const reviewsService = {
  // Get reviews for a specific place
  getReviewsByPlace: async (placeId) => {
    const response = await api.get(`/reviews/place/${placeId}`);
    return response.data;
  },

  // Get reviews by a specific user
  getReviewsByUser: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Update an existing review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};
