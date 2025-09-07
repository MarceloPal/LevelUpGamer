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
  
