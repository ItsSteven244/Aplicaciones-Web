// === Referencias del DOM ===
const modalAddPrestamo    = document.getElementById('addPrestamoModal');
const btnAdd              = document.getElementById('btnAdd');
const form                = document.getElementById('formPrestamo');
const cancelar            = document.getElementById('cancelar');
const modalTitulo         = document.getElementById('modalTituloPrestamo');
const modalChangePassword = document.getElementById('changePasswordModal');
const searchInput         = document.getElementById('searchInput'); // Para búsqueda

// Elementos del formulario de préstamo
const inputLibro    = document.getElementById('inputLibro');
const dropdownLibro = document.getElementById('dropdownLibro');
const inputEst      = document.getElementById('inputEstudiante');
const dropdownEst   = document.getElementById('dropdownEst');
const fechaPrest    = document.getElementById('fechaPrestamo');
const fechaDevol    = document.getElementById('fechaDevolucion');
const observacion   = document.getElementById('observacion');

// === Helpers ===
const pad  = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function showHint(drop) {
  drop.hidden = false;
  drop.innerHTML = `<div class="hint">Ingrese 2 o más caracteres</div>`;
}

function renderResults(drop, items) {
  drop.hidden = false;
  drop.innerHTML = items.length
    ? items.map(n => `<div class="item" role="option">${n}</div>`).join('')
    : `<div class="hint">Sin resultados</div>`;
}

// === FUNCIONES DE VALIDACIÓN ===
function validarFormulario() {
  removerMensajes();
  
  const formData = new FormData(form);
  let errores = [];
  
  // Validar Libro (solo letras, números y espacios)
  const libro = inputLibro.value.trim();
  if (!libro) {
    errores.push({ campo: 'inputLibro', mensaje: 'El libro es obligatorio' });
  } else if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(libro)) {
    errores.push({ campo: 'inputLibro', mensaje: 'Solo se permiten letras, números y espacios' });
  }
  
  // Validar Estudiante (solo letras, espacios y tildes)
  const estudiante = inputEst.value.trim();
  if (!estudiante) {
    errores.push({ campo: 'inputEstudiante', mensaje: 'El estudiante es obligatorio' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(estudiante)) {
    errores.push({ campo: 'inputEstudiante', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  // Validar Cantidad (obligatorio y número positivo)
  const cantidad = formData.get('cantidad').trim();
  if (!cantidad) {
    errores.push({ campo: 'cantidad', mensaje: 'La cantidad es obligatoria' });
  } else if (cantidad <= 0) {
    errores.push({ campo: 'cantidad', mensaje: 'La cantidad debe ser mayor a 0' });
  }
  
  // Validar Fechas
  const fechaPrestamoValue = fechaPrest.value;
  const fechaDevolucionValue = fechaDevol.value;
  
  if (!fechaPrestamoValue) {
    errores.push({ campo: 'fechaPrestamo', mensaje: 'La fecha de préstamo es obligatoria' });
  }
  
  if (!fechaDevolucionValue) {
    errores.push({ campo: 'fechaDevolucion', mensaje: 'La fecha de devolución es obligatoria' });
  }
  
  // Validar que fecha de devolución sea después de fecha de préstamo
  if (fechaPrestamoValue && fechaDevolucionValue && fechaDevolucionValue <= fechaPrestamoValue) {
    errores.push({ campo: 'fechaDevolucion', mensaje: 'La fecha de devolución debe ser posterior a la fecha de préstamo' });
  }
  
  // Validar Observación (letras, números, espacios, tildes y caracteres especiales básicos)
  const observacionValue = observacion.value.trim();
  if (observacionValue && !/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ.,;:!?¿¡()\-_]+$/.test(observacionValue)) {
    errores.push({ campo: 'observacion', mensaje: 'Solo se permiten letras, números, espacios y signos de puntuación básicos' });
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
  const elemento = document.getElementById(campoId) || document.querySelector(`[name="${campoId}"]`);
  if (!elemento) return;
  
  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-prestamo';
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
  const modalRect = modalAddPrestamo.getBoundingClientRect();
  const elementRect = elemento.getBoundingClientRect();
  
  errorElement.style.top = (elementRect.bottom - modalRect.top + 10) + 'px';
  errorElement.style.left = (elementRect.left - modalRect.left) + 'px';
  
  modalAddPrestamo.appendChild(errorElement);
  elemento.style.borderColor = '#e74c3c';
  
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 3000);
}

function removerMensajes() {
  const mensajes = document.querySelectorAll('.mensaje-error-prestamo');
  mensajes.forEach(mensaje => mensaje.remove());
  
  const inputs = form.querySelectorAll('input, textarea, select');
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
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 3000);
    
    return;
  }
  
  console.log('Buscando préstamos:', termino);
  // Por ahora solo un alert de ejemplo
  if (termino) {
    alert(`Buscando préstamos: "${termino}"`);
  } else {
    alert('Mostrando todos los préstamos');
  }
}

// === Utilidades ===
function abrirModal(titulo = 'Prestar Libro') {
  modalTitulo.textContent = titulo;
  form.reset();
  removerMensajes();

  // Fechas por defecto
  const hoy = new Date();
  fechaPrest.value = toISO(hoy);
  const dev = new Date(hoy); dev.setDate(hoy.getDate() + 7);
  fechaDevol.value = toISO(dev);

  // Estados iniciales de los combos
  showHint(dropdownLibro);
  showHint(dropdownEst);

  modalAddPrestamo.classList.remove('oculto');
  document.body.style.overflow = 'hidden';

  // Enfocar el primer input del formulario
  const primerInput = form.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus();
}

function cerrarModal() {
  modalAddPrestamo.classList.add('oculto');
  document.body.style.overflow = '';
}

// === EVENTOS ===
btnAdd.addEventListener('click', () => abrirModal());

// Cerrar con botón "Atrás"
cancelar.addEventListener('click', cerrarModal);

// Cerrar al presionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalAddPrestamo.classList.contains('oculto')) {
    cerrarModal();
  }
});

// Cerrar al hacer click fuera del contenido
modalAddPrestamo.addEventListener('click', (e) => {
  if (e.target === modalAddPrestamo) cerrarModal();
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
  
  // Obtener los valores del formulario
  const formData = new FormData(form);
  const prestamoData = {
    libro: inputLibro.value,
    estudiante: inputEst.value,
    cantidad: formData.get('cantidad'),
    fechaPrestamo: formData.get('fechaPrestamo'),
    fechaDevolucion: formData.get('fechaDevolucion'),
    observacion: formData.get('observacion')
  };
  
  console.log('Datos del préstamo válidos:', prestamoData);
  alert('Préstamo registrado correctamente');
  cerrarModal();
});

// Limpiar mensajes al escribir en los campos
form.querySelectorAll('input, textarea').forEach(elemento => {
  elemento.addEventListener('input', function() {
    this.style.borderColor = '';
    removerMensajes();
  });
});

// Validación de fechas en tiempo real
fechaDevol.addEventListener('change', () => {
  if (fechaPrest.value && fechaDevol.value && fechaDevol.value <= fechaPrest.value) {
    mostrarError('fechaDevolucion', 'La fecha de devolución debe ser posterior a la fecha de préstamo');
    fechaDevol.style.borderColor = '#e74c3c';
  } else {
    fechaDevol.style.borderColor = '';
    removerMensajes();
  }
});

fechaPrest.addEventListener('change', () => {
  if (fechaPrest.value && fechaDevol.value && fechaDevol.value <= fechaPrest.value) {
    mostrarError('fechaDevolucion', 'La fecha de devolución debe ser posterior a la fecha de préstamo');
    fechaDevol.style.borderColor = '#e74c3c';
  } else {
    fechaDevol.style.borderColor = '';
    removerMensajes();
  }
});

// --- Funciones para abrir/cerrar el modal de cambio de clave ---
function openChangePasswordModal() {
  modalChangePassword.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
}

function closeChangePasswordModal() {
  modalChangePassword.classList.add('oculto');
  document.body.style.overflow = '';
}

// Cerrar modales al hacer clic fuera
document.addEventListener('click', (e) => {
  if (e.target === modalAddPrestamo) {
    cerrarModal();
  }
  if (e.target === modalChangePassword) {
    closeChangePasswordModal();
  }
});

// === Lógica de combobox (sin datos de ejemplo) ===
const buscarLibros = async (q) => {
  return [];
};

const buscarEstudiantes = async (q) => {
  return [];
};

async function handleComboInput(input, dropdown, buscarFn) {
  const q = input.value.trim().toLowerCase();
  if (q.length < 2) {
    showHint(dropdown);
    return;
  }
  const results = await buscarFn(q);
  renderResults(dropdown, (results || []).slice(0, 8));
}

inputLibro.addEventListener('input', () => handleComboInput(inputLibro, dropdownLibro, buscarLibros));
inputEst.addEventListener('input',   () => handleComboInput(inputEst,   dropdownEst,   buscarEstudiantes));

// Selección de opción
dropdownLibro.addEventListener('click', (e) => {
  const it = e.target.closest('.item'); if (!it) return;
  inputLibro.value = it.textContent; dropdownLibro.hidden = true;
});
dropdownEst.addEventListener('click', (e) => {
  const it = e.target.closest('.item'); if (!it) return;
  inputEst.value = it.textContent; dropdownEst.hidden = true;
});

// Cerrar listas al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!dropdownLibro.contains(e.target) && e.target !== inputLibro) dropdownLibro.hidden = true;
  if (!dropdownEst.contains(e.target)   && e.target !== inputEst)   dropdownEst.hidden = true;
});

// --- Función para abrir/cerrar el submenú en el menú lateral ---
function toggleSubmenu() {
  var submenu = document.querySelector('.submenu');
  submenu.classList.toggle('open');
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
    
    const inputs = document.querySelectorAll('#changePasswordModal input');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// === MODIFICAR EL FORMULARIO EXISTENTE ===
document.addEventListener('DOMContentLoaded', function() {
    const formCambioClave = document.querySelector('#changePasswordModal .formulario');
    
    if (formCambioClave) {
        // Prevenir validación nativa
        formCambioClave.setAttribute('novalidate', 'true');
        
        // Reemplazar el event listener del submit
        formCambioClave.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarCambioClave()) {
                alert('Contraseña cambiada correctamente');
                closeModal();
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
        
        // También limpiar mensajes cuando se cierre el modal
        const modal = document.getElementById('changePasswordModal');
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                removerMensajesClave();
            }
        });
    }
});