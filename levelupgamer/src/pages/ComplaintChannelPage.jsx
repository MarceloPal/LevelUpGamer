import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ComplaintChannelPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    complaintType: '',
    description: '',
    anonymous: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí se enviaría al backend
    console.log('Denuncia enviada:', formData);
    
    toast.success('Su denuncia ha sido recibida. Será procesada de manera confidencial.');
    
    // Resetear formulario
    setFormData({
      name: '',
      email: '',
      phone: '',
      complaintType: '',
      description: '',
      anonymous: false
    });
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Canal de Denuncias</li>
            </ol>
          </nav>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="mb-4 text-center">Canal de Denuncias</h1>
              <p className="text-muted text-center mb-5">
                Este canal está disponible para reportar cualquier irregularidad o conducta inapropiada
              </p>

              <section className="mb-5">
                <h2 className="h4 mb-3">Sobre este Canal</h2>
                <p>
                  Level-Up Gamer está comprometido con la ética y la transparencia. Este canal de denuncias
                  permite a empleados, clientes y proveedores reportar de manera confidencial cualquier
                  irregularidad o conducta que viole nuestros principios éticos.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">Qué puede denunciar:</h2>
                <ul>
                  <li>Fraude o malversación de fondos</li>
                  <li>Corrupción o soborno</li>
                  <li>Acoso laboral o discriminación</li>
                  <li>Violación de normativas o políticas internas</li>
                  <li>Conflictos de interés</li>
                  <li>Prácticas comerciales desleales</li>
                  <li>Otras conductas no éticas</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">Confidencialidad y Protección</h2>
                <div className="alert alert-info">
                  <p className="mb-2">
                    <i className="bi bi-shield-check me-2"></i>
                    <strong>Su denuncia será tratada con estricta confidencialidad.</strong>
                  </p>
                  <ul className="mb-0">
                    <li>Todas las denuncias son investigadas por personal autorizado</li>
                    <li>Puede realizar denuncias de forma anónima</li>
                    <li>No se permitirán represalias contra denunciantes de buena fe</li>
                    <li>La información será utilizada únicamente para investigar el caso reportado</li>
                  </ul>
                </div>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">Formulario de Denuncia</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="anonymous"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="anonymous">
                      Realizar denuncia anónima
                    </label>
                  </div>

                  {!formData.anonymous && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre Completo *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required={!formData.anonymous}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required={!formData.anonymous}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Teléfono (opcional)</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label htmlFor="complaintType" className="form-label">Tipo de Denuncia *</label>
                    <select
                      className="form-select"
                      id="complaintType"
                      name="complaintType"
                      value={formData.complaintType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="fraude">Fraude o malversación</option>
                      <option value="corrupcion">Corrupción o soborno</option>
                      <option value="acoso">Acoso o discriminación</option>
                      <option value="normativas">Violación de normativas</option>
                      <option value="conflicto">Conflicto de interés</option>
                      <option value="comercial">Prácticas comerciales desleales</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción de los Hechos *</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="6"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Por favor, describa los hechos con el mayor detalle posible: qué, quién, cuándo, dónde y cómo ocurrió."
                      required
                    ></textarea>
                    <small className="text-muted">
                      Incluya fechas, nombres, lugares y cualquier evidencia que pueda respaldar su denuncia.
                    </small>
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                      <i className="bi bi-send me-2"></i>
                      Enviar Denuncia
                    </button>
                    <Link to="/" className="btn btn-outline-secondary btn-lg px-5">
                      <i className="bi bi-x-lg me-2"></i>
                      Cancelar
                    </Link>
                  </div>
                </form>
              </section>

              <section className="mb-3">
                <h2 className="h4 mb-3">Otros Canales de Contacto</h2>
                <div className="bg-light p-3 rounded">
                  <p><strong>Email:</strong> denuncias@levelupgamer.cl</p>
                  <p><strong>Teléfono:</strong> +56 2 1234 5679 (Línea de ética - confidencial)</p>
                  <p className="mb-0"><strong>Correo Postal:</strong> Av. Libertador Bernardo O'Higgins 1234, Santiago - Att: Comité de Ética</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintChannelPage;
