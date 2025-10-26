// Función para abrir el modal
function abrirModal() {
  const modal = document.getElementById('modalCambioClave');
  if (modal) {
    modal.style.display = 'flex'; // Muestra el modal
  }
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById('modalCambioClave');
  if (modal) {
    modal.style.display = 'none'; // Oculta el modal
  }
}

// Validación de la contraseña
document.getElementById('formCambioClave').addEventListener('submit', function (e) {
  e.preventDefault(); // Evita el envío del formulario

  const nuevaClave = document.getElementById('nuevaClave').value;
  const confirmarClave = document.getElementById('confirmarClave').value;

  if (nuevaClave === confirmarClave) {
    alert('La clave se ha cambiado correctamente');
    cerrarModal(); // Cierra el modal después de éxito
  } else {
    alert('Las claves no coinciden');
  }
});
