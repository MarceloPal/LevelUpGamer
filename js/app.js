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

// Activar sección del catálogo según parámetro en la URL
function activarCatalogoPorURL() {
  const params = new URLSearchParams(window.location.search);
  const section = params.get('section');
  if (section) {
    const catalogButtons = document.querySelectorAll('.catalogo-buttons .btn2');
    const catalogSections = document.querySelectorAll('.catalogo-content .section');
    catalogButtons.forEach(btn => btn.classList.remove('active'));
    catalogSections.forEach(sec => sec.classList.add('d-none'));
    const targetBtn = document.querySelector(`.catalogo-buttons .btn2[data-section="${section}"]`);
    if (section === 'todo') {
      catalogSections.forEach(sec => sec.classList.remove('d-none'));
      if (targetBtn) targetBtn.classList.add('active');
    } else {
      const targetSection = document.getElementById(section);
      if (targetBtn && targetSection) {
        targetBtn.classList.add('active');
        targetSection.classList.remove('d-none');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  activarCatalogoPorURL();
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

// Activar sección de perfil según parámetro en la URL
function activarSeccionPorURL() {
  const params = new URLSearchParams(window.location.search);
  const section = params.get('section');
  if (section) {
    const sidebarLinks = document.querySelectorAll('.profile-sidebar .nav-link');
    const profileSections = document.querySelectorAll('.profile-content .section');
    sidebarLinks.forEach(link => link.classList.remove('active'));
    profileSections.forEach(sec => sec.classList.add('d-none'));
    const targetLink = document.querySelector(`.profile-sidebar .nav-link[data-section="${section}"]`);
    const targetSection = document.getElementById(section);
    if (targetLink && targetSection) {
      targetLink.classList.add('active');
      targetSection.classList.remove('d-none');
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  activarSeccionPorURL();
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


/*-------------------------
CARRITO DE COMPRAS
-------------------------------- */

/*
  Level-Up – app.js (Vanilla JS)
  Funcionalidades básicas sin dependencias:
  - Manejo de carrito (localStorage)
  - Render en sidebar (index.html)
  - Render en carrito.html
  - Agregar, sumar/restar, eliminar productos
*/

(() => {
  const STORAGE_KEY = "levelup_cart_v1"; //guarda el carrito en el localStorage

  // ==========================
  // Estado inicial
  // ==========================
  const initialState = {
    cart: [] // { id, nombre, precio, imagen, cantidad }
  };  // Estado inicial del carrito, si no hay nada en localStorage se inicia vacío.

  const loadState = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { ...initialState };
    } catch {
      return { ...initialState };
    }
  }; // Carga el estado del carrito desde localStorage, si no existe usa el estado inicial.



  // Guarda el estado del carrito en localStorage en formato JSON.
  const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  let state = loadState(); // Estado actual del carrito cargado desde localStorage.

  // ==========================
  // Helpers DOM y formateo (para selecionar elementos y formatear precios)
  // ==========================
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const formatPrice = (num) => "$" + num.toLocaleString("es-CL"); // Formatea números como precios en pesos chilenos.

  // ==========================
  // Carrito: lógica
  // ==========================

  // Agrega un producto al carrito o incrementa su cantidad si ya existe.
  const addToCart = (product) => {
    let existing = state.cart.find((p) => p.id === product.id);
    if (existing) {
      existing.cantidad++; // Si el producto ya está en el carrito, incrementa su cantidad.
    } else {
      state.cart.push({ ...product, cantidad: 1 }); // Si no está, lo agrega con cantidad 1.
    }
    saveState(); // Guarda el estado actualizado en localStorage.
    renderCart(); // Actualiza la visualización del carrito.
    toast("Producto añadido al carrito"); // Muestra un mensaje de confirmación.
  };

  // Actualiza la cantidad de un producto en el carrito. Si la cantidad llega a 0, lo elimina.
  const updateQuantity = (id, delta) => {
    let item = state.cart.find((p) => p.id === id);
    if (item) {
      item.cantidad += delta;
      if (item.cantidad <= 0) {
        state.cart = state.cart.filter((p) => p.id !== id);
      }
      saveState();
      renderCart();
    }
  };

  // Elimina un producto del carrito por su ID.
  const removeFromCart = (id) => {
    state.cart = state.cart.filter((p) => p.id !== id);
    saveState();
    renderCart();
  };

  // Calcula el total del carrito sumando precio * cantidad de cada producto.
  const getTotal = () =>
    state.cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  // ==========================
  // Render: sidebar y carrito.html
  // ==========================

  // Renderiza el carrito en el sidebar y en la página carrito.html
  // Actualiza el contador, la lista de productos y el total.
  // Usa delegación de eventos para manejar los botones de sumar/restar/eliminar.
  // Llama a renderCart() después de cualquier cambio en el carrito.
  const renderCart = () => {
    const cartCount = $("#cart-count");
    if (cartCount) {
      cartCount.textContent = state.cart.reduce((a, b) => a + b.cantidad, 0);
    }
// ===== Resumen de compra (carrito.html - lado derecho)
        const cartSummary = $("#cart-summary");
      if (cartSummary) {
        cartSummary.innerHTML = "";
        state.cart.forEach(item => {
          const div = document.createElement("div");
          div.className = "d-flex justify-content-between align-items-center mb-2 text-white";
          div.innerHTML = `
            <span>${item.nombre} (x${item.cantidad})</span>
            <span>${formatPrice(item.precio * item.cantidad)}</span>
          `;
          cartSummary.appendChild(div);
        });
      }




    // Sidebar (index.html)
    const sidebarList = $("#cart-items");
    const sidebarTotal = $("#cart-total");
    if (sidebarList) {
      sidebarList.innerHTML = "";
      state.cart.forEach((item) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center bg-dark text-white";
        li.innerHTML = `
          <div>
            <img src="${item.imagen}" alt="${item.nombre}" width="40" class="me-2">
            ${item.nombre} (x${item.cantidad})
          </div>
          <div>
            <button class="btn btn-sm btn-light me-1" data-action="minus" data-id="${item.id}">-</button>
            <button class="btn btn-sm btn-light me-1" data-action="plus" data-id="${item.id}">+</button>
            <button class="btn btn-sm btn-danger" data-action="remove" data-id="${item.id}">🗑️</button>
          </div>
        `;
        sidebarList.appendChild(li);
      });
      if (sidebarTotal) sidebarTotal.textContent = formatPrice(getTotal());
    }

    // Página carrito.html
    const cartPageList = $("#cart-page-items");
    const cartPageTotal = $("#cart-page-total");
    if (cartPageList) {
      cartPageList.innerHTML = "";
      state.cart.forEach((item) => {
        const row = document.createElement("li");
        row.className =
          "list-group-item d-flex justify-content-between align-items-center";
        row.innerHTML = `
          <div>
            <img src="${item.imagen}" alt="${item.nombre}" width="50" class="me-2">
            ${item.nombre} (x${item.cantidad})
          </div>
          <div>
            <span>${formatPrice(item.precio * item.cantidad)}</span>
            <button class="btn btn-sm btn-light ms-2" data-action="minus" data-id="${item.id}">-</button>
            <button class="btn btn-sm btn-light ms-2" data-action="plus" data-id="${item.id}">+</button>
            <button class="btn btn-sm btn-danger ms-2" data-action="remove" data-id="${item.id}">🗑️</button>
          </div>
        `;
        cartPageList.appendChild(row);
      });
      if (cartPageTotal) cartPageTotal.textContent = formatPrice(getTotal());
    }
  };

  
  // ==========================
  // Delegación de eventos
  // ==========================
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "plus") updateQuantity(id, +1);
    if (action === "minus") updateQuantity(id, -1);
    if (action === "remove") removeFromCart(id);
  });

  document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-add")) {
    const btn = e.target;
    const nombre = btn.dataset.nombre;
    const precio = btn.dataset.precio;
    const imagen = btn.dataset.imagen;
    if (!nombre || !precio || !imagen) {
      toast("Error: producto incompleto");
      return;
    }
    const product = {
      id: btn.dataset.id,
      nombre,
      precio: parseInt(precio),
      imagen,
    };
    addToCart(product);
  }

  document.addEventListener("click", function(e) {
  if (e.target.id === "btn-empty-cart") {
    state.cart = [];
    saveState();
    renderCart();
    toast("Carrito vaciado");
  }

});




});
  // ==========================
  // Toast simple
  // ==========================
  const toast = (msg) => {
    const el = document.createElement("div");
    el.textContent = msg;
    Object.assign(el.style, {
      position: "fixed",
      right: "1rem",
      bottom: "1rem",
      background: "#121823",
      color: "#fff",
      border: "1px solid #243042",
      padding: ".6rem .8rem",
      borderRadius: "10px",
      zIndex: 9999,
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  // ==========================
  // Init
  // ==========================
  document.addEventListener("DOMContentLoaded", renderCart);
})();


