// === Referencias del DOM ===
const modalAddBook        = document.getElementById('addBookModal');
const btnAdd              = document.getElementById('btnAdd');
const form                = document.getElementById('formLibro');
const cancelar            = document.getElementById('cancelar');
const modalTitulo         = document.getElementById('modalTitulo');
const modalChangePassword = document.getElementById('changePasswordModal');
const searchInput         = document.getElementById('searchInput'); // Nueva referencia

// === Referencias para la carga de logo ===
const logoPreview = document.getElementById('logoPreview');
const logoInput = document.getElementById('logoInput');
const previewImage = document.getElementById('previewImage');

// === Utilidades ===
function abrirModal(titulo = 'Nuevo libro') {
  modalTitulo.textContent = titulo;
  form.reset();
  resetLogoPreview();
  removerMensajes();
  modalAddBook.classList.remove('oculto');
  const primerInput = form.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus();
}

function cerrarModal() {
  modalAddBook.classList.add('oculto');
}

function resetLogoPreview() {
  previewImage.src = '';
  previewImage.style.display = 'none';
  logoPreview.querySelector('.logo-placeholder').style.display = 'block';
  logoPreview.classList.remove('active');
  logoInput.value = '';
}

// === FUNCIONES DE VALIDACIÓN ===
function validarFormulario() {
  removerMensajes();
  
  const formData = new FormData(form);
  let errores = [];
  
  // Validar ISBN (formato: XXX-XXXX) - 3 números, guión, 4 números
  const isbn = formData.get('isbn').trim();
  if (!isbn) {
    errores.push({ campo: 'isbn', mensaje: 'El ISBN es obligatorio' });
  } else if (!/^\d{3}-\d{4}$/.test(isbn)) {
    errores.push({ campo: 'isbn', mensaje: 'Formato: 000-0000 (3 números, guión, 4 números)' });
  }
  
  // Validar Título (solo letras, espacios y tildes)
  const titulo = formData.get('titulo').trim();
  if (!titulo) {
    errores.push({ campo: 'titulo', mensaje: 'El título es obligatorio' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(titulo)) {
    errores.push({ campo: 'titulo', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  // Validar Cantidad (obligatorio y número positivo)
  const cantidad = formData.get('cantidad').trim();
  if (!cantidad) {
    errores.push({ campo: 'cantidad', mensaje: 'La cantidad es obligatoria' });
  } else if (cantidad <= 0) {
    errores.push({ campo: 'cantidad', mensaje: 'La cantidad debe ser mayor a 0' });
  }
  
  // Validar Autor (solo letras, espacios y tildes)
  const autor = formData.get('autor').trim();
  if (!autor) {
    errores.push({ campo: 'autor', mensaje: 'El autor es obligatorio' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(autor)) {
    errores.push({ campo: 'autor', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  // Validar Editorial (solo letras, espacios y tildes)
  const editorial = formData.get('editorial').trim();
  if (!editorial) {
    errores.push({ campo: 'editorial', mensaje: 'La editorial es obligatoria' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(editorial)) {
    errores.push({ campo: 'editorial', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  // Validar Materia (solo letras, espacios y tildes)
  const materia = formData.get('materia').trim();
  if (!materia) {
    errores.push({ campo: 'materia', mensaje: 'La materia es obligatoria' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(materia)) {
    errores.push({ campo: 'materia', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  // Validar Logo (obligatorio)
  const logoFile = logoInput.files[0];
  if (!logoFile) {
    errores.push({ campo: 'logoPreview', mensaje: 'El logo es obligatorio' });
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
  let elemento;
  
  // Buscar el elemento según el tipo de campo
  if (campoId === 'logoPreview') {
    elemento = document.getElementById('logoPreview');
  } else {
    elemento = document.querySelector(`[name="${campoId}"]`) || document.getElementById(campoId);
  }
  
  if (!elemento) return;
  
  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-libro';
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
  const modalRect = modalAddBook.getBoundingClientRect();
  const elementRect = elemento.getBoundingClientRect();
  
  errorElement.style.top = (elementRect.bottom - modalRect.top + 10) + 'px';
  errorElement.style.left = (elementRect.left - modalRect.left) + 'px';
  
  modalAddBook.appendChild(errorElement);
  
  // Marcar con borde rojo (diferente para el logo)
  if (campoId === 'logoPreview') {
    elemento.style.borderColor = '#e74c3c';
    elemento.style.borderWidth = '2px';
    elemento.style.borderStyle = 'solid';
  } else {
    elemento.style.borderColor = '#e74c3c';
  }
  
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 3000);
}

function removerMensajes() {
  const mensajes = document.querySelectorAll('.mensaje-error-libro');
  mensajes.forEach(mensaje => mensaje.remove());
  
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.style.borderColor = '';
  });
  
  // Restaurar borde del logo
  if (logoPreview) {
    logoPreview.style.borderColor = '';
    logoPreview.style.borderWidth = '';
    logoPreview.style.borderStyle = '';
  }
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
  
  // Aquí iría tu lógica de búsqueda real
  console.log('Buscando:', termino);
  // Por ahora solo un alert de ejemplo
  if (termino) {
    alert(`Buscando: "${termino}"`);
  } else {
    alert('Mostrando todos los libros');
  }
}

// === EVENTOS ===
btnAdd.addEventListener('click', () => abrirModal());

cancelar.addEventListener('click', cerrarModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalAddBook.classList.contains('oculto')) {
    cerrarModal();
  }
});

modalAddBook.addEventListener('click', (e) => {
  if (e.target === modalAddBook) cerrarModal();
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

// === Funcionalidad para la carga de logo ===
logoPreview.addEventListener('click', function() {
  logoInput.click();
});

logoInput.addEventListener('change', function() {
  const file = this.files[0];
  
  if (file) {
    if (!file.type.match('image.*')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. El tamaño máximo permitido es 5MB.');
      return;
    }
    
    const reader = new FileReader();
    
    reader.addEventListener('load', function() {
      previewImage.src = reader.result;
      previewImage.style.display = 'block';
      logoPreview.querySelector('.logo-placeholder').style.display = 'none';
      logoPreview.classList.add('active');
    });
    
    reader.readAsDataURL(file);
  }
});

// === ENVIO DEL FORMULARIO CON VALIDACIÓN ===
form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!validarFormulario()) {
    return;
  }
  
  const formData = new FormData(form);
  const libroData = {
    isbn: formData.get('isbn'),
    titulo: formData.get('titulo'),
    cantidad: formData.get('cantidad'),
    autor: formData.get('autor'),
    editorial: formData.get('editorial'),
    materia: formData.get('materia'),
    estado: formData.get('estado')
  };
  
  const logoFile = logoInput.files[0];
  if (logoFile) {
    libroData.logo = logoFile.name;
  }
  
  console.log('Datos del libro válidos:', libroData);
  alert('Libro registrado correctamente');
  cerrarModal();
});

// Limpiar mensajes al escribir en los campos del formulario
form.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function() {
    this.style.borderColor = '';
    removerMensajes();
  });
});

// Limpiar mensajes al cambiar el logo
logoInput.addEventListener('change', function() {
  removerMensajes();
});

// --- Funciones para abrir/cerrar el modal de cambio de clave ---
function openChangePasswordModal() {
  const modal = document.getElementById("changePasswordModal");
  if (modal.style.display !== "block") {
    modal.style.display = "block";
  }
}

function closeChangePasswordModal() {
  modalChangePassword.style.display = "none";
}

window.onclick = function(event) {
  if (event.target === modalAddBook && !modalAddBook.classList.contains('oculto')) {
    cerrarModal();
  }
  if (event.target === modalChangePassword && modalChangePassword.style.display === "block") {
    closeChangePasswordModal();
  }
}

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