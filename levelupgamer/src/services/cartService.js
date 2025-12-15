import api from '../api/apiClient';

const cartService = {
  // Obtener carrito del backend
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return {
        success: true,
        cart: response.data.cart || response.data.data?.cart || {}
      };
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar carrito',
        cart: {}
      };
    }
  },

  // Añadir producto al carrito del backend
  addItem: async (productId, quantity) => {
    try {
      const response = await api.post('/cart/items', {
        productId,
        quantity
      });
      return {
        success: true,
        cart: response.data.cart || response.data.data?.cart
      };
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al añadir producto'
      };
    }
  },

  // Actualizar cantidad de producto
  updateItem: async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${productId}`, {
        quantity
      });
      return {
        success: true,
        cart: response.data.cart || response.data.data?.cart
      };
    } catch (error) {
      console.error('Error al actualizar carrito:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar cantidad'
      };
    }
  },

  // Eliminar producto del carrito
  removeItem: async (productId) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      return {
        success: true,
        cart: response.data.cart || response.data.data?.cart
      };
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar producto'
      };
    }
  },

  // Vaciar carrito completo
  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return {
        success: true,
        cart: response.data.cart || response.data.data?.cart || {}
      };
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al vaciar carrito'
      };
    }
  },

  // Sincronizar carrito del frontend con el backend
  syncCart: async (frontendCart) => {
    try {
      console.log('=== Sincronizando carrito con backend ===');
      console.log('Carrito frontend:', frontendCart);

      // Primero, vaciar el carrito del backend
      await cartService.clearCart();

      // Luego, añadir todos los productos del frontend al backend
      for (const item of frontendCart) {
        const result = await cartService.addItem(item.id, item.cantidad);
        if (!result.success) {
          console.error(`Error al sincronizar producto ${item.id}:`, result.message);
        }
      }

      console.log('✅ Carrito sincronizado exitosamente');
      return { success: true };
    } catch (error) {
      console.error('Error al sincronizar carrito:', error);
      return {
        success: false,
        message: 'Error al sincronizar el carrito'
      };
    }
  },

  // Aplicar cupón de descuento
  applyCoupon: async (code) => {
    try {
      const response = await api.post('/cart/coupon', { code });
      return {
        success: true,
        cart: response.data.cart || response.data.data?.cart
      };
    } catch (error) {
      console.error('Error al aplicar cupón:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al aplicar cupón'
      };
    }
  },

  // Remover cupón de descuento
  removeCoupon: async () => {
    try {
      const response = await api.delete('/cart/coupon');
      return {
        success: true,
        cart: response.data.cart || response.data.data?.cart
      };
    } catch (error) {
      console.error('Error al remover cupón:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al remover cupón'
      };
    }
  }
};

export default cartService;
