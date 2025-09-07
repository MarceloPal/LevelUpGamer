
  function mostrarRegistro() {
    document.getElementById("loginForm").classList.add("d-none");
    document.getElementById("registerForm").classList.remove("d-none");
  }

  function mostrarLogin() {
    document.getElementById("registerForm").classList.add("d-none");
    document.getElementById("loginForm").classList.remove("d-none");
  }
  const buttons = document.querySelectorAll('.catalogo-buttons .btn2');
const sections = document.querySelectorAll('.catalogo-content .section');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // quitar active a todos los botones
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.getAttribute('data-section');

    if (target === "todo") {
      // Mostrar todas las secciones
      sections.forEach(sec => sec.classList.remove('d-none'));
    } else {
      // Mostrar solo la seleccionada
      sections.forEach(sec => {
        if (sec.id === target) {
          sec.classList.remove('d-none');
        } else {
          sec.classList.add('d-none');
        }
      });
    }
  });
});
