import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState(() => {
    return searchParams.get('section') || 'editar';
  });

  // Estados para los formularios
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addresses: user?.addresses || []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  // Cargar datos del perfil desde el backend
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const result = await userService.getProfile();
        if (result.success) {
          const userData = result.user;
          setProfileForm({
            name: userData.nombre || userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            addresses: userData.addresses || []
          });
        } else {
          console.error('Error al cargar perfil:', result.message);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/perfil?section=${section}`, { replace: true });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      const result = await userService.updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        addresses: profileForm.addresses
      });

      if (result.success) {
        toast.success('Perfil actualizado exitosamente');
        
        // Actualizar el usuario en el contexto de autenticación
        updateUserData({
          name: result.user.nombre || result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          addresses: result.user.addresses
        });
        
        setShowSavedMessage('perfil');
        setTimeout(() => setShowSavedMessage(''), 3000);
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = () => {
    setProfileForm({
      ...profileForm,
      addresses: [
        ...profileForm.addresses,
        {
          alias: '',
          direccion: '',
          comuna: '',
          region: '',
          isDefault: profileForm.addresses.length === 0
        }
      ]
    });
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = profileForm.addresses.filter((_, i) => i !== index);
    setProfileForm({
      ...profileForm,
      addresses: newAddresses
    });
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...profileForm.addresses];
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value
    };
    setProfileForm({
      ...profileForm,
      addresses: newAddresses
    });
  };

  const handleSetDefaultAddress = (index) => {
    const newAddresses = profileForm.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    setProfileForm({
      ...profileForm,
      addresses: newAddresses
    });
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
   // { id: 1, product: 'Mouse Gaming G502 HERO', status: 'Entregado', statusClass: 'text-success' },
   // { id: 2, product: 'Teclado Mecánico RGB', status: 'En camino', statusClass: 'text-warning' },
   // { id: 3, product: 'Silla Gaming Titan Evo', status: 'Pendiente', statusClass: 'text-danger' }
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
              
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        required 
                        disabled={isSaving}
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
                        disabled={isSaving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        placeholder="+56 9 1234 5678"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rol</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={user?.role || 'customer'}
                        disabled
                        readOnly
                      />
                      <small className="text-muted">El rol no puede ser modificado</small>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Direcciones</h5>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-primary"
                        onClick={handleAddAddress}
                        disabled={isSaving}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Agregar Dirección
                      </button>
                    </div>
                    
                    {profileForm.addresses && profileForm.addresses.length > 0 ? (
                      <div className="addresses-list">
                        {profileForm.addresses.map((address, index) => (
                          <div key={index} className="card mb-3">
                            <div className="card-body">
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Alias</label>
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={address.alias || ''}
                                    onChange={(e) => handleAddressChange(index, 'alias', e.target.value)}
                                    placeholder="Casa, Trabajo, etc."
                                    disabled={isSaving}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Dirección</label>
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={address.direccion || ''}
                                    onChange={(e) => handleAddressChange(index, 'direccion', e.target.value)}
                                    placeholder="Calle y número"
                                    disabled={isSaving}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Comuna</label>
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={address.comuna || ''}
                                    onChange={(e) => handleAddressChange(index, 'comuna', e.target.value)}
                                    placeholder="Santiago"
                                    disabled={isSaving}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Región</label>
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={address.region || ''}
                                    onChange={(e) => handleAddressChange(index, 'region', e.target.value)}
                                    placeholder="Región Metropolitana"
                                    disabled={isSaving}
                                  />
                                </div>
                                <div className="col-12">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check">
                                      <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        checked={address.isDefault || false}
                                        onChange={() => handleSetDefaultAddress(index)}
                                        id={`defaultAddress${index}`}
                                        disabled={isSaving}
                                      />
                                      <label className="form-check-label" htmlFor={`defaultAddress${index}`}>
                                        Dirección principal
                                      </label>
                                    </div>
                                    <button 
                                      type="button" 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleRemoveAddress(index)}
                                      disabled={isSaving}
                                    >
                                      <i className="bi bi-trash"></i> Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        No tienes direcciones guardadas. Haz clic en "Agregar Dirección" para añadir una.
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary mt-3"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </button>
                </form>
              )}
              
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
