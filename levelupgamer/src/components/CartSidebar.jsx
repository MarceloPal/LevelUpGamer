import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const CartSidebar = () => {
  const { cart, total, removeFromCart, clearCart } = useContext(CartContext);

  const formatPrice = (num) =>
    num.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  return (
    <div
      className="offcanvas offcanvas-end bg-dark text-white"
      tabIndex="-1"
      id="cartSidebar"
      aria-labelledby="cartSidebarLabel"
    >
      <div className="offcanvas-header border-bottom border-secondary">
        <h5 id="cartSidebarLabel" className="mb-0">
          🛒 Tu Carrito
        </h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Cerrar"
        ></button>
      </div>

      <div className="offcanvas-body d-flex flex-column">
        {/* Si el carrito está vacío */}
        {cart.length === 0 ? (
          <p className="text-center mt-5">Tu carrito está vacío.</p>
        ) : (
          <ul className="list-group list-group-flush mb-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center border-secondary"
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

        {/* Total */}
        <div className="mt-auto">
          <hr className="border-secondary" />
          <div className="d-flex justify-content-between mb-3">
            <span className="fw-bold">Total:</span>
            <span className="fw-bold">{formatPrice(total)}</span>
          </div>

          {/* Botones */}
          <button
            className="btn btn-outline-danger w-100 mb-2"
            onClick={clearCart}
          >
            Vaciar carrito
          </button>
          <button className="btn btn-success w-100">Proceder al pago</button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
