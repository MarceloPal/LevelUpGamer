import api from '../api/apiClient';

const orderService = {
  // Obtener todas las órdenes
  getAllOrders: async (filters = {}) => {
    try {
      // Construir parámetros de query
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const queryString = params.toString();
      const url = queryString ? `/orders?${queryString}` : '/orders';
      
      console.log('=== getAllOrders ===');
      console.log('URL:', url);
      console.log('Filters:', filters);
      
      const response = await api.get(url);
      console.log('Status:', response.status);
      console.log('response.data:', response.data);
      
      // Intentar diferentes estructuras de respuesta posibles
      let ordersData = [];
      
      if (response.data?.data?.orders) {
        // Caso 1: { data: { orders: [] } }
        ordersData = response.data.data.orders;
      } else if (Array.isArray(response.data?.data)) {
        // Caso 2: { data: [] }
        ordersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Caso 3: []
        ordersData = response.data;
      }
      
      console.log('Orders loaded:', ordersData.length);
      
      return {
        success: true,
        orders: ordersData,
        pagination: response.data?.data?.pagination
      };
    } catch (error) {
      console.error('=== Error al obtener órdenes ===');
      console.error('Error:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar órdenes',
        orders: []
      };
    }
  },

  // Obtener órdenes de un usuario
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders/my-orders');
      console.log('My Orders Response:', response.data);
      // La API puede devolver: { data: { orders: [], pagination: {} } } o { data: [] }
      const ordersData = response.data?.data?.orders || response.data?.data || response.data || [];
      console.log('User orders extracted:', ordersData);
      return {
        success: true,
        orders: ordersData,
        pagination: response.data?.data?.pagination
      };
    } catch (error) {
      console.error('Error al obtener mis órdenes:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar mis órdenes',
        orders: []
      };
    }
  },

  // Obtener una orden específica
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return {
        success: true,
        order: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener orden:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar la orden'
      };
    }
  },

  // Crear nueva orden
  createOrder: async (orderData) => {
    try {
      console.log('📦 Enviando orden al backend:', JSON.stringify(orderData, null, 2));
      const response = await api.post('/orders', orderData);
      console.log('✅ Orden creada:', response.data);
      return {
        success: true,
        order: response.data.data || response.data
      };
    } catch (error) {
      console.error('❌ Error al crear orden:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Details array:', error.response?.data?.details);
      
      // Mostrar cada error de validación
      if (error.response?.data?.details?.length > 0) {
        console.error('🔴 Errores de validación:');
        error.response.data.details.forEach((detail, index) => {
          console.error(`  ${index + 1}.`, detail);
        });
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear la orden',
        details: error.response?.data?.details
      };
    }
  },

  // Actualizar estado de orden (admin)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return {
        success: true,
        order: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar el estado'
      };
    }
  },

  // Cancelar orden
  cancelOrder: async (orderId) => {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      return {
        success: true,
        order: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al cancelar orden:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cancelar la orden'
      };
    }
  },

  // Trackear orden por código de tracking (busca en las órdenes del usuario)
  trackOrder: async (trackingCode) => {
    try {
      const response = await api.get(`/orders/track/${trackingCode}`);
      return {
        success: true,
        order: response.data?.data || response.data
      };
    } catch (error) {
      console.error('Error al trackear orden:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al buscar la orden'
      };
    }
  }
};

export default orderService;
