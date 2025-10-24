import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-gamer">
      <div className="footer-gradient-border"></div>
      
      <div className="container py-5">
        <div className="row g-4">
          
          {/* Columna 1: Marca y descripción */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-brand">
              <div className="d-flex align-items-center mb-3">
                <img src="/img/coin-cropped.png" alt="Logo" className="footer-logo me-2" />
                <h3 className="footer-title mb-0">Level-Up Gamer</h3>
              </div>
              <p className="footer-description">
                Tu tienda online dedicada a la comunidad gamer. Ofrecemos juegos, accesorios y equipos 
                de la mejor calidad para que vivas al máximo tu experiencia de juego.
              </p>
              <div className="footer-tagline">
                ¡Sube de nivel con nosotros!
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h4 className="footer-heading">Navegación</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/puntos">Puntos</Link></li>
              <li><Link to="/perfil">Mi Perfil</Link></li>
            </ul>
          </div>

          {/* Columna 3: Información legal */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h4 className="footer-heading">Información Legal</h4>
            <ul className="footer-links">
              <li><a href="#terminos">Términos y Condiciones</a></li>
              <li><a href="#bases">Bases Legales</a></li>
              <li><a href="#denuncias">Canal de Denuncias</a></li>
              <li><a href="#privacidad">Política de Privacidad</a></li>
            </ul>
          </div>

          {/* Columna 4: Redes sociales y contacto */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h4 className="footer-heading">Síguenos</h4>
            <div className="footer-social-grid">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <img src="/img/Logo-Social-Media-Facebook-Circle--Streamline-Pixel.svg" alt="Facebook" />
                <span>Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <img src="/img/Logo-Social-Media-Twitter-Circle--Streamline-Pixel.svg" alt="Twitter" />
                <span>Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <img src="/img/Logo-Social-Media-Instagram--Streamline-Pixel.svg" alt="Instagram" />
                <span>Instagram</span>
              </a>
              <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <img src="/img/Logo-Whatapp--Streamline-Pixel.svg" alt="WhatsApp" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider con efecto glow */}
        <div className="footer-divider"></div>

        {/* Bottom: Award y Copyright */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            </div>
            <div className="col-md-4 text-center mb-3 mb-md-0">
              <p className="footer-copyright mb-0">
                <span className="copyright-icon">©</span> 2025 Level-Up Gamer
              </p>
              <p className="footer-made-with mb-0">
                Hecho con <span className="heart">💜</span> para gamers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
