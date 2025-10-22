import { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";  
import { useLoyalty } from "../hooks/useLoyalty";
import "../styles/cart.css";

const CartPage = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { coins, redeemDiscount, addPoints } = useLoyalty();

  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");

  const formatPrice = (num) =>
    num.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  const handleConfirm = () => {
    if (total > 0) {
      addPoints(total - discount); // gana puntos sobre el monto final
      clearCart();
      setMessage("¡Compra confirmada y puntos agregados!");
      setDiscount(0);
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
        {/*Columna izquierda */}
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
                  <div>
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      width="50"
                      className="me-2"
                    />
                    {item.nombre} (x{item.cantidad})
                  </div>
                  <div>
                    <span className="me-3">{formatPrice(item.precio * item.cantidad)}</span>
                    <button
                      className="btn btn-sm btn-light me-1"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <button
                      className="btn btn-sm btn-light me-1"
                      onClick={() => updateQuantity(item.id, +1)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/*Columna derecha: resumen */}
        <div className="card p-4 shadow-lg bg-white text-dark ms-auto cart-summary-card">
          <div className="card-body text-center">
            <h4 className="card-title mb-4">Resumen de Compra</h4>

            <div id="cart-summary" className="mb-3 text-start">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-1"
                >
                  <span>{item.nombre} (x{item.cantidad})</span>
                  <span>{formatPrice(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>

            <hr />

            {/*Sección puntos */}
            <div className="text-start mb-3">
              <p className="mb-1">
                <strong>Tus coins:</strong> {coins.total}
              </p>
              <button
                className="btn w-100 mb-2 btn-redeem-discount"
                onClick={handleRedeem}
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
            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total a pagar:</span>
              <span>{formatPrice(totalWithDiscount)}</span>
            </div>

            {/* Mensajes */}
            {message && (
              <div className="alert alert-info py-2">{message}</div>
            )}

            <button
              id="btn-empty-cart"
              className="btn btn-outline-danger w-100 mb-2"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>

            <button
              className="btn w-100 btn-confirm"
              onClick={handleConfirm}
            >
              Confirmar compra
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
