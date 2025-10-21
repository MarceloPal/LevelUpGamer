import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirige al Home al salir
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        {/* Logo */}
        <h1 className="logo-title mb-0">
          <Link to="/" className="text-decoration-none text-white d-flex align-items-center">
            <img src="/img/coin-cropped.png" alt="Logo" className="logo-h1 me-2" />
            Level-Up
          </Link>
        </h1>

        {/* Toggle (para móvil) */}
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

        {/* Contenido principal */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <ul className="navbar-nav align-items-center gap-3">

            <li className="nav-item">
              <Link className="nav-link jersey-20-regular" to="/">Home</Link>
            </li>

            {/* Categorías */}
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
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/juegos">Juegos de Mesa</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/accesorios">Accesorios</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/consolas">Consolas</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/computadores">Computadores Gamers</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/sillas">Sillas Gamers</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/mouse">Mouse</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/mousepad">Mousepad</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/poleras">Poleras Personalizadas</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/polerones">Polerones Gamers</Link></li>
                <li><Link className="dropdown-item jersey-20-regular" to="/catalogo/todo">Ver todo</Link></li>
              </ul>
            </li>

            {/* Buscador */}
            <li className="nav-item">
              <form className="d-flex align-items-center" role="search">
                <input className="form-control me-2" type="search" placeholder="Buscar productos..." aria-label="Buscar" />
                <button className="btn btn-outline-light" type="submit">Buscar</button>
              </form>
            </li>

            {/* Usuario */}
            {/* Usuario */}
            {!user ? (
              // 🔹 Si NO está logueado
              <li className="nav-item jersey-20-regular">
                <Link className="nav-link d-flex align-items-center gap-2" to="/ingresar">
                  <span>Hola, ingresa!</span>
                  <img
                    src="/img/bits-8bits.gif" 
                    alt="Icono usuario pixel"
                    style={{ width: "32px", height: "32px", imageRendering: "pixelated" }}
                  />
                </Link>
              </li>
            ) : 
            (<li className="nav-item dropdown d-flex align-items-center">
                <a
                  className="nav-link dropdown-toggle text-white jersey-20-regular d-flex align-items-center gap-2"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  href="#"
                >
                  <span>Hola, {user.name}</span>
                  <img
                    src="/img/bits-8bits.gif"  
                    alt="Icono usuario pixel"
                    style={{ width: "32px", height: "32px", imageRendering: "pixelated" }}
                  />
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item jersey-20-regular" to="/perfil?section=editar">Editar Perfil</Link></li>
                  <li><Link className="dropdown-item jersey-20-regular" to="/perfil?section=compras">Mis compras</Link></li>
                  <li><Link className="dropdown-item jersey-20-regular" to="/perfil?section=track">Trackear Pedido</Link></li>
                  <li><Link className="dropdown-item jersey-20-regular" to="/perfil?section=idioma">Idioma</Link></li>
                  <li><Link className="dropdown-item jersey-20-regular" to="/perfil?section=soporte">Soporte</Link></li>
                  <li><Link className="dropdown-item jersey-20-regular" to="/fidelizacion">Fidelización</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger jersey-20-regular">
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}

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
