import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'editar';
  });

  // Estados para los formularios
  const [profileForm, setProfileForm] = useState({
    nombre: user?.nombre || '',
    apellidos: '',
    email: user?.email || '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: ''
  });

  const [trackingCode, setTrackingCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [supportMessage, setSupportMessage] = useState('');
  const [showSavedMessage, setShowSavedMessage] = useState('');

  // Sincronizar con URL params
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user) {
      navigate('/ingresar');
    }
  }, [user, navigate]);

  // Cargar datos del perfil desde localStorage
  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`profile_${user.email}`);
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setProfileForm(prev => ({ ...prev, ...profileData }));
      }
    }
  }, [user]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/perfil?section=${section}`, { replace: true });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (user) {
      localStorage.setItem(`profile_${user.email}`, JSON.stringify(profileForm));
      setShowSavedMessage('perfil');
      setTimeout(() => setShowSavedMessage(''), 3000);
    }
  };

  const handleLanguageSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user_language', selectedLanguage);
    setShowSavedMessage('idioma');
    setTimeout(() => setShowSavedMessage(''), 3000);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    // Simular envío de mensaje de soporte
    setSupportMessage('');
    setShowSavedMessage('soporte');
    setTimeout(() => setShowSavedMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Datos simulados de compras
  const userPurchases = [
    { id: 1, product: 'Mouse Gaming G502 HERO', status: 'Entregado', statusClass: 'text-success' },
    { id: 2, product: 'Teclado Mecánico RGB', status: 'En camino', statusClass: 'text-warning' },
    { id: 3, product: 'Silla Gaming Titan Evo', status: 'Pendiente', statusClass: 'text-danger' }
  ];

  if (!user) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container py-5">
      <div className="profile-container d-flex">
        
        {/* Sidebar de navegación */}
        <div className="profile-sidebar flex-shrink-0">
          <ul className="nav flex-column">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'editar' ? 'active' : ''}`}
                onClick={() => handleSectionChange('editar')}
              >
                <i className="bi bi-person me-2"></i>
                Editar Perfil
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'compras' ? 'active' : ''}`}
                onClick={() => handleSectionChange('compras')}
              >
                <i className="bi bi-bag me-2"></i>
                Mis Compras
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'track' ? 'active' : ''}`}
                onClick={() => handleSectionChange('track')}
              >
                <i className="bi bi-truck me-2"></i>
                Trackear Pedido
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'idioma' ? 'active' : ''}`}
                onClick={() => handleSectionChange('idioma')}
              >
                <i className="bi bi-globe me-2"></i>
                Idioma
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeSection === 'soporte' ? 'active' : ''}`}
                onClick={() => handleSectionChange('soporte')}
              >
                <i className="bi bi-headset me-2"></i>
                Soporte
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link text-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div className="profile-content flex-grow-1">
          
          {/* Sección Editar Perfil */}
          {activeSection === 'editar' && (
            <div className="section">
              <h3>Editar Perfil</h3>
              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={profileForm.nombre}
                      onChange={(e) => setProfileForm({...profileForm, nombre: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellidos</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={profileForm.apellidos}
                      onChange={(e) => setProfileForm({...profileForm, apellidos: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={profileForm.telefono}
                      onChange={(e) => setProfileForm({...profileForm, telefono: e.target.value})}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Dirección</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={profileForm.direccion}
                      onChange={(e) => setProfileForm({...profileForm, direccion: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Comuna</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={profileForm.comuna}
                      onChange={(e) => setProfileForm({...profileForm, comuna: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Región</label>
                    <select 
                      className="form-select"
                      value={profileForm.region}
                      onChange={(e) => setProfileForm({...profileForm, region: e.target.value})}
                    >
                      <option value="">Seleccionar región</option>
                      <option value="metropolitana">Región Metropolitana</option>
                      <option value="valparaiso">Región de Valparaíso</option>
                      <option value="biobio">Región del Bío Bío</option>
                      <option value="araucania">Región de La Araucanía</option>
                      <option value="los-lagos">Región de Los Lagos</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Guardar Cambios</button>
              </form>
              {showSavedMessage === 'perfil' && (
                <div className="mt-3 text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Cambios guardados!
                </div>
              )}
            </div>
          )}

          {/* Sección Mis Compras */}
          {activeSection === 'compras' && (
            <div className="section">
              <h3>Mis Compras</h3>
              <div className="list-group">
                {userPurchases.map(purchase => (
                  <div key={purchase.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{purchase.product}</h6>
                        <small className="text-muted">Pedido #{1000 + purchase.id}</small>
                      </div>
                      <span className={`badge ${purchase.statusClass}`}>
                        {purchase.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sección Trackear Pedido */}
          {activeSection === 'track' && (
            <div className="section">
              <h3>Trackear Pedido</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label className="form-label">Código de seguimiento</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ingresa tu código de seguimiento"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Buscar</button>
              </form>
              {trackingCode && (
                <div className="mt-3">
                  <p>Estado actual: <span className="text-warning">En tránsito</span></p>
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{width: '70%'}}>
                      70%
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sección Idioma */}
          {activeSection === 'idioma' && (
            <div className="section">
              <h3>Idioma</h3>
              <form onSubmit={handleLanguageSubmit}>
                <div className="mb-3">
                  <label className="form-label">Seleccionar idioma</label>
                  <select 
                    className="form-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </form>
              {showSavedMessage === 'idioma' && (
                <div className="mt-3 text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Idioma guardado!
                </div>
              )}
            </div>
          )}

          {/* Sección Soporte */}
          {activeSection === 'soporte' && (
            <div className="section">
              <h3>Soporte</h3>
              <form onSubmit={handleSupportSubmit}>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Describe tu consulta o problema"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Enviar consulta</button>
              </form>
              {showSavedMessage === 'soporte' && (
                <div className="mt-3 text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  ¡Mensaje enviado! Nuestro equipo responderá en menos de 24 horas.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
