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
      console.log('🔍 Response completo del backend (products):', response);
      console.log('📦 response.data:', response.data);
      
      // response.data puede tener: { data: { products, pagination } } o { products, pagination }
      const responseData = response.data.data || response.data;
      console.log('📊 responseData:', responseData);
      
      const products = responseData.products || responseData || [];
      console.log(`✅ Total productos obtenidos: ${products.length}`);
      
      return {
        success: true,
        products: products,
        pagination: responseData.pagination || null
      };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al obtener productos'
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
      const responseData = response.data.data || response.data;
      return {
        success: true,
        product: responseData.product || responseData
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al obtener el producto'
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
      const responseData = response.data.data || response.data;
      return {
        success: true,
        product: responseData.product || responseData,
        message: response.data.message || 'Producto creado exitosamente'
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
      const responseData = response.data.data || response.data;
      return {
        success: true,
        product: responseData.product || responseData,
        message: response.data.message || 'Producto actualizado exitosamente'
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
        message: response.data.message || 'Producto eliminado exitosamente'
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
      const responseData = response.data.data || response.data;
      return {
        success: true,
        product: responseData.product || responseData,
        message: response.data.message || 'Stock actualizado'
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
      const responseData = response.data.data || response.data;
      return {
        success: true,
        product: responseData.product || responseData,
        message: response.data.message || 'Stock reservado'
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
      const responseData = response.data.data || response.data;
      return {
        success: true,
        product: responseData.product || responseData,
        message: response.data.message || 'Stock liberado'
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
      console.log('Uploading image:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
      
      const formData = new FormData();
      formData.append('image', imageFile);

      console.log('FormData preparado. Enviando a:', '/products/upload-image');

      // No establecer Content-Type manualmente, dejar que axios/navegador lo haga
      // Esto es importante para que incluya el boundary correcto
      const response = await api.post('/products/upload-image', formData, {
        timeout: 120000, // 2 minutos de timeout para archivos grandes
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        // No incluir headers aquí, el interceptor se encargará
      });

      console.log('Upload response:', response.data);
      const responseData = response.data.data || response.data;
      
      const imageUrl = responseData.url || responseData.imageUrl || responseData.secure_url || responseData;
      console.log('Extracted image URL:', imageUrl);
      
      return {
        success: true,
        url: imageUrl
      };
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        }
      });
      
      let errorMessage = 'Error al subir la imagen';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout: La imagen tardó demasiado en subirse. Intenta con una imagen más pequeña.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = `Error de red al conectar con: ${error.config?.baseURL}${error.config?.url}. Verifica tu conexión a internet y que el backend esté accesible.`;
      } else if (error.response?.status === 413) {
        errorMessage = 'La imagen es demasiado grande. Intenta con una imagen más pequeña.';
      } else if (error.response?.status === 401) {
        errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error en el servidor. Intenta nuevamente más tarde.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.message
      };
    }
  }
};

export default productService;
