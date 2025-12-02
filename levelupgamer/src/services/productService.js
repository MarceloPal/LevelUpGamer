import api from '../api/apiClient';

/**
 * Servicio para manejar todas las operaciones relacionadas con productos
 */
const productService = {
  /**
   * Obtener todos los productos (con paginación opcional)
   * @param {Object} params - Parámetros de consulta (page, limit, category, etc.)
   * @returns {Promise} Lista de productos
   */
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return {
        success: true,
        products: response.data.products,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener productos'
      };
    }
  },

  /**
   * Obtener un producto por ID, productId o slug
   * @param {String} identifier - ID, productId o slug del producto
   * @returns {Promise} Producto encontrado
   */
  getProductById: async (identifier) => {
    try {
      const response = await api.get(`/products/${identifier}`);
      return {
        success: true,
        product: response.data.product
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al obtener el producto'
      };
    }
  },

  /**
   * Crear un nuevo producto (requiere autenticación como admin)
   * @param {Object} productData - Datos del producto
   * @returns {Promise} Producto creado
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      // El interceptor ya devuelve response.data, entonces 'response' es el objeto completo del backend
      return {
        success: true,
        product: response.data?.product || response.product,
        message: response.message || 'Producto creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al crear el producto'
      };
    }
  },

  /**
   * Actualizar un producto existente (requiere autenticación como admin)
   * @param {String} id - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise} Producto actualizado
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return {
        success: true,
        product: response.data?.product || response.product,
        message: response.message || 'Producto actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar el producto'
      };
    }
  },

  /**
   * Eliminar un producto (soft delete - requiere autenticación como admin)
   * @param {String} id - ID del producto
   * @returns {Promise} Confirmación de eliminación
   */
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar el producto'
      };
    }
  },

  /**
   * Actualizar el stock de un producto
   * @param {String} id - ID del producto
   * @param {Object} stockData - { quantity, type, reason }
   * @returns {Promise} Producto con stock actualizado
   */
  updateStock: async (id, stockData) => {
    try {
      const response = await api.patch(`/products/${id}/stock`, stockData);
      return {
        success: true,
        product: response.data.product,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al actualizar el stock'
      };
    }
  },

  /**
   * Reservar stock de un producto
   * @param {String} id - ID del producto
   * @param {Object} reserveData - { quantity, orderId }
   * @returns {Promise} Producto con stock reservado
   */
  reserveStock: async (id, reserveData) => {
    try {
      const response = await api.post(`/products/${id}/reserve`, reserveData);
      return {
        success: true,
        product: response.data.product,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al reservar el stock'
      };
    }
  },

  /**
   * Liberar stock reservado de un producto
   * @param {String} id - ID del producto
   * @param {Object} releaseData - { quantity, orderId }
   * @returns {Promise} Producto con stock liberado
   */
  releaseStock: async (id, releaseData) => {
    try {
      const response = await api.post(`/products/${id}/release`, releaseData);
      return {
        success: true,
        product: response.data.product,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al liberar el stock'
      };
    }
  },

  /**
   * Subir imagen a Cloudinary
   * @param {File} imageFile - Archivo de imagen
   * @returns {Promise} URL de la imagen subida
   */
  uploadImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // El interceptor ya devuelve response.data, así que 'response' es el objeto completo del backend
      return {
        success: true,
        url: response.url // response ya es { url: "..." }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al subir la imagen'
      };
    }
  }
};

export default productService;
