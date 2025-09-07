/* ==========================
  Filtrado de Secciones del Catálogo
========================== */

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

/* ==========================
  Formulario de Login y Registro
========================== */

  function mostrarRegistro() {
    document.getElementById("loginForm").classList.add("d-none");
    document.getElementById("registerForm").classList.remove("d-none");
    document.getElementById("forgetPasswordForm").classList.add("d-none");
  }

  function mostrarLogin() {
    document.getElementById("registerForm").classList.add("d-none");
    document.getElementById("loginForm").classList.remove("d-none");
    document.getElementById("forgetPasswordForm").classList.add("d-none");
  }
  
function mostrarForgetPassword() {
    document.getElementById("loginForm").classList.add("d-none");
    document.getElementById("registerForm").classList.add("d-none");
    document.getElementById("forgetPasswordForm").classList.remove("d-none");
}
  
/* ==========================
  // Perfil de usuario
========================== */

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

// Modificacion del perfil
document.addEventListener('DOMContentLoaded', function () {
  const perfilForm = document.getElementById('perfilForm');
  const nombre = document.getElementById('nombre');
  const celular = document.getElementById('celular');
  const email = document.getElementById('email');
  const direccion = document.getElementById('direccion');
  const perfilGuardado = document.getElementById('perfilGuardado');

  // Cargar datos guardados si existen
  if (localStorage.getItem('perfil')) {
    const datos = JSON.parse(localStorage.getItem('perfil'));
    nombre.value = datos.nombre;
    celular.value = datos.celular;
    email.value = datos.email;
    direccion.value = datos.direccion;
  }

  perfilForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Guardar datos en localStorage
    const datos = {
      nombre: nombre.value,
      celular: celular.value,
      email: email.value,
      direccion: direccion.value
    };
    localStorage.setItem('perfil', JSON.stringify(datos));
    perfilGuardado.classList.remove('d-none');
    setTimeout(() => perfilGuardado.classList.add('d-none'), 2000);
  });
});

// Guardar idioma seleccionado en la pestaña Idioma
function setupIdiomaForm() {
  const idiomaForm = document.getElementById('idiomaForm');
  const idiomaSelect = document.getElementById('idioma-select');
  const idiomaGuardado = document.getElementById('idiomaGuardado');

  // Cargar idioma guardado si existe
  if (localStorage.getItem('idioma')) {
    idiomaSelect.value = localStorage.getItem('idioma');
  }

  if (idiomaForm) {
    idiomaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      localStorage.setItem('idioma', idiomaSelect.value);
      idiomaGuardado.classList.remove('d-none');
      setTimeout(() => idiomaGuardado.classList.add('d-none'), 2000);
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setupIdiomaForm();
});

// Guardar mensaje de soporte en la pestaña Soporte
function setupSoporteForm() {
  const soporteForm = document.querySelector('#soporte form');
  const mensajeSoporte = document.getElementById('mensaje-soporte');
  const soporteGuardado = document.createElement('div');
  soporteGuardado.className = 'mt-3 text-success';
  soporteGuardado.id = 'soporteGuardado';
  soporteGuardado.classList.add('d-none');
  soporteGuardado.textContent = '¡Consulta enviada!';
  soporteForm.parentNode.insertBefore(soporteGuardado, soporteForm.nextSibling);

  if (soporteForm) {
    soporteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      localStorage.setItem('soporteMensaje', mensajeSoporte.value);
      soporteGuardado.classList.remove('d-none');
      setTimeout(() => soporteGuardado.classList.add('d-none'), 2000);
      mensajeSoporte.value = '';
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setupSoporteForm();
});

// Funcionalidad para la sección de Cerrar Sesión
function setupCerrarSesion() {
  const btnCerrarSesion = document.querySelector('#cerrar .btn-danger');
  const cerrarGuardado = document.createElement('div');
  cerrarGuardado.className = 'mt-3 text-success';
  cerrarGuardado.id = 'cerrarGuardado';
  cerrarGuardado.classList.add('d-none');
  cerrarGuardado.textContent = '¡Sesión cerrada!';
  btnCerrarSesion.parentNode.insertBefore(cerrarGuardado, btnCerrarSesion.nextSibling);

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', function () {
      // Limpiar datos guardados
      localStorage.removeItem('perfil');
      localStorage.removeItem('idioma');
      localStorage.removeItem('soporteMensaje');
      cerrarGuardado.classList.remove('d-none');
      setTimeout(() => {
        cerrarGuardado.classList.add('d-none');
        location.reload();
      }, 1500);
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setupCerrarSesion();
});

// ---------------------------------------------------------

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

