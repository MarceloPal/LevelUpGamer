import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <h1 className="logo-title">
          <Link to="/" className="text-decoration-none text-white">
            <img src="/img/coin-cropped.png" alt="Logo" className="logo-h1" />
            Level-Up
          </Link>
        </h1>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link jersey-20-regular" to="/">
                Home
              </Link>
            </li>

            {/* Dropdown de categorías */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle jersey-20-regular"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categorías
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/catalogo/juegos">Juegos de Mesa</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/accesorios">Accesorios</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/consolas">Consolas</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/computadores">Computadores Gamers</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/sillas">Sillas Gamers</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/mouse">Mouse</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/mousepad">Mousepad</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/poleras">Poleras Personalizadas</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/polerones">Polerones Gamers Personalizados</Link></li>
                <li><Link className="dropdown-item" to="/catalogo/todo">Ver todo</Link></li>
              </ul>
            </li>

            {/* Buscador */}
            <li className="nav-item">
              <form className="d-flex align-items-center" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Buscar productos..."
                  aria-label="Buscar"
                />
                <button className="btn btn-outline-light" type="submit">
                  Buscar
                </button>
              </form>
            </li>

            {/* Usuario */}
            <li className="nav-item jersey-20-regular">
              {user ? (
                <div className="d-flex align-items-center gap-2 text-white">
                  <span>👋 Hola, {user.nombre}!</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={logout}
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link className="nav-link" to="/ingresar">
                  Hola, ingresa!
                </Link>
              )}
            </li>

            {/* Icono perfil */}
            <li className="nav-item dropdown">
              <img
                src="/img/bits-8bits.gif"
                className="perfil dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                alt="Perfil"
              />
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/perfil">Editar Perfil</Link></li>
                <li><Link className="dropdown-item" to="/compras">Mis compras</Link></li>
                <li><Link className="dropdown-item" to="/fidelizacion">Fidelización</Link></li>
              </ul>
            </li>

            {/* Carrito */}
            <li className="nav-item ms-lg-3">
              <a
                className="nav-link position-relative"
                href="#"
                data-bs-toggle="offcanvas"
                data-bs-target="#cartSidebar"
                aria-controls="cartSidebar"
              >
                🛒
                <span className="badge bg-warning text-dark rounded-pill ms-1">
                  {cartCount || 0}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
