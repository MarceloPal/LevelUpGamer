import { Link } from 'react-router-dom';
import Slider from "../components/ui/Slider";
import BrandCarousel from "../components/ui/BrandCarousel";
import CurrencyBanner from "../components/ui/CurrencyBanner";

const HomePage = () => {
  return (
    <main className="container-fluid bg-light p-0">
      {/*SLIDER PRINCIPAL */}
      <Slider />
      
      {/* Banner de tasas de cambio */}
      <CurrencyBanner />

      {/* bnanner divisorio */}
      <div className="divider-img-wrapper mb-5">
        <Link to="/catalogo?section=mousepad">
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
        </Link>
      </div>

      {/*Sección de bienvenida */}
      <section className="welcome-section container my-4 my-md-5 px-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 text-center">
            <h1 className="welcome-title mb-3 mb-md-4">Bienvenido a Level-Up</h1>
            <p className="welcome-text">
              Aquí encontrarás juegos, accesorios y mucho más para gamers como tú.
            </p>
          </div>
        </div>
      </section>

      {/* bnanner divisorio */}
      <div className="divider-img-wrapper mb-5">
        <Link to="/catalogo?section=computadores">
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
        </Link>
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
            <Link to="/catalogo?section=computadores">
              <img
                src="/img/Desktop_QuadBannerSectionLeft_0dd197a7.webp"
                className="img-fluid h-img-side h-100"
                alt="Izquierda"
              />
            </Link>
          </div>

          <div className="col-12 col-md-6 d-flex flex-column justify-content-between align-items-center">
            <Link to="/catalogo?section=accesorios" className="w-100">
              <img
                src="/img/Desktop_QuadBannerSectionTop_e3cf4d67.webp"
                className="img-fluid h-img-center mb-1"
                alt="Centro Arriba"
              />
            </Link>
            <Link to="/catalogo?section=mouse" className="w-100">
              <img
                src="/img/Desktop_QuadBannerSectionBotton_106a1e9b.webp"
                className="img-fluid h-img-center mt-1"
                alt="Centro Abajo"
              />
            </Link>
          </div>

          <div className="col-3 d-none d-md-flex justify-content-center align-items-stretch">
            <Link to="/catalogo?section=consolas">
              <img
                src="/img/Desktop_QuadBannerSectionRight_b24d4dd5.webp"
                className="img-fluid h-img-side h-100"
                alt="Derecha"
              />
            </Link>
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
