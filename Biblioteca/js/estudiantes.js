// === Referencias del DOM ===
const modalEstudiante    = document.getElementById('modalEstudiante');
const modalCambioClave   = document.getElementById('modalCambioClave');
const btnAdd             = document.getElementById('btnAdd');
const form               = document.getElementById('formEst');
const cancelarEstudiante = document.getElementById('cancelarEstudiante');
const cancelarClave      = document.getElementById('cancelarClave');
const modalTitulo        = document.getElementById('modalTituloEstudiante');
const searchInput        = document.getElementById('searchInput');

// === FUNCIONES DE VALIDACIÓN ===
function validarFormulario() {
  removerMensajes();
  
  const formData = new FormData(form);
  let errores = [];
  
  // Validar Código (formato: XX-XX - 2 números, guión, 2 números)
  const codigo = formData.get('codigo').trim();
  if (!codigo) {
    errores.push({ campo: 'codigo', mensaje: 'El código es obligatorio' });
  } else if (!/^\d{2}-\d{2}$/.test(codigo)) {
    errores.push({ campo: 'codigo', mensaje: 'Formato: 00-00 (2 números, guión, 2 números)' });
  }
  
  // Validar DNI (10 números)
  const dni = formData.get('dni').trim();
  if (!dni) {
    errores.push({ campo: 'dni', mensaje: 'El DNI es obligatorio' });
  } else if (!/^\d{10}$/.test(dni)) {
    errores.push({ campo: 'dni', mensaje: 'El DNI debe tener 10 dígitos' });
  }
  
  // Validar Nombre (solo letras, espacios y tildes)
  const nombre = formData.get('nombre').trim();
  if (!nombre) {
    errores.push({ campo: 'nombre', mensaje: 'El nombre es obligatorio' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(nombre)) {
    errores.push({ campo: 'nombre', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  // Validar Carrera (solo letras, espacios y tildes)
  const carrera = formData.get('carrera').trim();
  if (!carrera) {
    errores.push({ campo: 'carrera', mensaje: 'La carrera es obligatoria' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(carrera)) {
    errores.push({ campo: 'carrera', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  // Validar Dirección (solo letras, espacios y tildes)
  const direccion = formData.get('direccion').trim();
  if (!direccion) {
    errores.push({ campo: 'direccion', mensaje: 'La dirección es obligatoria' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(direccion)) {
    errores.push({ campo: 'direccion', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  // Validar Teléfono (10 números)
  const telefono = formData.get('telefono').trim();
  if (!telefono) {
    errores.push({ campo: 'telefono', mensaje: 'El teléfono es obligatorio' });
  } else if (!/^\d{10}$/.test(telefono)) {
    errores.push({ campo: 'telefono', mensaje: 'El teléfono debe tener 10 dígitos' });
  }
  
  // Mostrar todos los errores
  if (errores.length > 0) {
    errores.forEach(error => {
      mostrarError(error.campo, error.mensaje);
    });
    return false;
  }
  
  return true;
}

function mostrarError(campoId, mensaje) {
  const elemento = document.querySelector(`[name="${campoId}"]`);
  if (!elemento) return;
  
  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-estudiante';
  errorElement.textContent = mensaje;
  errorElement.style.position = 'absolute';
  errorElement.style.background = '#e74c3c';
  errorElement.style.color = 'white';
  errorElement.style.padding = '10px 15px';
  errorElement.style.borderRadius = '6px';
  errorElement.style.fontSize = '14px';
  errorElement.style.fontWeight = 'bold';
  errorElement.style.zIndex = '10000';
  errorElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  errorElement.style.whiteSpace = 'nowrap';
  errorElement.style.fontFamily = 'Poppins, sans-serif';
  
  // Posicionar relativo al modal
  const modalRect = modalEstudiante.getBoundingClientRect();
  const elementRect = elemento.getBoundingClientRect();
  
  errorElement.style.top = (elementRect.bottom - modalRect.top + 10) + 'px';
  errorElement.style.left = (elementRect.left - modalRect.left) + 'px';
  
  modalEstudiante.appendChild(errorElement);
  elemento.style.borderColor = '#e74c3c';
  
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 3000);
}

function removerMensajes() {
  const mensajes = document.querySelectorAll('.mensaje-error-estudiante');
  mensajes.forEach(mensaje => mensaje.remove());
  
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.style.borderColor = '';
  });
}

// === FUNCIÓN DE BÚSQUEDA ===
function realizarBusqueda() {
  const termino = searchInput.value.trim();
  
  // Validar que solo contenga letras, números y espacios
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]*$/;
  
  if (termino && !regex.test(termino)) {
    // Mostrar error de búsqueda
    const errorElement = document.createElement('div');
    errorElement.className = 'mensaje-error-busqueda';
    errorElement.textContent = 'Solo letras y números';
    errorElement.style.position = 'fixed';
    errorElement.style.background = '#e74c3c';
    errorElement.style.color = 'white';
    errorElement.style.padding = '10px 15px';
    errorElement.style.borderRadius = '6px';
    errorElement.style.fontSize = '14px';
    errorElement.style.fontWeight = 'bold';
    errorElement.style.zIndex = '10000';
    errorElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    errorElement.style.whiteSpace = 'nowrap';
    errorElement.style.fontFamily = 'Poppins, sans-serif';
    
    const rect = searchInput.getBoundingClientRect();
    errorElement.style.top = (rect.bottom + 10) + 'px';
    errorElement.style.left = rect.left + 'px';
    
    document.body.appendChild(errorElement);
    
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 3000);
    
    return;
  }
  
  // Aquí iría tu lógica de búsqueda real
  console.log('Buscando estudiantes:', termino);
  if (termino) {
    alert(`Buscando: "${termino}"`);
  } else {
    alert('Mostrando todos los estudiantes');
  }
}

// === FUNCIONES DE MODALES ===
function abrirModalEstudiante(titulo = 'Nuevo estudiante') {
  modalTitulo.textContent = titulo;
  form.reset();
  removerMensajes();
  modalEstudiante.classList.remove('oculto');
  const primerInput = form.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus();
}

function cerrarModalEstudiante() {
  modalEstudiante.classList.add('oculto');
}

function openChangePasswordModal() {
  modalCambioClave.classList.remove('oculto');
}

function closeChangePasswordModal() {
  modalCambioClave.classList.add('oculto');
}

// === EVENTOS ===
btnAdd.addEventListener('click', () => abrirModalEstudiante());

cancelarEstudiante.addEventListener('click', cerrarModalEstudiante);

cancelarClave.addEventListener('click', closeChangePasswordModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!modalEstudiante.classList.contains('oculto')) {
      cerrarModalEstudiante();
    }
    if (!modalCambioClave.classList.contains('oculto')) {
      closeChangePasswordModal();
    }
  }
});

modalEstudiante.addEventListener('click', (e) => {
  if (e.target === modalEstudiante) cerrarModalEstudiante();
});

modalCambioClave.addEventListener('click', (e) => {
  if (e.target === modalCambioClave) closeChangePasswordModal();
});

// === Búsqueda con Enter ===
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    realizarBusqueda();
  }
});

// Limpiar mensajes de búsqueda al escribir
searchInput.addEventListener('input', function() {
  const mensajes = document.querySelectorAll('.mensaje-error-busqueda');
  mensajes.forEach(mensaje => mensaje.remove());
});

// === ENVIO DEL FORMULARIO CON VALIDACIÓN ===
form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!validarFormulario()) {
    return;
  }
  
  const formData = new FormData(form);
  const estudianteData = {
    codigo: formData.get('codigo'),
    dni: formData.get('dni'),
    nombre: formData.get('nombre'),
    carrera: formData.get('carrera'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono')
  };
  
  console.log('Datos del estudiante válidos:', estudianteData);
  alert('Estudiante registrado correctamente');
  cerrarModalEstudiante();
});

// Limpiar mensajes al escribir
form.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function() {
    this.style.borderColor = '';
    removerMensajes();
  });
});

// --- Función para abrir/cerrar el submenú en el menú lateral ---
function toggleSubmenu() {
  var submenu = document.querySelector('.submenu');
  submenu.classList.toggle('open');
}

// Hacer las funciones globales para que funcionen con onclick en HTML
window.openChangePasswordModal = openChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.toggleSubmenu = toggleSubmenu;





/*Validar clave*/
function validarCambioClave() {
    removerMensajesClave();
    
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    let errores = [];
    
    // Validar Contraseña Actual (letras Y números)
    if (!currentPassword) {
        errores.push({ campo: 'currentPassword', mensaje: 'La contraseña actual es obligatoria' });
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(currentPassword)) {
        errores.push({ campo: 'currentPassword', mensaje: 'Debe contener letras y números' });
    } else if (currentPassword.length < 6) {
        errores.push({ campo: 'currentPassword', mensaje: 'Mínimo 6 caracteres' });
    }
    
    // Validar Nueva Contraseña (letras Y números)
    if (!newPassword) {
        errores.push({ campo: 'newPassword', mensaje: 'La nueva contraseña es obligatoria' });
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword)) {
        errores.push({ campo: 'newPassword', mensaje: 'Debe contener letras y números' });
    } else if (newPassword.length < 6) {
        errores.push({ campo: 'newPassword', mensaje: 'Mínimo 6 caracteres' });
    }
    
    // Validar Confirmar Contraseña
    if (!confirmPassword) {
        errores.push({ campo: 'confirmPassword', mensaje: 'Confirme la nueva contraseña' });
    } else if (newPassword !== confirmPassword) {
        errores.push({ campo: 'confirmPassword', mensaje: 'Las contraseñas no coinciden' });
    }
    
    // Mostrar todos los errores
    if (errores.length > 0) {
        errores.forEach(error => mostrarErrorClave(error.campo, error.mensaje));
        return false;
    }
    
    return true;
}

function mostrarErrorClave(campoId, mensaje) {
    let elemento = document.getElementById(campoId);
    
    if (!elemento) return;
    
    const errorElement = document.createElement('div');
    errorElement.className = 'mensaje-error-clave';
    errorElement.textContent = mensaje;
    errorElement.style.position = 'fixed';
    errorElement.style.background = '#e74c3c';
    errorElement.style.color = 'white';
    errorElement.style.padding = '10px 15px';
    errorElement.style.borderRadius = '6px';
    errorElement.style.fontSize = '14px';
    errorElement.style.fontWeight = 'bold';
    errorElement.style.zIndex = '10000';
    errorElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    errorElement.style.whiteSpace = 'nowrap';
    errorElement.style.fontFamily = 'Poppins, sans-serif';
    
    const rect = elemento.getBoundingClientRect();
    errorElement.style.top = (rect.bottom + 10) + 'px';
    errorElement.style.left = rect.left + 'px';
    
    document.body.appendChild(errorElement);
    
    // Marcar con borde rojo
    elemento.style.borderColor = '#e74c3c';
    
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
        elemento.style.borderColor = '';
    }, 3000);
}

function removerMensajesClave() {
    const mensajes = document.querySelectorAll('.mensaje-error-clave');
    mensajes.forEach(mensaje => mensaje.remove());
    
    const inputs = document.querySelectorAll('#modalCambioClave input');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// Configurar el formulario de cambio de clave
document.addEventListener('DOMContentLoaded', function() {
    const formCambioClave = document.querySelector('#modalCambioClave .formulario');
    
    if (formCambioClave) {
        // Prevenir la validación nativa
        formCambioClave.addEventListener('invalid', function(e) {
            e.preventDefault();
        }, true);
        
        // Reemplazar el event listener del submit
        formCambioClave.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarCambioClave()) {
                // Aquí iría tu lógica de cambio de clave
                alert('Contraseña cambiada correctamente');
                closeChangePasswordModal();
            }
        });
        
        // Limpiar mensajes al escribir en los campos
        const inputs = formCambioClave.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
                removerMensajesClave();
            });
        });
    }
});