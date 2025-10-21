import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const CartPage = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const formatPrice = (num) =>
    num.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

  return (
    <main className="container my-5">
      <div className="row">
        {/* Columna izquierda */}
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

        {/* Columna derecha: resumen */}
        <div
          className="card p-4 shadow-lg bg-dark text-white ms-auto"
          style={{
            maxWidth: "400px",
            border: "3px solid #444",
            borderRadius: "20px",
          }}
        >
          <div className="card-body text-center">
            <h4 className="card-title text-white">Resumen de Compra</h4>
            <div id="cart-summary" className="mb-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between text-white"
                >
                  <span>{item.nombre} (x{item.cantidad})</span>
                  <span>{formatPrice(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold mb-3 text-white">
              <span>Total:</span>
              <span id="cart-page-total">{formatPrice(total)}</span>
            </div>
            <button
              id="btn-empty-cart"
              className="btn btn-outline-danger w-100 mb-2"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
            <button className="btn btn-success w-100">Confirmar compra</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
