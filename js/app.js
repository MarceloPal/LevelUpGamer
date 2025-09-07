// Filtros de catálogo

const buttons = document.querySelectorAll('.catalogo-buttons .btn2');
const sections = document.querySelectorAll('.catalogo-content .section');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-section');
    sections.forEach(sec => {
      if (target === "todo") {
        sec.classList.remove('d-none');
      } else if (sec.id === target) {
        sec.classList.remove('d-none');
      } else {
        sec.classList.add('d-none');
      }
    });
  });
});


// Formulario de login y registro

function mostrarRegistro() {
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("registerForm").classList.remove("d-none");
}

function mostrarLogin() {
  document.getElementById("registerForm").classList.add("d-none");
  document.getElementById("loginForm").classList.remove("d-none");
}
  

// Perfil de usuario
const links = document.querySelectorAll('.profile-sidebar .nav-link');
const sections2 = document.querySelectorAll('.profile-content .section');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Quitar active de todos los links
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Mostrar la sección correspondiente
    const target = link.getAttribute('data-section');
    sections2.forEach(sec => {
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