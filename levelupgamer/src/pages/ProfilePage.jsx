import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import userService from '../services/userService';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'editar';
  });

  // Estados para los formularios
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addresses: user?.addresses || []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [supportMessage, setSupportMessage] = useState('');
  const [showSavedMessage, setShowSavedMessage] = useState('');

  // Sincronizar con URL params
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user) {
      navigate('/ingresar');
    }
  }, [user, navigate]);

  // Cargar datos del perfil desde el backend
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const result = await userService.getProfile();
        if (result.success) {
          const userData = result.user;
          setProfileForm({
            name: userData.nombre || userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            addresses: userData.addresses || []
          });
        } else {
          console.error('Error al cargar perfil:', result.message);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Cargar órdenes del usuario
  useEffect(() => {
    const loadUserOrders = async () => {
      if (activeSection === 'compras' && user) {
        setOrdersLoading(true);
        try {
          const result = await orderService.getUserOrders();
          if (result.success) {
            setUserOrders(result.orders);
          } else {
            console.error('Error al cargar órdenes:', result.message);
          }
        } catch (error) {
          console.error('Error al cargar órdenes:', error);
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    loadUserOrders();
  }, [activeSection, user]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/perfil?section=${section}`, { replace: true });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      const result = await userService.updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        addresses: profileForm.addresses
      });

      if (result.success) {
        toast.success('Perfil actualizado exitosamente');
        
        // Actualizar el usuario en el contexto de autenticación
        updateUserData({
          name: result.user.nombre || result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          addresses: result.user.addresses
        });
        
        setShowSavedMessage('perfil');
        setTimeout(() => setShowSavedMessage(''), 3000);
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = () => {
    setProfileForm({
      ...profileForm,
      addresses: [
        ...profileForm.addresses,
        {
          alias: '',
          direccion: '',
          comuna: '',
          region: '',
          isDefault: profileForm.addresses.length === 0
        }
      ]
    });
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = profileForm.addresses.filter((_, i) => i !== index);
    setProfileForm({
      ...profileForm,
      addresses: newAddresses
    });
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...profileForm.addresses];
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value
    };
    setProfileForm({
      ...profileForm,
      addresses: newAddresses
    });
  };

  const handleSetDefaultAddress = (index) => {
    const newAddresses = profileForm.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    setProfileForm({
      ...profileForm,
      addresses: newAddresses
    });
  };

  const handleLanguageSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user_language', selectedLanguage);
    setShowSavedMessage('idioma');
    setTimeout(() => setShowSavedMessage(''), 3000);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    // Simular envío de mensaje de soporte
    setSupportMessage('');
    setShowSavedMessage('soporte');
    setTimeout(() => setShowSavedMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!trackingCode.trim()) {
      toast.error('Por favor ingresa un código de seguimiento');
      return;
    }

    setTrackingLoading(true);
    setTrackingResult(null);
    
    try {
      const result = await orderService.trackOrder(trackingCode.trim());
      if (result.success) {
        setTrackingResult(result.order);
        toast.success('Orden encontrada');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error al buscar la orden');
      console.error(error);
    } finally {
      setTrackingLoading(false);
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
      day: 'numeric'
    });
  };

  // Datos simulados de compras - ELIMINADO, ahora usamos userOrders del backend
  const userPurchases = [];

  if (!user) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container py-5">
      <div className="profile-container d-flex">
        
        {/* Sidebar de navegación */}
        <div className="profile-sidebar flex-shrink-0">
          <ul className="nav flex-column">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'editar' ? 'active' : ''}`}
                onClick={() => handleSectionChange('editar')}
              >
                <i className="bi bi-person me-2"></i>
                Editar Perfil
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'compras' ? 'active' : ''}`}
                onClick={() => handleSectionChange('compras')}
              >
                <i className="bi bi-bag me-2"></i>
                Mis Compras
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'track' ? 'active' : ''}`}
                onClick={() => handleSectionChange('track')}
              >
                <i className="bi bi-truck me-2"></i>
                Trackear Pedido
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'idioma' ? 'active' : ''}`}
                onClick={() => handleSectionChange('idioma')}
              >
                <i className="bi bi-globe me-2"></i>
                Idioma
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'soporte' ? 'active' : ''}`}
                onClick={() => handleSectionChange('soporte')}
              >
                <i className="bi bi-headset me-2"></i>
                Soporte
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div className="profile-content flex-grow-1">
          
          {/* Sección Editar Perfil */}
          {activeSection === 'editar' && (
            <div className="section">
              <h3>Editar Perfil</h3>
              
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        required 
                        disabled={isSaving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        required
                        disabled={isSaving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        placeholder="+56 9 1234 5678"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rol</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={user?.role || 'customer'}
                        disabled
                        readOnly
                      />
                      <small className="text-muted">El rol no puede ser modificado</small>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Direcciones</h5>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-primary"
                        onClick={handleAddAddress}
                        disabled={isSaving}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Agregar Dirección
                      </button>
                    </div>
                    
                    {profileForm.addresses && profileForm.addresses.length > 0 ? (
                      <div className="addresses-list">
                        {profileForm.addresses.map((address, index) => (
                          <div key={index} className="card mb-3">
                            <div className="card-body">
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Alias</label>
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={address.alias || ''}
                                    onChange={(e) => handleAddressChange(index, 'alias', e.target.value)}
                                    placeholder="Casa, Trabajo, etc."
                                    disabled={isSaving}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Dirección</label>
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={address.direccion || ''}
                                    onChange={(e) => handleAddressChange(index, 'direccion', e.target.value)}
                                    placeholder="Calle y número"
                                    disabled={isSaving}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Comuna</label>
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={address.comuna || ''}
                                    onChange={(e) => handleAddressChange(index, 'comuna', e.target.value)}
                                    placeholder="Santiago"
                                    disabled={isSaving}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Región</label>
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={address.region || ''}
                                    onChange={(e) => handleAddressChange(index, 'region', e.target.value)}
                                    placeholder="Región Metropolitana"
                                    disabled={isSaving}
                                  />
                                </div>
                                <div className="col-12">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check">
                                      <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        checked={address.isDefault || false}
                                        onChange={() => handleSetDefaultAddress(index)}
                                        id={`defaultAddress${index}`}
                                        disabled={isSaving}
                                      />
                                      <label className="form-check-label" htmlFor={`defaultAddress${index}`}>
                                        Dirección principal
                                      </label>
                                    </div>
                                    <button 
                                      type="button" 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleRemoveAddress(index)}
                                      disabled={isSaving}
                                    >
                                      <i className="bi bi-trash"></i> Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        No tienes direcciones guardadas. Haz clic en "Agregar Dirección" para añadir una.
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary mt-3"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </button>
                </form>
              )}
              
              {showSavedMessage === 'perfil' && (
                <div className="mt-3 text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Cambios guardados!
                </div>
              )}
            </div>
          )}

          {/* Sección Mis Compras */}
          {activeSection === 'compras' && (
            <div className="section">
              <h3 className="mb-4">Mis Compras</h3>
              
              {ordersLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3">Cargando tus compras...</p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Aún no tienes compras registradas.
                </div>
              ) : (
                <div className="row">
                  {userOrders.map(order => (
                    <div key={order._id || order.id} className="col-12 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h6 className="card-title mb-2">
                                Orden #{(order._id || order.id).slice(-8).toUpperCase()}
                              </h6>
                              <p className="card-text text-muted small mb-2">
                                <i className="bi bi-calendar me-2"></i>
                                {formatDate(order.createdAt)}
                              </p>
                              <p className="card-text mb-2">
                                <strong>{order.items?.length || 0}</strong> producto(s) - Total: <strong>{formatCurrency(order.total)}</strong>
                              </p>
                              {/* Mostrar tracking number o order number */}
                              {(order.trackingNumber || order.orderNumber) && (
                                <p className="card-text small text-muted mb-0">
                                  <i className="bi bi-box me-2"></i>
                                  {order.trackingNumber ? 'Código de seguimiento' : 'Número de orden'}: <code>{order.trackingNumber || order.orderNumber}</code>
                                </p>
                              )}
                            </div>
                            <div className="col-md-4 text-md-end">
                              <span className={`badge ${getStatusBadgeClass(order.status)} mb-2`}>
                                {getStatusText(order.status)}
                              </span>
                              <div>
                                {/* Mostrar botón de rastrear si hay tracking o orderNumber */}
                                {(order.trackingNumber || order.orderNumber) && (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      setTrackingCode(order.trackingNumber || order.orderNumber);
                                      handleSectionChange('track');
                                    }}
                                  >
                                    <i className="bi bi-geo-alt me-1"></i>
                                    Rastrear
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Detalles de productos */}
                          <div className="mt-3">
                            <small className="text-muted d-block mb-2">Productos:</small>
                            <ul className="list-unstyled mb-0">
                              {order.items?.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="small">
                                  • {item.productName || item.name} x{item.quantity}
                                </li>
                              ))}
                              {order.items?.length > 3 && (
                                <li className="small text-muted">
                                  • Y {order.items.length - 3} producto(s) más...
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sección Trackear Pedido */}
          {activeSection === 'track' && (
            <div className="section">
              <h3 className="mb-4">Trackear Pedido</h3>
              <form onSubmit={handleTrackOrder}>
                <div className="mb-3">
                  <label className="form-label">Código de seguimiento</label>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ingresa tu código de seguimiento"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      disabled={trackingLoading}
                    />
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={trackingLoading || !trackingCode.trim()}
                    >
                      {trackingLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Buscando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Buscar
                        </>
                      )}
                    </button>
                  </div>
                  <small className="form-text text-muted">
                    Puedes encontrar tu código de seguimiento en el email de confirmación o en la sección "Mis Compras"
                  </small>
                </div>
              </form>
              
              {trackingResult && (
                <div className="mt-4">
                  <div className="card">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-box-seam me-2"></i>
                        Orden #{(trackingResult._id || trackingResult.id).slice(-8).toUpperCase()}
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <p className="mb-2">
                            <strong>Fecha de compra:</strong> {formatDate(trackingResult.createdAt)}
                          </p>
                          <p className="mb-2">
                            <strong>Total:</strong> {formatCurrency(trackingResult.total)}
                          </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                          <span className={`badge ${getStatusBadgeClass(trackingResult.status)} fs-6`}>
                            {getStatusText(trackingResult.status)}
                          </span>
                        </div>
                      </div>

                      {/* Barra de progreso del pedido */}
                      <div className="tracking-progress mb-4">
                        <h6 className="mb-3">Estado del pedido</h6>
                        <div className="progress" style={{ height: '25px' }}>
                          <div 
                            className={`progress-bar ${
                              trackingResult.status === 'delivered' ? 'bg-success' :
                              trackingResult.status === 'cancelled' ? 'bg-danger' :
                              'bg-primary progress-bar-striped progress-bar-animated'
                            }`}
                            role="progressbar" 
                            style={{
                              width: 
                                trackingResult.status === 'delivered' ? '100%' :
                                trackingResult.status === 'shipped' ? '75%' :
                                trackingResult.status === 'processing' ? '50%' :
                                trackingResult.status === 'pending' ? '25%' :
                                trackingResult.status === 'cancelled' ? '100%' : '0%'
                            }}
                          >
                            {getStatusText(trackingResult.status)}
                          </div>
                        </div>
                      </div>

                      {/* Timeline del pedido */}
                      <div className="tracking-timeline">
                        <h6 className="mb-3">Historial</h6>
                        <div className="timeline">
                          <div className={`timeline-item ${['pending', 'processing', 'shipped', 'delivered'].includes(trackingResult.status) ? 'completed' : ''}`}>
                            <div className="timeline-marker">
                              <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div className="timeline-content">
                              <strong>Pedido recibido</strong>
                              <p className="text-muted small mb-0">{formatDate(trackingResult.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className={`timeline-item ${['processing', 'shipped', 'delivered'].includes(trackingResult.status) ? 'completed' : ''}`}>
                            <div className="timeline-marker">
                              <i className="bi bi-gear-fill"></i>
                            </div>
                            <div className="timeline-content">
                              <strong>En preparación</strong>
                              <p className="text-muted small mb-0">Tu pedido está siendo procesado</p>
                            </div>
                          </div>
                          
                          <div className={`timeline-item ${['shipped', 'delivered'].includes(trackingResult.status) ? 'completed' : ''}`}>
                            <div className="timeline-marker">
                              <i className="bi bi-truck"></i>
                            </div>
                            <div className="timeline-content">
                              <strong>En camino</strong>
                              <p className="text-muted small mb-0">Tu pedido ha sido enviado</p>
                            </div>
                          </div>
                          
                          <div className={`timeline-item ${trackingResult.status === 'delivered' ? 'completed' : ''}`}>
                            <div className="timeline-marker">
                              <i className="bi bi-house-door-fill"></i>
                            </div>
                            <div className="timeline-content">
                              <strong>Entregado</strong>
                              <p className="text-muted small mb-0">Pedido completado</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dirección de envío */}
                      {trackingResult.shippingAddress && (
                        <div className="mt-4">
                          <h6>Dirección de envío</h6>
                          <p className="mb-1">{trackingResult.shippingAddress.street}</p>
                          <p className="mb-0 text-muted">
                            {trackingResult.shippingAddress.city}, {trackingResult.shippingAddress.region} - {trackingResult.shippingAddress.postalCode}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sección Idioma */}
          {activeSection === 'idioma' && (
            <div className="section">
              <h3>Idioma</h3>
              <form onSubmit={handleLanguageSubmit}>
                <div className="mb-3">
                  <label className="form-label">Seleccionar idioma</label>
                  <select 
                    className="form-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </form>
              {showSavedMessage === 'idioma' && (
                <div className="mt-3 text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Idioma guardado!
                </div>
              )}
            </div>
          )}

          {/* Sección Soporte */}
          {activeSection === 'soporte' && (
            <div className="section">
              <h3>Soporte</h3>
              <form onSubmit={handleSupportSubmit}>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Describe tu consulta o problema"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Enviar consulta</button>
              </form>
              {showSavedMessage === 'soporte' && (
                <div className="mt-3 text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Mensaje enviado! Nuestro equipo responderá en menos de 24 horas.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
