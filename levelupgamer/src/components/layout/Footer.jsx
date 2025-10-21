//Layout son cosas que aparecen en todas las paginas como el footer y el navbar
import React from "react";

const Footer = () => {
  return (
    <div className="footer-dark bg-dark text-white border-top border-warning pt-5 pb-3 mt-auto">
      <footer>
        <div className="container">
          <div className="row">
            {/*Columna 1: Informaciones */}
            <div className="col-sm-6 col-md-3 item mb-4">
              <h3>Informaciones y Políticas</h3>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    Bases Legales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    Canal de Denuncias
                  </a>
                </li>
              </ul>
            </div>

            {/*Columna 2: Sobre nosotros */}
            <div className="col-sm-6 col-md-3 item mb-4">
              <h3>Sobre Nosotros</h3>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    Compañía
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-decoration-none">
                    Team
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Descripción */}
            <div className="col-md-6 item text mb-4">
              <h3>Level-Up Gamer</h3>
              <p className="text-light">
                Level-Up Gamer es una tienda online dedicada a la comunidad gamer.
                Ofrecemos juegos, accesorios y equipos de la mejor calidad para que
                vivas al máximo tu experiencia de juego. ¡Sube de nivel con nosotros!
              </p>
            </div>

            {/* Columna 4: Redes sociales */}
            <div className="col item social d-flex justify-content-center gap-3 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="/img/Logo-Social-Media-Facebook-Circle--Streamline-Pixel.svg"
                  alt="Facebook"
                  width="30"
                  height="30"
                />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="/img/Logo-Social-Media-Twitter-Circle--Streamline-Pixel.svg"
                  alt="Twitter"
                  width="30"
                  height="30"
                />
              </a>
              <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="/img/Logo-Whatapp--Streamline-Pixel.svg"
                  alt="WhatsApp"
                  width="30"
                  height="30"
                />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img
                  src="/img/Logo-Social-Media-Instagram--Streamline-Pixel.svg"
                  alt="Instagram"
                  width="30"
                  height="30"
                />
              </a>
            </div>
          </div>

          {/* Imagen de premio */}
          <div className="text-center mb-3">
            <img
              src="/img/commerceAward.webp"
              alt="Winners Commerce Awards"
              className="footer-award mx-auto d-block mb-3"
              style={{ maxWidth: "160px", width: "100%", height: "auto" }}
            />
          </div>

          {/* Copyright */}
          <p className="copyright text-center text-secondary mb-0">
            Level-Up Gamer © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
