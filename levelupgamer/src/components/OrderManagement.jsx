import { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await orderService.getAllOrders();
      console.log('loadOrders result:', result);
      if (result.success) {
        console.log('Orders loaded:', result.orders.length);
        setOrders(result.orders);
      } else {
        console.error('Error en respuesta:', result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Exception al cargar órdenes:', error);
      toast.error('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const result = await orderService.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast.success('Estado actualizado correctamente');
        loadOrders();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'pending': 'bg-warning text-dark',
      'confirmed': 'bg-success text-white',
      'processing': 'bg-info text-white',
      'shipped': 'bg-primary text-white',
      'delivered': 'bg-success text-white',
      'cancelled': 'bg-danger text-white'
    };
    return statusClasses[status] || 'bg-secondary text-white';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusTexts[status] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortedAndFilteredOrders = () => {
    let filtered = [...orders];

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'total-desc':
          return b.total - a.total;
        case 'total-asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const displayOrders = getSortedAndFilteredOrders();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando órdenes...</p>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="order-header mb-4">
        <h2 className="mb-0">Gestión de Órdenes</h2>
        <button onClick={loadOrders} className="btn btn-outline-primary">
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="order-controls mb-4 p-3 bg-light rounded">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Filtrar por estado:</label>
            <select 
              className="form-select" 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmados</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviados</option>
              <option value="delivered">Entregados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Ordenar por:</label>
            <select 
              className="form-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Fecha (más reciente)</option>
              <option value="date-asc">Fecha (más antigua)</option>
              <option value="total-desc">Total (mayor a menor)</option>
              <option value="total-asc">Total (menor a mayor)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">{orders.length}</h5>
              <p className="card-text small">Total Órdenes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">
                {orders.filter(o => o.status === 'pending').length}
              </h5>
              <p className="card-text small">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="card-title text-info">
                {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
              </h5>
              <p className="card-text small">En Proceso</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="card-title text-success">
                {orders.filter(o => o.status === 'delivered').length}
              </h5>
              <p className="card-text small">Entregados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de órdenes */}
      {displayOrders.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-inbox display-4 d-block mb-3"></i>
          <p className="mb-0">No hay órdenes {filterStatus !== 'all' ? `con estado "${getStatusText(filterStatus)}"` : ''}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID Orden</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Código Tracking</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map(order => (
                <tr key={order._id || order.id}>
                  <td>
                    <code className="text-primary">
                      #{(order._id || order.id).slice(-8).toUpperCase()}
                    </code>
                  </td>
                  <td>
                    <div>
                      <strong>{order.user?.name || order.customerName || 'N/A'}</strong>
                      <br />
                      <small className="text-muted">{order.user?.email || order.customerEmail || ''}</small>
                    </div>
                  </td>
                  <td>
                    <small>{formatDate(order.createdAt)}</small>
                  </td>
                  <td>
                    <strong>{formatCurrency(order.total)}</strong>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td>
                    <code className="text-muted">
                      {order.trackingNumber || 'Sin asignar'}
                    </code>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                        title="Ver detalles"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <div className="dropdown">
                        <button
                          className="btn btn-outline-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          title="Cambiar estado"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleStatusChange(order._id || order.id, 'pending')}
                            >
                              <i className="bi bi-clock text-warning me-2"></i>
                              Pendiente
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleStatusChange(order._id || order.id, 'confirmed')}
                            >
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Confirmado
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleStatusChange(order._id || order.id, 'processing')}
                            >
                              <i className="bi bi-gear text-info me-2"></i>
                              Procesando
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleStatusChange(order._id || order.id, 'shipped')}
                            >
                              <i className="bi bi-truck text-primary me-2"></i>
                              Enviado
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleStatusChange(order._id || order.id, 'delivered')}
                            >
                              <i className="bi bi-check-circle text-success me-2"></i>
                              Entregado
                            </button>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleStatusChange(order._id || order.id, 'cancelled')}
                            >
                              <i className="bi bi-x-circle me-2"></i>
                              Cancelar
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetailModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalles de Orden #{(selectedOrder._id || selectedOrder.id).slice(-8).toUpperCase()}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Información del Cliente</h6>
                    <p className="mb-1"><strong>Nombre:</strong> {selectedOrder.shipping?.address?.nombre || selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name || selectedOrder.customerName || 'N/A'}</p>
                    <p className="mb-1"><strong>Email:</strong> {selectedOrder.user?.email || selectedOrder.customerEmail || 'N/A'}</p>
                    <p className="mb-1"><strong>Teléfono:</strong> {selectedOrder.shipping?.address?.telefono || selectedOrder.shippingAddress?.telefono || selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Dirección de Envío</h6>
                    <p className="mb-1">{selectedOrder.shipping?.address?.direccion || selectedOrder.shippingAddress?.direccion || 'N/A'}</p>
                    <p className="mb-1">{selectedOrder.shipping?.address?.comuna || selectedOrder.shippingAddress?.comuna || ''}, {selectedOrder.shipping?.address?.region || selectedOrder.shippingAddress?.region || ''}</p>
                    <p className="mb-1">CP: {selectedOrder.shipping?.address?.codigoPostal || selectedOrder.shippingAddress?.codigoPostal || ''}</p>
                    {(selectedOrder.shipping?.address?.additionalInfo || selectedOrder.shippingAddress?.additionalInfo) && (
                      <p className="mb-1 text-muted"><small>{selectedOrder.shipping?.address?.additionalInfo || selectedOrder.shippingAddress?.additionalInfo}</small></p>
                    )}
                  </div>
                </div>

                <h6>Productos</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.subtotal || (item.price * item.quantity))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td><strong>{formatCurrency(selectedOrder.total)}</strong></td>
                    </tr>
                  </tfoot>
                </table>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Estado:</strong> <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>{getStatusText(selectedOrder.status)}</span></p>
                    <p className="mb-1"><strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Tracking:</strong> <code>{selectedOrder.trackingNumber || selectedOrder.orderNumber || 'Sin asignar'}</code></p>
                    <p className="mb-1"><strong>Método de Pago:</strong> {selectedOrder.payment?.method === 'webpay' ? 'WebPay Plus' : selectedOrder.paymentMethod === 'webpay' ? 'WebPay Plus' : selectedOrder.payment?.method || selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
