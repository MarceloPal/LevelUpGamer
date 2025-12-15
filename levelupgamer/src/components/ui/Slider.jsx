import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

const Slider = () => {
  return (
    <div className="swiper-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="mySwiper"
      >
        <SwiperSlide>
          <Link to="/catalogo?section=accesorios">
            <img
              src="/img_slide/razer.webp"
              alt="Slide 1"
              className="w-100"
            />
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link to="/catalogo?section=sillas">
            <img
              src="/img_slide/BANNER-COUGAR1.webp"
              alt="Slide 2"
              className="w-100"
            />
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link to="/catalogo?section=computadores">
            <img
              src="/img_slide/Banner-1-1.webp"
              alt="Slide 3"
              className="w-100"
            />
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Slider;
