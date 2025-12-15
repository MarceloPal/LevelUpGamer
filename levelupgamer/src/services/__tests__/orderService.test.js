import orderService from '../orderService';
import api from '../../api/apiClient';

// Mock del apiClient
jest.mock('../../api/apiClient');

describe('orderService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('debe obtener todas las órdenes exitosamente', async () => {
      const mockOrders = [
        { id: '1', total: 50000, status: 'pending' },
        { id: '2', total: 75000, status: 'delivered' }
      ];

      api.get.mockResolvedValue({
        data: { data: mockOrders }
      });

      const result = await orderService.getAllOrders();

      expect(result.success).toBe(true);
      expect(result.orders).toEqual(mockOrders);
      expect(api.get).toHaveBeenCalledWith('/orders');
    });

    it('debe manejar errores al obtener órdenes', async () => {
      const errorMessage = 'Error al cargar órdenes';
      api.get.mockRejectedValue({
        response: { data: { message: errorMessage } }
      });

      const result = await orderService.getAllOrders();

      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
      expect(result.orders).toEqual([]);
    });
  });

  describe('getUserOrders', () => {
    it('debe obtener las órdenes del usuario', async () => {
      const mockOrders = [
        { id: '1', total: 50000, userId: 'user123' }
      ];

      api.get.mockResolvedValue({
        data: { data: mockOrders }
      });

      const result = await orderService.getUserOrders();

      expect(result.success).toBe(true);
      expect(result.orders).toEqual(mockOrders);
      expect(api.get).toHaveBeenCalledWith('/orders/my-orders');
    });
  });

  describe('trackOrder', () => {
    it('debe rastrear una orden por código', async () => {
      const trackingCode = 'TRACK123';
      const mockOrder = {
        id: '1',
        trackingCode: trackingCode,
        status: 'shipped'
      };

      api.get.mockResolvedValue({
        data: { data: mockOrder }
      });

      const result = await orderService.trackOrder(trackingCode);

      expect(result.success).toBe(true);
      expect(result.order).toEqual(mockOrder);
      expect(api.get).toHaveBeenCalledWith(`/orders/track/${trackingCode}`);
    });

    it('debe manejar código de seguimiento no encontrado', async () => {
      const trackingCode = 'INVALID';
      
      api.get.mockRejectedValue({
        response: { data: { message: 'Código no encontrado' } }
      });

      const result = await orderService.trackOrder(trackingCode);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Código no encontrado');
    });
  });

  describe('updateOrderStatus', () => {
    it('debe actualizar el estado de una orden', async () => {
      const orderId = 'order123';
      const newStatus = 'delivered';
      const mockOrder = {
        id: orderId,
        status: newStatus
      };

      api.patch.mockResolvedValue({
        data: { data: mockOrder }
      });

      const result = await orderService.updateOrderStatus(orderId, newStatus);

      expect(result.success).toBe(true);
      expect(result.order.status).toBe(newStatus);
      expect(api.patch).toHaveBeenCalledWith(`/orders/${orderId}/status`, { status: newStatus });
    });
  });

  describe('createOrder', () => {
    it('debe crear una nueva orden', async () => {
      const orderData = {
        items: [{ productId: 'p1', quantity: 2, price: 10000 }],
        total: 20000,
        shippingAddress: {
          street: 'Calle 123',
          city: 'Santiago'
        }
      };

      const mockCreatedOrder = {
        ...orderData,
        id: 'newOrder123',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      api.post.mockResolvedValue({
        data: { data: mockCreatedOrder }
      });

      const result = await orderService.createOrder(orderData);

      expect(result.success).toBe(true);
      expect(result.order.id).toBe('newOrder123');
      expect(api.post).toHaveBeenCalledWith('/orders', orderData);
    });
  });
});
