// === Referencias del DOM - IDs ÚNICOS ===
const modalUsuario = document.getElementById('modalUsuario');
const modalCambioClave = document.getElementById('modalCambioClave');
const btnAdd = document.getElementById('btnAdd');
const formUsuario = document.getElementById('formUsuario');
const formCambioClave = document.getElementById('formCambioClave');
const cancelarUsuario = document.getElementById('cancelarUsuario');
const cancelarClave = document.getElementById('cancelarClave');
const modalTituloUsuario = document.getElementById('modalTituloUsuario');
const selectRol = document.getElementById('rol');
const searchInput = document.getElementById('searchInput');

// === FUNCIONES DE VALIDACIÓN PARA BÚSQUEDA ===
function validarBusqueda() {
  const termino = searchInput.value.trim();
  
  // Validar que solo contenga letras, números y espacios
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]*$/;
  
  if (termino && !regex.test(termino)) {
    mostrarErrorBusqueda('Solo letras y números');
    return false;
  }
  
  return true;
}

// Función para ejecutar la búsqueda
function ejecutarBusqueda() {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll('#tablaUsuarios tbody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
  
  actualizarInfoPaginacion();
}

function mostrarErrorBusqueda(mensaje) {
  removerMensajesBusqueda();
  
  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-busqueda';
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
  
  const rect = searchInput.getBoundingClientRect();
  errorElement.style.top = (rect.bottom + 10) + 'px';
  errorElement.style.left = rect.left + 'px';
  
  document.body.appendChild(errorElement);
  
  searchInput.style.borderColor = '#e74c3c';
  
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
    searchInput.style.borderColor = '';
  }, 3000);
}

function removerMensajesBusqueda() {
  const mensajes = document.querySelectorAll('.mensaje-error-busqueda');
  mensajes.forEach(mensaje => mensaje.remove());
  searchInput.style.borderColor = '';
}

// === FUNCIONES DE VALIDACIÓN PARA FORMULARIO USUARIO ===
function validarFormularioUsuario() {
  removerMensajesUsuario();
  
  const formData = new FormData(formUsuario);
  let errores = [];
  
  // Validar Usuario (formato: e + 10 números + @live.uleam.edu.ec)
  const usuario = formData.get('usuario').trim();
  if (!usuario) {
    errores.push({ campo: 'usuario', mensaje: 'El usuario es obligatorio' });
  } else if (!/^e\d{10}@live\.uleam\.edu\.ec$/.test(usuario)) {
    errores.push({ campo: 'usuario', mensaje: 'Formato: e0000000000@live.uleam.edu.ec' });
  }
  
  // Validar Nombre (solo letras, espacios y tildes)
  const nombre = formData.get('nombre').trim();
  if (!nombre) {
    errores.push({ campo: 'nombre', mensaje: 'El nombre es obligatorio' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(nombre)) {
    errores.push({ campo: 'nombre', mensaje: 'Solo se permiten letras y espacios' });
  } else if (nombre.length < 2) {
    errores.push({ campo: 'nombre', mensaje: 'El nombre debe tener al menos 2 caracteres' });
  }
  
  // Validar Contraseña (letras y números)
  const contrasena = formData.get('contrasena').trim();
  if (!contrasena) {
    errores.push({ campo: 'contrasena', mensaje: 'La contraseña es obligatoria' });
  } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(contrasena)) {
    errores.push({ campo: 'contrasena', mensaje: 'Debe contener letras y números' });
  } else if (contrasena.length < 6) {
    errores.push({ campo: 'contrasena', mensaje: 'Mínimo 6 caracteres' });
  }
  
  // Validar Confirmar Contraseña
  const confirmarContrasena = formData.get('confirmarContrasena').trim();
  if (!confirmarContrasena) {
    errores.push({ campo: 'confirmarContrasena', mensaje: 'Confirme la contraseña' });
  } else if (contrasena !== confirmarContrasena) {
    errores.push({ campo: 'confirmarContrasena', mensaje: 'Las contraseñas no coinciden' });
  }
  
  // Mostrar todos los errores
  if (errores.length > 0) {
    errores.forEach(error => mostrarErrorUsuario(error.campo, error.mensaje));
    return false;
  }
  
  return true;
}

function mostrarErrorUsuario(campoId, mensaje) {
  let elemento = document.getElementById(campoId);
  
  if (!elemento) return;
  
  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-usuario';
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
  const modalRect = modalUsuario.getBoundingClientRect();
  const elementRect = elemento.getBoundingClientRect();
  
  errorElement.style.top = (elementRect.bottom - modalRect.top + 10) + 'px';
  errorElement.style.left = (elementRect.left - modalRect.left) + 'px';
  
  modalUsuario.appendChild(errorElement);
  
  // Marcar con borde rojo
  elemento.style.borderColor = '#e74c3c';
  
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 3000);
}

function removerMensajesUsuario() {
  const mensajes = document.querySelectorAll('.mensaje-error-usuario');
  mensajes.forEach(mensaje => mensaje.remove());
  
  const inputs = formUsuario.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.style.borderColor = '';
  });
}

// === Utilidades para Modal Usuario ===
function abrirModalUsuario(titulo = 'Nuevo usuario') {
  modalTituloUsuario.textContent = titulo;
  formUsuario.reset();
  removerMensajesUsuario();
  modalUsuario.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
  
  // Enfocar el primer input del formulario
  const primerInput = formUsuario.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus();
}

function cerrarModalUsuario() {
  modalUsuario.classList.add('oculto');
  document.body.style.overflow = '';
}

// === Utilidades para Modal Cambio de Clave ===
function openChangePasswordModal() {
  formCambioClave.reset();
  modalCambioClave.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
  
  // Enfocar el primer input del formulario
  const primerInput = formCambioClave.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus();
}

function closeChangePasswordModal() {
  modalCambioClave.classList.add('oculto');
  document.body.style.overflow = '';
}

// === Eventos Modal Usuario ===
btnAdd.addEventListener('click', () => abrirModalUsuario());
cancelarUsuario.addEventListener('click', cerrarModalUsuario);

// === Eventos Modal Cambio de Clave ===
cancelarClave.addEventListener('click', closeChangePasswordModal);

// Cerrar modales con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!modalUsuario.classList.contains('oculto')) {
      cerrarModalUsuario();
    }
    if (!modalCambioClave.classList.contains('oculto')) {
      closeChangePasswordModal();
    }
  }
});

// Cerrar modales al hacer clic fuera
modalUsuario.addEventListener('click', (e) => {
  if (e.target === modalUsuario) cerrarModalUsuario();
});

modalCambioClave.addEventListener('click', (e) => {
  if (e.target === modalCambioClave) closeChangePasswordModal();
});

// === Búsqueda en tiempo real ===
searchInput.addEventListener('input', function() {
  if (!validarBusqueda()) {
    return;
  }
  ejecutarBusqueda();
});

// Validar búsqueda con Enter
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (validarBusqueda()) {
      ejecutarBusqueda();
    }
  }
});

// Limpiar mensajes de búsqueda al escribir
searchInput.addEventListener('input', function() {
  removerMensajesBusqueda();
});

// Limpiar mensajes del formulario al escribir
formUsuario.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function() {
    this.style.borderColor = '';
    removerMensajesUsuario();
  });
});

// Limpiar mensajes del select al cambiar
selectRol.addEventListener('change', function() {
  this.style.borderColor = '';
  removerMensajesUsuario();
});

// === Prevenir validación nativa del navegador ===
formUsuario.addEventListener('invalid', function(e) {
    e.preventDefault();
}, true);

// Enviar formulario de usuario
formUsuario.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!validarFormularioUsuario()) {
    return;
  }
  
  // Obtener el valor del rol seleccionado
  const rolSeleccionado = selectRol.value;
  const formData = new FormData(formUsuario);
  
  const usuarioData = {
    usuario: formData.get('usuario'),
    nombre: formData.get('nombre'),
    rol: rolSeleccionado
  };
  
  console.log('Datos del usuario válidos:', usuarioData);
  alert('Usuario registrado correctamente');
  cerrarModalUsuario();
});

// Función para el submenú
function toggleSubmenu() {
  var submenu = document.querySelector('.submenu');
  submenu.classList.toggle('open');
}

// Paginación básica
const pageSize = document.getElementById('pageSize');
pageSize.addEventListener('change', function() {
  console.log('Cambiando tamaño de página a:', this.value);
  actualizarInfoPaginacion();
});

// Actualizar información de paginación
function actualizarInfoPaginacion() {
  const rows = document.querySelectorAll('#tablaUsuarios tbody tr');
  const totalRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
  const infoPag = document.getElementById('infoPag');
  infoPag.textContent = `Mostrando 0 a 0 de ${totalRows} entradas`;
}

// Inicializar tabla vacía
function inicializarTabla() {
  const tbody = document.querySelector('#tablaUsuarios tbody');
  tbody.innerHTML = '';
  actualizarInfoPaginacion();
}

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

// === CONFIGURACIÓN UNIFICADA DEL FORMULARIO DE CAMBIO DE CLAVE ===
document.addEventListener('DOMContentLoaded', function() {
    const formCambioClave = document.getElementById('formCambioClave');
    
    if (formCambioClave) {
        // Prevenir la validación nativa
        formCambioClave.addEventListener('invalid', function(e) {
            e.preventDefault();
        }, true);
        
        // Reemplazar el event listener del submit
        formCambioClave.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarCambioClave()) {
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
    
    // Inicializar tabla
    inicializarTabla();
});

// Hacer funciones globales
window.openChangePasswordModal = openChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.toggleSubmenu = toggleSubmenu;
window.validarCambioClave = validarCambioClave;
window.ejecutarBusqueda = ejecutarBusqueda;