import { Link } from 'react-router-dom';

const LegalBasesPage = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Bases Legales</li>
            </ol>
          </nav>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="mb-4 text-center">Bases Legales</h1>
              <p className="text-muted text-center mb-5">Última actualización: Diciembre 2025</p>

              <section className="mb-5">
                <h2 className="h4 mb-3">1. Información de la Empresa</h2>
                <div className="bg-light p-3 rounded">
                  <p><strong>Razón Social:</strong> Level-Up Gamer SpA</p>
                  <p><strong>RUT:</strong> 76.XXX.XXX-X</p>
                  <p><strong>Giro Comercial:</strong> Comercio al por menor de artículos electrónicos y gaming</p>
                  <p><strong>Dirección:</strong> Av. Libertador Bernardo O'Higgins 1234, Santiago, Chile</p>
                  <p className="mb-0"><strong>Email:</strong> legal@levelupgamer.cl</p>
                </div>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">2. Marco Legal Aplicable</h2>
                <p>
                  Level-Up Gamer opera bajo el marco legal de la República de Chile, cumpliendo con:
                </p>
                <ul>
                  <li>Ley N° 19.496 sobre Protección de los Derechos de los Consumidores</li>
                  <li>Ley N° 19.628 sobre Protección de la Vida Privada</li>
                  <li>Ley N° 20.009 sobre el Comercio Electrónico</li>
                  <li>Código Civil de Chile</li>
                  <li>Código de Comercio</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">3. Derechos del Consumidor</h2>
                <p>
                  En conformidad con la Ley de Protección al Consumidor, todos nuestros clientes tienen derecho a:
                </p>
                <ul>
                  <li>Recibir información veraz y oportuna sobre los productos</li>
                  <li>No ser discriminados arbitrariamente por parte de proveedores</li>
                  <li>Derecho a retracto dentro de 10 días corridos desde la recepción del producto</li>
                  <li>Garantía legal de 3 meses (bienes nuevos) o 2 meses (bienes usados)</li>
                  <li>Reparación gratuita del bien, su reposición o devolución de la cantidad pagada</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">4. Programa de Fidelización</h2>
                <p>
                  El programa de puntos Level-Up se rige por las siguientes bases:
                </p>
                <ul>
                  <li>La acumulación de puntos es personal e intransferible</li>
                  <li>1 punto = $100 CLP en compras</li>
                  <li>Los puntos tienen una vigencia de 12 meses desde su acumulación</li>
                  <li>Los puntos pueden canjearse por descuentos en futuras compras</li>
                  <li>Level-Up Gamer se reserva el derecho de modificar las condiciones del programa con previo aviso</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">5. Garantías</h2>
                <p>
                  Todos los productos vendidos incluyen:
                </p>
                <ul>
                  <li><strong>Garantía Legal:</strong> Según lo establecido por la Ley del Consumidor</li>
                  <li><strong>Garantía del Fabricante:</strong> Según especificaciones de cada producto</li>
                  <li><strong>Garantía de Satisfacción:</strong> 30 días para devolución sin preguntas</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">6. Resolución de Conflictos</h2>
                <p>
                  En caso de controversia o conflicto derivado de la compra de productos o servicios:
                </p>
                <ol>
                  <li>Se intentará resolver amistosamente a través de nuestro servicio de atención al cliente</li>
                  <li>Se puede recurrir al SERNAC (Servicio Nacional del Consumidor)</li>
                  <li>Como última instancia, se someterán a la jurisdicción de los tribunales ordinarios de justicia de Santiago, Chile</li>
                </ol>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">7. Jurisdicción y Ley Aplicable</h2>
                <p>
                  Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia
                  se someterá a la jurisdicción de los tribunales competentes de Santiago, Chile.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-3">8. SERNAC</h2>
                <div className="alert alert-info">
                  <p className="mb-2">
                    <strong>Para información y atención de consultas o reclamos, contacte a:</strong>
                  </p>
                  <p className="mb-1">SERNAC (Servicio Nacional del Consumidor)</p>
                  <p className="mb-1">Teléfono: 800 700 100</p>
                  <p className="mb-1">Web: www.sernac.cl</p>
                  <p className="mb-0">Email: contacto@sernac.cl</p>
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

export default LegalBasesPage;
