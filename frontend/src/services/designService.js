import api from '../api/axios';

const designService = {
  // Generate AI Design
  generateDesign: async (formData) => {
    try {
      const response = await api.post('/design/generate/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to generate design',
      };
    }
  },

  // Get user's design history (if endpoint exists)
  getDesignHistory: async () => {
    try {
      const response = await api.get('/design/history/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch design history',
      };
    }
  },
};

export default designService;
