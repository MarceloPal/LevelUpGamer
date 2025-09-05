const links = document.querySelectorAll('.profile-sidebar .nav-link');
const sections = document.querySelectorAll('.profile-content .section');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Quitar active de todos los links
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Mostrar la sección correspondiente
    const target = link.getAttribute('data-section');
    sections.forEach(sec => {
      if (sec.id === target) {
        sec.classList.remove('d-none');
      } else {
        sec.classList.add('d-none');
      }
    });
  });
});

// script SLIDES
document.addEventListener('DOMContentLoaded', function () {
	if (typeof Swiper !== 'undefined') {
		var swiper = new Swiper(".mySwiper", {
			spaceBetween: 30,
			centeredSlides: true,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false,
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
		});
	}
});
