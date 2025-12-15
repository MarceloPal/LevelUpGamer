import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";  
import { useLoyalty } from "../hooks/useLoyalty";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "../styles/cart.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { coins } = useLoyalty();

  const formatPrice = (num) =>
    num.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.warning("Debes iniciar sesión para continuar con la compra");
      navigate("/ingresar");
      return;
    }

    if (cart.length === 0) {
      toast.info("Tu carrito está vacío");
      return;
    }

    navigate("/checkout");
  };



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
            {user && (
              <div className="text-start mb-3">
                <p className="mb-1">
                  <strong>Tus coins:</strong> {coins.total}
                </p>
                <small className="text-muted">
                  Podrás canjear tus coins en el siguiente paso
                </small>
              </div>
            )}

            <hr />

            {/* Totales */}
            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              className="btn w-100 btn-confirm mb-2"
              onClick={handleProceedToCheckout}
              disabled={cart.length === 0}
            >
              <i className="bi bi-arrow-right-circle me-2"></i>
              Proceder al Pago
            </button>

            <button
              id="btn-empty-cart"
              className="btn btn-outline-danger w-100"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;