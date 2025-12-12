import { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useLoyalty } from "../hooks/useLoyalty";
import api from "../api/apiClient"; 
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import "../styles/cart.css";

const CartPage = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { coins, redeemDiscount, addPoints } = useLoyalty();
  const { user } = useAuth(); // Obtenemos el usuario autenticado

  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // Estado de carga para el botón

  const formatPrice = (num) =>
    num.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  const handleConfirm = async () => {
    // 1. Validaciones básicas
    if (cart.length === 0) return;
    
    if (!user) {
      toast.warning("Debes iniciar sesión para realizar una compra");
      return;
    }

    setIsProcessing(true);
    setMessage("Procesando tu pedido...");

    try {
      // 2. Preparar dirección de envío 
      // (Si no tiene dirección guardada, usamos valores por defecto para que no falle la validación del backend)
      const shippingAddress = {
        nombre: user.nombre || user.name || "Cliente",
        direccion: user.addresses?.[0]?.direccion || "Dirección Principal",
        comuna: user.addresses?.[0]?.comuna || "Santiago",
        region: user.addresses?.[0]?.region || "Metropolitana",
        telefono: user.phone || "999999999"
      };

      // 3. Crear la Orden en el Backend (POST /api/orders)
      const orderResponse = await api.post('/orders', {
        paymentMethod: 'webpay',
        shippingAddress: shippingAddress,
        notes: "Pedido realizado desde la web"
      });

      // Extraer el ID de la orden creada
      const responseData = orderResponse.data.data || orderResponse.data;
      const orderId = responseData.order._id;

      console.log("✅ Orden creada con ID:", orderId);

      // 4. Procesar el Pago (POST /api/payments)
      // Esto confirma la orden y hace que el backend asigne los puntos reales en la DB
      await api.post('/payments', {
        orderId: orderId,
        method: 'webpay',
        gateway: 'webpay' // Esto dispara la simulación de pago exitoso en tu controller
      });

      // 5. Actualizar estado visual
      // Sumamos puntos visualmente en el contexto local (aunque el backend ya los guardó en DB)
      addPoints(total - discount); 
      
      // Limpiar carrito (esto también limpia la DB si actualizaste el CartProvider)
      await clearCart(); 
      
      setDiscount(0);
      setMessage("¡Compra exitosa! Tu pedido ha sido guardado en la base de datos.");
      toast.success("¡Compra confirmada correctamente!");

    } catch (error) {
      console.error("❌ Error en checkout:", error);
      const errorMsg = error.response?.data?.message || "Ocurrió un error al procesar la compra";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRedeem = () => {
    const discountCost = 100;
    const discountRate = 0.1;

    if (coins.total < discountCost) {
      setMessage("No tienes suficientes coins para el descuento.");
      return;
    }

    const success = redeemDiscount(discountCost);
    if (success) {
      const newDiscount = total * discountRate;
      setDiscount(newDiscount);
      setMessage(`Descuento aplicado: -${formatPrice(newDiscount)}`);
    } else {
      setMessage("No se pudo aplicar el descuento.");
    }
  };

  const totalWithDiscount = Math.max(total - discount, 0);

  return (
    <main className="container-all my-5">
      <div className="container-cart-page row g-4">
        {/* Columna izquierda: Lista de productos */}
        <div className="col-md-8">
          <h2 className="text-black mb-4">🛒 Tu Carrito</h2>
          {cart.length === 0 ? (
            <p className="text-muted">Tu carrito está vacío.</p>
          ) : (
            <ul id="cart-page-items" className="list-group list-group-flush mb-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      width="50"
                      className="me-3 rounded"
                      onError={(e) => e.target.src = '/img/placeholder-product.svg'}
                    />
                    <div>
                        <div className="fw-bold">{item.nombre}</div>
                        <small className="text-muted">x{item.cantidad}</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="me-3 fw-bold">{formatPrice(item.precio * item.cantidad)}</span>
                    <button
                      className="btn btn-sm btn-light border"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={isProcessing}
                    >
                      -
                    </button>
                    <button
                      className="btn btn-sm btn-light border"
                      onClick={() => updateQuantity(item.id, +1)}
                      disabled={isProcessing}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.id)}
                      disabled={isProcessing}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Columna derecha: Resumen */}
        <div className="card p-4 shadow-lg bg-white text-dark ms-auto cart-summary-card">
          <div className="card-body text-center">
            <h4 className="card-title mb-4">Resumen de Compra</h4>

            <div id="cart-summary" className="mb-3 text-start">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-1"
                >
                  <span className="text-truncate" style={{maxWidth: "180px"}}>{item.nombre} (x{item.cantidad})</span>
                  <span>{formatPrice(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>

            <hr />

            {/* Sección puntos */}
            <div className="text-start mb-3">
              <p className="mb-1">
                <strong>Tus coins:</strong> {coins.total}
              </p>
              <button
                className="btn w-100 mb-2 btn-redeem-discount"
                onClick={handleRedeem}
                disabled={isProcessing || cart.length === 0}
              >
                Canjear 100 coins por 10% de descuento
              </button>
            </div>

            {/* Totales */}
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success fw-bold">
                <span>Descuento:</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between fw-bold mb-3 fs-5">
              <span>Total a pagar:</span>
              <span>{formatPrice(totalWithDiscount)}</span>
            </div>

            {/* Mensajes */}
            {message && (
              <div className={`alert py-2 mb-3 ${message.includes("Error") ? "alert-danger" : "alert-info"}`}>
                {message}
              </div>
            )}

            <button
              id="btn-empty-cart"
              className="btn btn-outline-danger w-100 mb-2"
              onClick={clearCart}
              disabled={isProcessing || cart.length === 0}
            >
              Vaciar carrito
            </button>

            <button
              className="btn w-100 btn-confirm"
              onClick={handleConfirm}
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </span>
              ) : (
                "Confirmar compra"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;