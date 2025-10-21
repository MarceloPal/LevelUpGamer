//Ui contiene componentes visuales reutilizables en varias partes de la web
//como este carrusel de marcas
//que puede aparecer en la pagina de inicio o en otras secciones
//pero no son como un layout completo o una pagina entera, como el navbar o el footer.

const BrandCarousel = () => {
  return (
    <div id="carouselMejoresMarcas" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="row text-center">
            <div className="col-3">
              <img
                src="/img/img_mejores-marcas/Desktop_BrandCarousel1_141c03ea.webp"
                className="img-fluid px-2"
                alt="Marca 1"
              />
            </div>
            <div className="col-3">
              <img
                src="/img/img_mejores-marcas/Desktop_BrandCarousel2_MSI_f69b11df.webp"
                className="img-fluid px-2"
                alt="Marca 2"
              />
            </div>
            <div className="col-3">
              <img
                src="/img/img_mejores-marcas/Desktop_BrandCarousel3_7fa5bf77.webp"
                className="img-fluid px-2"
                alt="Marca 3"
              />
            </div>
            <div className="col-3">
              <img
                src="/img/img_mejores-marcas/Desktop_BrandCarousel4_76197ebc.webp"
                className="img-fluid px-2"
                alt="Marca 4"
              />
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <div className="row text-center">
            <div className="col-3">
              <img
                src="/img/img_mejores-marcas/Desktop_BrandCarousel5_5b9eb565.webp"
                className="img-fluid px-2"
                alt="Marca 5"
              />
            </div>
            <div className="col-3">
              <img
                src="/img/img_mejores-marcas/Desktop_BrandCarousel6_541f8743.webp"
                className="img-fluid px-2"
                alt="Marca 6"
              />
            </div>
            <div className="col-3">
              <img
                src="/img/img_mejores-marcas/Desktop_BrandCarousel7_37cfc146.webp"
                className="img-fluid px-2"
                alt="Marca 7"
              />
            </div>
            <div className="col-3">
              <img
                src="/img/img_mejores-marcas/Desktop_BrandCarousel8_9d86c2fc.webp"
                className="img-fluid px-2"
                alt="Marca 8"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselMejoresMarcas"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselMejoresMarcas"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
};

export default BrandCarousel;
