import api from '../api/axios';

const authService = {
  // User Signup
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup/', userData);
      
      if (response.data.success) {
        const { user, tokens } = response.data.data;
        
        // Store tokens and user data
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.errors || error.response?.data?.message || 'Signup failed',
      };
    }
  },

  // User Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      
      if (response.data.success) {
        const { user, tokens } = response.data.data;
        
        // Store tokens and user data
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // User Logout
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get User Profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile/');
      
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  },

  // Update User Profile
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/auth/profile/', userData);
      
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.errors || error.response?.data?.message || 'Update failed',
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;
