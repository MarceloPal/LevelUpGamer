import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, total, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const formatPrice = (num) =>
    num.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  const handleCheckout = () => {
    onClose(); // cierra el sidebar
    navigate("/checkout"); // redirige a la página de checkout
  };

  return (
    <>
      {/* Fondo oscuro con blur */}
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sidebar principal */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>🛒 Tu Carrito</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>

        {cart.length === 0 ? (
          <p className="text-center mt-5">Tu carrito está vacío.</p>
        ) : (
          <ul className="list-group list-group-flush mb-3">
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
                    height="50"
                    className="me-2 rounded"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <div className="fw-bold">{item.nombre}</div>
                    <small className="text-secondary">
                      {item.cantidad} x {formatPrice(item.precio)}
                    </small>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Total y botones */}
        <div className="mt-auto">
          <hr className="border-secondary" />
          <div className="d-flex justify-content-between mb-3">
            <span className="fw-bold">Total:</span>
            <span className="fw-bold">{formatPrice(total)}</span>
          </div>

          <button className="btn btn-outline-danger w-100 mb-2" onClick={clearCart}>
            Vaciar carrito
          </button>

          {/*Redirección al CartPage */}
          <button className="btn btn-success w-100" onClick={handleCheckout}>
            Proceder al pago
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
