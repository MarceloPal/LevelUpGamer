import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useLoyalty } from '../hooks/useLoyalty';
import orderService from '../services/orderService';
import cartService from '../services/cartService';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const { coins, redeemDiscount, addPoints } = useLoyalty();

  const [isProcessing, setIsProcessing] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  
  // Formulario de información de envío
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('webpay');

  // Cargar información del usuario
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const result = await userService.getProfile();
          if (result.success) {
            const userData = result.user;
            setUserProfile(userData);
            
            // Pre-llenar el formulario con datos existentes
            setShippingForm({
              fullName: userData.name || user.name || '',
              phone: userData.phone || '',
              email: userData.email || user.email || '',
              address: userData.addresses?.[0]?.street || '',
              city: userData.addresses?.[0]?.city || '',
              region: userData.addresses?.[0]?.state || '',
              postalCode: userData.addresses?.[0]?.postalCode || '',
              additionalInfo: userData.addresses?.[0]?.additionalInfo || ''
            });
          }
        } catch (error) {
          console.error('Error al cargar perfil:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  // Redirigir si no hay usuario o carrito vacío
  useEffect(() => {
    if (!user) {
      toast.warning('Debes iniciar sesión para realizar una compra');
      navigate('/ingresar');
      return;
    }

    if (cart.length === 0) {
      toast.info('Tu carrito está vacío');
      navigate('/carrito');
    }
  }, [user, cart, navigate]);

  const formatPrice = (num) =>
    num.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRedeemDiscount = () => {
    const discountCost = 100;
    const discountRate = 0.1;

    if (coins.total < discountCost) {
      toast.warning('No tienes suficientes coins para el descuento');
      return;
    }

    const success = redeemDiscount(discountCost);
    if (success) {
      const newDiscount = total * discountRate;
      setDiscount(newDiscount);
      toast.success(`Descuento del 10% aplicado: -${formatPrice(newDiscount)}`);
    } else {
      toast.error('No se pudo aplicar el descuento');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shippingForm.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    }

    if (!shippingForm.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\+?[\d\s-]{8,}$/.test(shippingForm.phone)) {
      newErrors.phone = 'Teléfono inválido (mínimo 8 dígitos)';
    }

    if (!shippingForm.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!shippingForm.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }

    if (!shippingForm.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }

    if (!shippingForm.region.trim()) {
      newErrors.region = 'La región es obligatoria';
    }

    if (!shippingForm.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    // Validar formulario
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsProcessing(true);

    try {
      const totalWithDiscount = Math.max(total - discount, 0);

      // PASO 1: Sincronizar carrito del frontend con el backend
      toast.info('Preparando tu pedido...', { autoClose: 1500 });
      const syncResult = await cartService.syncCart(cart);
      
      if (!syncResult.success) {
        toast.error('Error al preparar el carrito. Intenta nuevamente.');
        setIsProcessing(false);
        return;
      }

      // PASO 2: Preparar datos de la orden según el backend espera
      const orderData = {
        shippingAddress: {
          nombre: shippingForm.fullName,
          direccion: shippingForm.address,
          comuna: shippingForm.city,
          region: shippingForm.region,
          codigoPostal: shippingForm.postalCode,
          telefono: shippingForm.phone,
          instrucciones: shippingForm.additionalInfo
        },
        paymentMethod: paymentMethod,
        notes: shippingForm.additionalInfo || ''
      };

      console.log('=== Creando orden ===');
      console.log('Datos del formulario:', shippingForm);
      console.log('Orden completa:', orderData);

      // PASO 3: Crear orden en el backend
      const result = await orderService.createOrder(orderData);

      console.log('=== Resultado de crear orden ===');
      console.log('Success:', result.success);
      console.log('Result completo:', result);

      if (result.success) {
        // Agregar puntos de lealtad por la compra
        addPoints(totalWithDiscount);

        toast.success('¡Orden creada exitosamente!', {
          position: 'top-center',
          autoClose: 3000
        });

        // Limpiar carrito del frontend
        clearCart();

        // Redirigir a página de confirmación o perfil
        setTimeout(() => {
          navigate(`/perfil?section=compras`);
        }, 1500);
      } else {
        toast.error(result.message || 'Error al crear la orden');
      }
    } catch (error) {
      console.error('Error al procesar orden:', error);
      toast.error('Error al procesar la orden. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalWithDiscount = Math.max(total - discount, 0);

  if (!user || cart.length === 0) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Información de Envío
              </h4>
            </div>
            <div className="card-body">
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="fullName" className="form-label">
                      Nombre Completo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      id="fullName"
                      name="fullName"
                      value={shippingForm.fullName}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Teléfono <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleInputChange}
                      placeholder="+56 9 1234 5678"
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleInputChange}
                      placeholder="correo@ejemplo.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="form-label">
                      Dirección <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      id="address"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleInputChange}
                      placeholder="Av. Principal 123, Depto 456"
                    />
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="city" className="form-label">
                      Ciudad <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      id="city"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleInputChange}
                      placeholder="Santiago"
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="region" className="form-label">
                      Región <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                      id="region"
                      name="region"
                      value={shippingForm.region}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona región</option>
                      <option value="Región Metropolitana">Región Metropolitana</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Biobío">Biobío</option>
                      <option value="Araucanía">Araucanía</option>
                      <option value="Los Lagos">Los Lagos</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="Maule">Maule</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Atacama">Atacama</option>
                      <option value="Tarapacá">Tarapacá</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="Aysén">Aysén</option>
                      <option value="Magallanes">Magallanes</option>
                      <option value="Arica y Parinacota">Arica y Parinacota</option>
                      <option value="Ñuble">Ñuble</option>
                    </select>
                    {errors.region && (
                      <div className="invalid-feedback">{errors.region}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="postalCode" className="form-label">
                      Código Postal <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                      id="postalCode"
                      name="postalCode"
                      value={shippingForm.postalCode}
                      onChange={handleInputChange}
                      placeholder="1234567"
                    />
                    {errors.postalCode && (
                      <div className="invalid-feedback">{errors.postalCode}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="additionalInfo" className="form-label">
                      Información Adicional (Opcional)
                    </label>
                    <textarea
                      className="form-control"
                      id="additionalInfo"
                      name="additionalInfo"
                      value={shippingForm.additionalInfo}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Referencias de entrega, indicaciones especiales, etc."
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Método de pago */}
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                <i className="bi bi-credit-card me-2"></i>
                Método de Pago
              </h4>
            </div>
            <div className="card-body">
              <div className="alert alert-info mb-0">
                <i className="bi bi-credit-card-2-front me-2"></i>
                <strong>WebPay Plus</strong> - Pago con tarjeta de débito o crédito
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de la orden */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Resumen de Compra</h4>
            </div>
            <div className="card-body">
              {/* Items del carrito */}
              <div className="mb-3">
                {cart.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        width="40"
                        height="40"
                        className="rounded me-2"
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        <small className="text-truncate d-block" style={{ maxWidth: '150px' }}>
                          {item.nombre}
                        </small>
                        <small className="text-muted">x{item.cantidad}</small>
                      </div>
                    </div>
                    <span className="fw-semibold">{formatPrice(item.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>

              <hr />

              {/* Coins disponibles */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tus coins:</span>
                  <span className="fw-bold text-warning">{coins.total}</span>
                </div>
                {coins.total >= 100 && discount === 0 && (
                  <button
                    className="btn btn-sm btn-outline-warning w-100"
                    onClick={handleRedeemDiscount}
                  >
                    <i className="bi bi-gift me-1"></i>
                    Canjear 100 coins (10% desc.)
                  </button>
                )}
                {discount > 0 && (
                  <div className="alert alert-success py-1 px-2 mb-0">
                    <small>✅ Descuento aplicado</small>
                  </div>
                )}
              </div>

              <hr />

              {/* Totales */}
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatPrice(total)}</span>
              </div>

              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento (10%):</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span className="text-success">GRATIS</span>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between mb-3">
                <strong>Total a Pagar:</strong>
                <strong className="fs-5 text-primary">{formatPrice(totalWithDiscount)}</strong>
              </div>

              {/* Botón de confirmar */}
              <button
                className="btn btn-primary w-100 py-2"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar Pedido
                  </>
                )}
              </button>

              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate('/carrito')}
                disabled={isProcessing}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver al Carrito
              </button>

              {/* Información de seguridad */}
              <div className="mt-3 p-2 bg-light rounded">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Compra segura y protegida
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
