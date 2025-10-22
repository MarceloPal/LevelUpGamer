import Slider from "../components/ui/Slider";
import BrandCarousel from "../components/ui/BrandCarousel";

const HomePage = () => {
  return (
    <main className="container-fluid bg-light p-0">
      {/*SLIDER PRINCIPAL */}
      <Slider />

      {/* bnanner divisorio */}
      <div className="divider-img-wrapper mb-5">
        <a href="/catalogo?section=mousepad">
          <img
            src="/img/Desktop_MainCampaignCountdown_Liquidacion_Abril_2025_4662806b.webp"
            alt="Divisor"
            className="divider-img d-none d-md-block"
          />
          <img
            src="/img/Desktop_MainCampaignCountdown_Liquidacion_Abril_2025_22222.png"
            alt="Divisor móvil"
            className="divider-img-mobile d-block d-md-none"
          />
        </a>
      </div>

      {/*Sección de bienvenida */}
      <section className="container my-5 d-flex justify-content-center align-items-center">
        <div className="col-md-6 text-center">
          <h1 className="mb-4 text-dark">Bienvenido a Level-Up</h1>
          <p className="text-dark">
            Aquí encontrarás juegos, accesorios y mucho más <br /> para gamers
            como tú.
          </p>
          <a href="/catalogo" className="btn2 text-decoration-none">
            Explorar catálogo
          </a>
        </div>
      </section>

      {/* bnanner divisorio */}
      <div className="divider-img-wrapper mb-5">
        <a href="/catalogo?section=computadores">
          <img
            src="/img/Desktop_MainCampaign_Nvidia_RTX-Serie-50_v2_Marzo_25_cc0c723a.webp"
            alt="Divisor"
            className="divider-img d-none d-md-block"
          />
          <img
            src="/img/Desktop_MainCampaign_Nvidia_RTX-Serie-50_v2_Marzo_25_2222222.jpg"
            alt="Divisor móvil"
            className="divider-img-mobile d-block d-md-none"
          />
        </a>
      </div>

      {/*Sección: Descubre nuevas categorías */}
      <section className="container mb-5">
        <div className="divider-img-wrapper-2 text-center">
          <h2 className="text-dark border-bottom border-warning pb-2 d-inline-block">
            Descubre Nuevas Categorías
          </h2>
        </div>

        <div className="row h-img-container align-items-stretch" style={{ minHeight: "320px" }}>
          <div className="col-3 d-none d-md-flex justify-content-center align-items-stretch">
            <a href="/catalogo?section=computadores">
              <img
                src="/img/Desktop_QuadBannerSectionLeft_0dd197a7.webp"
                className="img-fluid h-img-side h-100"
                alt="Izquierda"
              />
            </a>
          </div>

          <div className="col-12 col-md-6 d-flex flex-column justify-content-between align-items-center">
            <a href="/catalogo?section=computadores">
              <img
                src="/img/Desktop_QuadBannerSectionTop_e3cf4d67.webp"
                className="img-fluid h-img-center mb-1"
                alt="Centro Arriba"
              />
              <img
                src="/img/Desktop_QuadBannerSectionBotton_106a1e9b.webp"
                className="img-fluid h-img-center mt-1"
                alt="Centro Abajo"
              />
            </a>
          </div>

          <div className="col-3 d-none d-md-flex justify-content-center align-items-stretch">
            <a href="/catalogo?section=consolas">
              <img
                src="/img/Desktop_QuadBannerSectionRight_b24d4dd5.webp"
                className="img-fluid h-img-side h-100"
                alt="Derecha"
              />
            </a>
          </div>
        </div>
      </section>

      {/*Carrusel de marcas */}
      <section className="container mb-5">
        <div className="divider-img-wrapper-2 text-center">
          <h2 className="text-dark border-bottom border-warning pb-2 d-inline-block">
            Mejores Marcas
          </h2>
        </div>
        <BrandCarousel />
      </section>
    </main>
  );
};

export default HomePage;
