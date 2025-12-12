import api from '../api/apiClient';

/**
 * Servicio para manejar todas las operaciones relacionadas con categorías
 */
const categoryService = {
  /**
   * Obtener todas las categorías
   * @returns {Promise} Lista de categorías
   */
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      console.log('🔍 Response completo del backend (categories):', response);
      console.log('📦 response.data:', response.data);
      
      const responseData = response.data.data || response.data;
      console.log('📊 responseData:', responseData);
      
      const categories = responseData.categories || responseData || [];
      console.log(`✅ Total categorías obtenidas: ${categories.length}`);
      
      return {
        success: true,
        categories: categories
      };
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al obtener categorías'
      };
    }
  },

  /**
   * Obtener una categoría por ID o slug
   * @param {String} identifier - ID o slug de la categoría
   * @returns {Promise} Categoría encontrada
   */
  getCategoryById: async (identifier) => {
    try {
      const response = await api.get(`/categories/${identifier}`);
      const responseData = response.data.data || response.data;
      return {
        success: true,
        category: responseData.category || responseData
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al obtener la categoría'
      };
    }
  },

  /**
   * Crear una nueva categoría (requiere autenticación como admin)
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise} Categoría creada
   */
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      const responseData = response.data.data || response.data;
      return {
        success: true,
        category: responseData.category || responseData,
        message: response.data.message || 'Categoría creada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al crear la categoría'
      };
    }
  },

  /**
   * Actualizar una categoría existente (requiere autenticación como admin)
   * @param {String} id - ID de la categoría
   * @param {Object} categoryData - Datos a actualizar
   * @returns {Promise} Categoría actualizada
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      const responseData = response.data.data || response.data;
      return {
        success: true,
        category: responseData.category || responseData,
        message: response.data.message || 'Categoría actualizada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar la categoría'
      };
    }
  },

  /**
   * Eliminar una categoría (requiere autenticación como admin)
   * @param {String} id - ID de la categoría
   * @returns {Promise} Confirmación de eliminación
   */
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return {
        success: true,
        message: response.data.message || 'Categoría eliminada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar la categoría'
      };
    }
  }
};

export default categoryService;
