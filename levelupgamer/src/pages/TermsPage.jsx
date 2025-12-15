import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Términos y Condiciones</li>
            </ol>
          </nav>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="mb-4 text-center">Términos y Condiciones</h1>
              <p className="text-muted text-center mb-5">Última actualización: Diciembre 2025</p>

              <section className="mb-5">
                <h2 className="h4 mb-3">1. Aceptación de los Términos</h2>
                <p>
                  Al acceder y utilizar Level-Up Gamer, usted acepta estar sujeto a estos Términos y Condiciones de uso,
                  todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de todas las leyes locales aplicables.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">2. Uso del Sitio</h2>
                <p>
                  Este sitio web está destinado para el uso de compra de productos gaming y accesorios relacionados.
                  Está prohibido usar el sitio para:
                </p>
                <ul>
                  <li>Cualquier propósito ilegal</li>
                  <li>Realizar transacciones fraudulentas</li>
                  <li>Violar cualquier regulación internacional, federal, provincial o estatal</li>
                  <li>Infringir o violar nuestros derechos de propiedad intelectual</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">3. Política de Compras</h2>
                <p>
                  Todas las compras realizadas en Level-Up Gamer están sujetas a disponibilidad de stock.
                  Nos reservamos el derecho de limitar las cantidades de cualquier producto o servicio que ofrecemos.
                </p>
                <p>
                  Los precios están sujetos a cambios sin previo aviso. Todos los precios se muestran en pesos chilenos (CLP)
                  a menos que se indique lo contrario.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">4. Cuentas de Usuario</h2>
                <p>
                  Al crear una cuenta en nuestro sitio, usted es responsable de mantener la seguridad de su cuenta
                  y contraseña. Level-Up Gamer no se hace responsable de ninguna pérdida o daño derivado de su
                  incumplimiento de esta obligación de seguridad.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">5. Envíos y Entregas</h2>
                <p>
                  Los plazos de entrega son estimados y pueden variar según la disponibilidad del producto y la ubicación de entrega.
                  Level-Up Gamer no se hace responsable por retrasos en la entrega causados por circunstancias fuera de nuestro control.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">6. Política de Devoluciones</h2>
                <p>
                  Los productos pueden ser devueltos dentro de los 30 días posteriores a la recepción, siempre que estén
                  en su empaque original, sin usar y en perfectas condiciones. Los costos de envío de devolución son
                  responsabilidad del cliente, excepto en casos de productos defectuosos o errores en el envío.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">7. Limitación de Responsabilidad</h2>
                <p>
                  Level-Up Gamer no será responsable por ningún daño indirecto, incidental, especial o consecuente
                  que resulte del uso o la imposibilidad de usar nuestros productos o servicios.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">8. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
                  Las modificaciones entrarán en vigencia inmediatamente después de su publicación en el sitio.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">9. Contacto</h2>
                <p>
                  Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos a través de:
                </p>
                <ul>
                  <li>Email: contacto@levelupgamer.cl</li>
                  <li>Teléfono: +56 2 1234 5678</li>
                </ul>
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

export default TermsPage;
