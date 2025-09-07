const buttons = document.querySelectorAll('.catalogo-buttons .btn2');
const sections = document.querySelectorAll('.catalogo-content .section');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Activar el botón seleccionado
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Mostrar la sección correspondiente
    const target = btn.getAttribute('data-section');
    sections.forEach(sec => {
      if (target === "todo") {
        sec.classList.remove('d-none1');
      } else if (sec.id === target) {
        sec.classList.remove('d-none1');
      } else {
        sec.classList.add('d-none1');
      }
    });
  });
});



function mostrarRegistro() {
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("registerForm").classList.remove("d-none");
}

function mostrarLogin() {
  document.getElementById("registerForm").classList.add("d-none");
  document.getElementById("loginForm").classList.remove("d-none");
}
  
