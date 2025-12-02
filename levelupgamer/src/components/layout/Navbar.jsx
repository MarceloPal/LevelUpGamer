import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { getAllCategories } from "../../data/products";
import CartSidebar from "../CartSidebar";

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  // Verificar si el usuario es admin basado en el rol del backend
  const isAdmin = user?.role === 'admin';

  // Cargar categorías desde el backend
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Limpiar después de buscar
    } else {
      navigate('/catalogo');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-gamer sticky-top">
        <div className="navbar-gradient-border"></div>
        
        {/* Indicador de modo admin solo si el usuario es admin */}
        {isAdmin && (
          <div className="admin-session-indicator">
            <span className="badge bg-danger text-white admin-mode-badge">MODO ADMIN</span>
          </div>
        )}

        <div className="container">
          {/* Logo */}
          <h1 className="navbar-brand-wrapper mb-0">
            <Link to="/" className="navbar-brand-link text-decoration-none text-white d-flex align-items-center">
              <div className="logo-container">
                <div className="logo-glow"></div>
                <img src="/img/coin-cropped.png" alt="Logo" className="navbar-logo" />
              </div>
              <span className="brand-text">Level-Up</span>
            </Link>
          </h1>

          {/* Toggle móvil */}
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

          {/* Contenido */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
            <ul className="navbar-nav align-items-center gap-3">

              <li className="nav-item">
                <Link className="nav-link-custom" to="/"><i className="bi bi-house-fill me-2"></i>Home</Link>
              </li>

              {/* Categorías */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link-custom dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-grid-fill me-2"></i>Categorías
                </a>
                <ul className="dropdown-menu dropdown-menu-custom">
                  {/* Generar elementos dinámicamente desde el array de categorías */}
                  {categories.map(category => (
                    <li key={category.id}>
                      <Link 
                        className="dropdown-item-custom" 
                        to={`/catalogo?section=${category.id}`}
                      >
                        <span className="category-icon-dropdown me-2">{category.icon}</span>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                  <li><hr className="dropdown-divider-custom" /></li>
                  <li>
                    <Link className="dropdown-item-custom all-products" to="/catalogo?section=todo">
                      <i className="bi bi-shop me-2"></i>
                      Ver todo
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Buscador */}
              <li className="search-item">
                <form className="search-form-navbar" role="search" onSubmit={handleSearch}>
                  <div className="search-input-wrapper">
                    <i className="bi bi-search search-icon-input"></i>
                    <input 
                      className="search-input-custom" 
                      type="search" 
                      placeholder="Buscar productos..." 
                      aria-label="Buscar"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        type="button" 
                        className="clear-search-btn"
                        onClick={() => setSearchQuery('')}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                  <button className="search-btn-custom" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </li>

              {/* Usuario */}
              {!user ? (
                <li className="nav-item">
                  <Link className="user-link" to="/ingresar">
                        <img
                          src="/img/bits-8bits.gif"
                          alt="Icono usuario pixel"
                          className="user-avatar-pixel"
                        />
                    <span className="user-text">Hola, ingresa!</span>
                      </Link>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <a
                    className="user-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    href="#"
                  >
                    <img
                      src="/img/bits-8bits.gif"
                      alt="Icono usuario pixel"
                      className="user-avatar-pixel"
                    />
                    <span className="user-text">Bienvenido {user.nombre} {isAdmin && <span className="ms-2 text-warning">(Administrador)</span>}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-custom dropdown-menu-end">
                    {isAdmin && (
                      <li>
                        <Link className="dropdown-item-custom" to="/admin">
                          <i className="bi bi-speedometer2 me-2"></i>Panel de Admin
                        </Link>
                      </li>
                    )}
                    <li><Link className="dropdown-item-custom" to="/perfil?section=editar"><i className="bi bi-pencil-fill me-2"></i>Editar Perfil</Link></li>
                    <li><Link className="dropdown-item-custom" to="/perfil?section=compras"><i className="bi bi-bag-fill me-2"></i>Mis compras</Link></li>
                    <li><Link className="dropdown-item-custom" to="/perfil?section=track"><i className="bi bi-truck me-2"></i>Trackear Pedido</Link></li>
                    <li><Link className="dropdown-item-custom" to="/perfil?section=idioma"><i className="bi bi-globe me-2"></i>Idioma</Link></li>
                    <li><Link className="dropdown-item-custom" to="/perfil?section=soporte"><i className="bi bi-question-circle-fill me-2"></i>Soporte</Link></li>
                    <li><Link className="dropdown-item-custom" to="/puntos"><i className="bi bi-star-fill me-2"></i>Puntos</Link></li>
                    <li><hr className="dropdown-divider-custom" /></li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item-custom logout-item">
                        <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              )}

              {/* Carrito o Gestión (para admin) */}
              <li className="nav-item ms-lg-3">
                {!isAdmin ? (
                  <button
                    className="cart-btn-custom"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <div className="cart-icon-wrapper">
                      <i className="bi bi-cart-fill"></i>
                      <span className="cart-badge">
                        {cartCount || 0}
                      </span>
                    </div>
                    <span className="cart-text d-none d-lg-inline">Carrito</span>
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-light"
                    onClick={() => navigate('/admin')}
                    title="Panel de Administración"
                  >
                    <i className="bi bi-tools me-2"></i>
                    Gestión
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Panel lateral del carrito */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
