// === Referencias del DOM - IDs ÚNICOS ===
const modalFiltros = document.getElementById('modalFiltros');
const modalCambioClave = document.getElementById('modalCambioClave');
const btnFiltrar = document.getElementById('btnFiltrar');
const formFiltros = document.getElementById('formFiltros');
const formCambioClave = document.getElementById('formCambioClave');
const cancelarFiltros = document.getElementById('cancelarFiltros');
const cancelarClave = document.getElementById('cancelarClave');
const tablaReportes = document.getElementById('tablaReportes');
const infoPag = document.getElementById('infoPag');
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

// === Utilidades para Modal Filtros ===
function abrirModalFiltros() {
  formFiltros.reset();
  modalFiltros.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
  
  // Enfocar el primer input del formulario
  const primerInput = formFiltros.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus();
}

function cerrarModalFiltros() {
  modalFiltros.classList.add('oculto');
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

// === Eventos Modal Filtros ===
btnFiltrar.addEventListener('click', abrirModalFiltros);
cancelarFiltros.addEventListener('click', cerrarModalFiltros);

// === Eventos Modal Cambio de Clave ===
cancelarClave.addEventListener('click', closeChangePasswordModal);

// Cerrar modales con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!modalFiltros.classList.contains('oculto')) {
      cerrarModalFiltros();
    }
    if (!modalCambioClave.classList.contains('oculto')) {
      closeChangePasswordModal();
    }
  }
});

// Cerrar modales al hacer clic fuera
modalFiltros.addEventListener('click', (e) => {
  if (e.target === modalFiltros) cerrarModalFiltros();
});

modalCambioClave.addEventListener('click', (e) => {
  if (e.target === modalCambioClave) closeChangePasswordModal();
});

// Enviar formulario de filtros
formFiltros.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Obtener valores de los filtros
  const estado = document.getElementById('filtroEstado').value;
  const fecha = document.getElementById('filtroFecha').value;
  
  console.log('Filtros aplicados:', { estado, fecha });
  
  // Aquí iría tu lógica para aplicar los filtros a la tabla
  aplicarFiltros(estado, fecha);
  
  cerrarModalFiltros();
});

// Búsqueda en tiempo real
searchInput.addEventListener('input', function() {
  // Validar antes de realizar la búsqueda
  if (!validarBusqueda()) {
    return;
  }
  
  const searchTerm = this.value.toLowerCase();
  const rows = document.querySelectorAll('#tablaReportes tbody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
  
  actualizarInfoPaginacion();
});

// Validar búsqueda con Enter
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    validarBusqueda();
  }
});

// Limpiar mensajes de búsqueda al escribir
searchInput.addEventListener('input', function() {
  removerMensajesBusqueda();
});

// Función para aplicar filtros (placeholder)
function aplicarFiltros(estado, fecha) {
  console.log('Aplicando filtros...');
  // Aquí iría la lógica para filtrar la tabla de reportes
  alert(`Filtros aplicados:\nEstado: ${estado || 'Todos'}\nFecha: ${fecha || 'Todas'}`);
}

// Función para el submenú
function toggleSubmenu() {
  var submenu = document.querySelector('.submenu');
  submenu.classList.toggle('open');
}

// Paginación básica
const pageSize = document.getElementById('pageSize');
pageSize.addEventListener('change', function() {
  console.log('Cambiando tamaño de página a:', this.value);
  // Aquí iría la lógica de paginación
  actualizarInfoPaginacion();
});

// Actualizar información de paginación
function actualizarInfoPaginacion() {
  const rows = document.querySelectorAll('#tablaReportes tbody tr');
  const totalRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
  infoPag.textContent = `Mostrando 0 a 0 de ${totalRows} entradas`;
}

// Inicializar tabla vacía
function inicializarTabla() {
  const tbody = tablaReportes.querySelector('tbody');
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

// === CONFIGURACIÓN DEL FORMULARIO DE CAMBIO DE CLAVE ===
document.addEventListener('DOMContentLoaded', function() {
    const formCambioClave = document.getElementById('formCambioClave');
    
    if (formCambioClave) {
        // Prevenir la validación nativa
        formCambioClave.addEventListener('invalid', function(e) {
            e.preventDefault();
        }, true);
        
        // Agregar el event listener del submit
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