import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Política de Privacidad</li>
            </ol>
          </nav>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="mb-4 text-center">Política de Privacidad</h1>
              <p className="text-muted text-center mb-5">Última actualización: Diciembre 2025</p>

              <section className="mb-5">
                <h2 className="h4 mb-3">1. Introducción</h2>
                <p>
                  En Level-Up Gamer, nos comprometemos a proteger su privacidad. Esta Política de Privacidad
                  explica cómo recopilamos, usamos, divulgamos y protegemos su información personal cuando
                  utiliza nuestro sitio web y servicios.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">2. Información que Recopilamos</h2>
                <h3 className="h5 mb-2">2.1 Información Personal</h3>
                <p>Recopilamos la siguiente información personal cuando usted:</p>
                <ul>
                  <li><strong>Crea una cuenta:</strong> nombre, email, contraseña, teléfono</li>
                  <li><strong>Realiza una compra:</strong> dirección de envío, información de pago</li>
                  <li><strong>Contacta atención al cliente:</strong> nombre, email, contenido del mensaje</li>
                  <li><strong>Participa en el programa de puntos:</strong> historial de compras, preferencias</li>
                </ul>

                <h3 className="h5 mb-2 mt-4">2.2 Información Técnica</h3>
                <p>Automáticamente recopilamos:</p>
                <ul>
                  <li>Dirección IP</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Páginas visitadas y tiempo de navegación</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">3. Cómo Usamos su Información</h2>
                <p>Utilizamos la información recopilada para:</p>
                <ul>
                  <li>Procesar y gestionar sus pedidos</li>
                  <li>Administrar su cuenta y el programa de fidelización</li>
                  <li>Mejorar nuestros productos y servicios</li>
                  <li>Enviar comunicaciones sobre pedidos y promociones (con su consentimiento)</li>
                  <li>Prevenir fraudes y garantizar la seguridad del sitio</li>
                  <li>Cumplir con obligaciones legales</li>
                  <li>Realizar análisis y estudios de mercado</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">4. Compartir Información</h2>
                <p>
                  No vendemos su información personal. Podemos compartir su información con:
                </p>
                <ul>
                  <li><strong>Proveedores de servicios:</strong> procesamiento de pagos, envío de productos</li>
                  <li><strong>Socios comerciales:</strong> solo con su consentimiento explícito</li>
                  <li><strong>Autoridades:</strong> cuando sea requerido por ley</li>
                  <li><strong>Terceros en caso de fusión o adquisición:</strong> previa notificación</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">5. Cookies y Tecnologías de Seguimiento</h2>
                <p>
                  Utilizamos cookies para mejorar su experiencia en nuestro sitio. Las cookies son pequeños
                  archivos de texto almacenados en su dispositivo que nos ayudan a:
                </p>
                <ul>
                  <li>Recordar sus preferencias</li>
                  <li>Mantener su sesión activa</li>
                  <li>Analizar el tráfico del sitio</li>
                  <li>Personalizar contenido y anuncios</li>
                </ul>
                <p>
                  Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">6. Seguridad de Datos</h2>
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal:
                </p>
                <ul>
                  <li>Encriptación SSL/TLS para transmisión de datos</li>
                  <li>Almacenamiento seguro de contraseñas (hash)</li>
                  <li>Acceso restringido a información personal</li>
                  <li>Auditorías de seguridad regulares</li>
                  <li>Cumplimiento con estándares de la industria</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">7. Sus Derechos</h2>
                <p>
                  De acuerdo con la Ley N° 19.628 sobre Protección de Datos Personales, usted tiene derecho a:
                </p>
                <ul>
                  <li><strong>Acceder:</strong> solicitar una copia de sus datos personales</li>
                  <li><strong>Rectificar:</strong> corregir datos inexactos o incompletos</li>
                  <li><strong>Eliminar:</strong> solicitar la eliminación de sus datos</li>
                  <li><strong>Oponerse:</strong> rechazar ciertos usos de sus datos</li>
                  <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado</li>
                  <li><strong>Retirar consentimiento:</strong> en cualquier momento</li>
                </ul>
                <p>
                  Para ejercer estos derechos, contacte a: privacidad@levelupgamer.cl
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">8. Retención de Datos</h2>
                <p>
                  Conservamos su información personal solo durante el tiempo necesario para cumplir con los
                  propósitos descritos en esta política, salvo que la ley requiera o permita un período de
                  retención más largo.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">9. Menores de Edad</h2>
                <p>
                  Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos
                  intencionalmente información de menores de edad sin el consentimiento de sus padres o tutores.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">10. Enlaces a Terceros</h2>
                <p>
                  Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables de las
                  prácticas de privacidad de estos sitios y le recomendamos revisar sus políticas de privacidad.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">11. Cambios a esta Política</h2>
                <p>
                  Nos reservamos el derecho de actualizar esta Política de Privacidad. Los cambios significativos
                  serán notificados por email o mediante un aviso destacado en nuestro sitio.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">12. Contacto</h2>
                <div className="bg-light p-3 rounded">
                  <p className="mb-2">
                    Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos:
                  </p>
                  <p><strong>Email:</strong> privacidad@levelupgamer.cl</p>
                  <p><strong>Teléfono:</strong> +56 2 1234 5678</p>
                  <p className="mb-0"><strong>Dirección:</strong> Av. Libertador Bernardo O'Higgins 1234, Santiago, Chile</p>
                </div>
              </section>

              <div className="text-center mt-5">
                <Link to="/" className="btn btn-primary">
                  <i className="bi bi-house me-2"></i>
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
