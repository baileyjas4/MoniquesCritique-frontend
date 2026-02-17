import api from './api';

export const userService = {
  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Get user preferences
  getUserPreferences: async (userId) => {
    const response = await api.get(`/users/${userId}/preferences`);
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (userId, preferences) => {
    const response = await api.put(`/users/${userId}/preferences`, preferences);
    return response.data;
  },

  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    const response = await api.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Delete account
  deleteAccount: async (userId, password) => {
    const response = await api.delete(`/users/${userId}`, {
      data: { password }
    });
    return response.data;
  }
};
