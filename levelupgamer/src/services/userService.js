import api from '../api/apiClient';

/**
 * Servicio para manejar todas las operaciones relacionadas con usuarios
 */
const userService = {
  /**
   * Obtener perfil del usuario autenticado (usando /auth/profile)
   * @returns {Promise} Usuario actual
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return {
        success: true,
        user: response.data.data?.user || response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al obtener perfil'
      };
    }
  },

  /**
   * Actualizar perfil del usuario autenticado (usando PUT /auth/profile)
   * @param {Object} profileData - Datos a actualizar { name, email, phone, addresses }
   * @returns {Promise} Usuario actualizado
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return {
        success: true,
        user: response.data.data?.user || response.data.user,
        message: response.data.message || 'Perfil actualizado'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al actualizar perfil'
      };
    }
  },

  /**
   * Obtener información del usuario actual
   * @returns {Promise} Usuario actual
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener usuario'
      };
    }
  },

  /**
   * Obtener un usuario por ID
   * @param {String} userId - ID del usuario
   * @returns {Promise} Usuario encontrado
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener el usuario'
      };
    }
  },

  /**
   * Actualizar usuario
   * @param {String} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise} Usuario actualizado
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        user: response.data.user,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar el usuario'
      };
    }
  },

  /**
   * Cambiar contraseña
   * @param {String} userId - ID del usuario
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise} Confirmación
   */
  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.patch(`/users/${userId}/password`, passwordData);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al cambiar la contraseña'
      };
    }
  },

  /**
   * Obtener todos los usuarios (solo admin)
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Lista de usuarios
   */
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return {
        success: true,
        users: response.data.users,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener usuarios'
      };
    }
  },

  /**
   * Eliminar usuario (solo admin)
   * @param {String} userId - ID del usuario
   * @returns {Promise} Confirmación
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar el usuario'
      };
    }
  },

  /**
   * Agregar dirección al usuario
   * @param {String} userId - ID del usuario
   * @param {Object} addressData - Datos de la dirección
   * @returns {Promise} Usuario con nueva dirección
   */
  addAddress: async (userId, addressData) => {
    try {
      const response = await api.post(`/users/${userId}/addresses`, addressData);
      return {
        success: true,
        user: response.data.user,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al agregar dirección'
      };
    }
  },

  /**
   * Actualizar dirección del usuario
   * @param {String} userId - ID del usuario
   * @param {String} addressId - ID de la dirección
   * @param {Object} addressData - Datos de la dirección
   * @returns {Promise} Usuario con dirección actualizada
   */
  updateAddress: async (userId, addressId, addressData) => {
    try {
      const response = await api.put(`/users/${userId}/addresses/${addressId}`, addressData);
      return {
        success: true,
        user: response.data.user,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar dirección'
      };
    }
  },

  /**
   * Eliminar dirección del usuario
   * @param {String} userId - ID del usuario
   * @param {String} addressId - ID de la dirección
   * @returns {Promise} Usuario sin la dirección
   */
  deleteAddress: async (userId, addressId) => {
    try {
      const response = await api.delete(`/users/${userId}/addresses/${addressId}`);
      return {
        success: true,
        user: response.data.user,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar dirección'
      };
    }
  }
};

export default userService;
