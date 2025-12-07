// === Referencias del DOM - IDs ÚNICOS ===
// Modales
const modalUsuario = document.getElementById('modalUsuario');           // Modal para agregar/editar usuario
const modalCambioClave = document.getElementById('modalCambioClave');   // Modal para cambiar contraseña

// Botones
const btnAdd = document.getElementById('btnAdd');                       // Botón para abrir modal usuario
const cancelarUsuario = document.getElementById('cancelarUsuario');     // Botón para cerrar modal usuario
const cancelarClave = document.getElementById('cancelarClave');         // Botón para cerrar modal cambio de clave

// Formularios
const formUsuario = document.getElementById('formUsuario');             // Formulario de usuario
const formCambioClave = document.getElementById('formCambioClave');     // Formulario de cambio de clave

// Otros elementos
const modalTituloUsuario = document.getElementById('modalTituloUsuario'); // Título del modal usuario
const selectRol = document.getElementById('rol');                         // Select de rol de usuario
const searchInput = document.getElementById('searchInput');               // Input de búsqueda

// === FUNCIONES DE VALIDACIÓN PARA BÚSQUEDA ===

// Validar que el input de búsqueda solo contenga letras, números y espacios
function validarBusqueda() {
  const termino = searchInput.value.trim();
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]*$/;
  
  if (termino && !regex.test(termino)) {
    mostrarErrorBusqueda('Solo letras y números');
    return false;
  }
  return true;
}

// Ejecutar búsqueda en la tabla de usuarios
function ejecutarBusqueda() {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll('#tablaUsuarios tbody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';  // Mostrar/ocultar filas
  });
  
  actualizarInfoPaginacion();
}

// Mostrar mensaje de error de búsqueda
function mostrarErrorBusqueda(mensaje) {
  removerMensajesBusqueda(); // Limpiar errores previos
  
  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-busqueda';
  errorElement.textContent = mensaje;
  
  // Estilos del mensaje
  Object.assign(errorElement.style, {
    position: 'fixed',
    background: '#e74c3c',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: '10000',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
    fontFamily: 'Poppins, sans-serif'
  });
  
  const rect = searchInput.getBoundingClientRect();
  errorElement.style.top = (rect.bottom + 10) + 'px';
  errorElement.style.left = rect.left + 'px';
  
  document.body.appendChild(errorElement);
  searchInput.style.borderColor = '#e74c3c';
  
  setTimeout(() => {
    if (errorElement.parentNode) errorElement.remove();
    searchInput.style.borderColor = '';
  }, 3000);
}

// Eliminar mensajes de error de búsqueda
function removerMensajesBusqueda() {
  document.querySelectorAll('.mensaje-error-busqueda').forEach(mensaje => mensaje.remove());
  searchInput.style.borderColor = '';
}

// === FUNCIONES DE VALIDACIÓN PARA FORMULARIO USUARIO ===

// Validar todos los campos del formulario de usuario
function validarFormularioUsuario() {
  removerMensajesUsuario(); // Limpiar errores previos
  
  const formData = new FormData(formUsuario);
  let errores = [];
  
  // Validar campo usuario
  const usuario = formData.get('usuario').trim();
  if (!usuario) {
    errores.push({ campo: 'usuario', mensaje: 'El usuario es obligatorio' });
  } else if (!/^e\d{10}@live\.uleam\.edu\.ec$/.test(usuario)) {
    errores.push({ campo: 'usuario', mensaje: 'Formato: e0000000000@live.uleam.edu.ec' });
  }
  
  // Validar campo nombre
  const nombre = formData.get('nombre').trim();
  if (!nombre) {
    errores.push({ campo: 'nombre', mensaje: 'El nombre es obligatorio' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(nombre)) {
    errores.push({ campo: 'nombre', mensaje: 'Solo se permiten letras y espacios' });
  } else if (nombre.length < 2) {
    errores.push({ campo: 'nombre', mensaje: 'El nombre debe tener al menos 2 caracteres' });
  }
  
  // Validar campo contraseña
  const contrasena = formData.get('contrasena').trim();
  if (!contrasena) {
    errores.push({ campo: 'contrasena', mensaje: 'La contraseña es obligatoria' });
  } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(contrasena)) {
    errores.push({ campo: 'contrasena', mensaje: 'Debe contener letras y números' });
  } else if (contrasena.length < 6) {
    errores.push({ campo: 'contrasena', mensaje: 'Mínimo 6 caracteres' });
  }
  
  // Validar confirmación de contraseña
  const confirmarContrasena = formData.get('confirmarContrasena').trim();
  if (!confirmarContrasena) {
    errores.push({ campo: 'confirmarContrasena', mensaje: 'Confirme la contraseña' });
  } else if (contrasena !== confirmarContrasena) {
    errores.push({ campo: 'confirmarContrasena', mensaje: 'Las contraseñas no coinciden' });
  }
  
  // Mostrar errores si existen
  if (errores.length > 0) {
    errores.forEach(error => mostrarErrorUsuario(error.campo, error.mensaje));
    return false;
  }
  
  return true;
}

// Mostrar error debajo del input correspondiente en el modal
function mostrarErrorUsuario(campoId, mensaje) {
  const elemento = document.getElementById(campoId);
  if (!elemento) return;
  
  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-usuario';
  errorElement.textContent = mensaje;
  
  // Estilos del mensaje
  Object.assign(errorElement.style, {
    position: 'absolute',
    background: '#e74c3c',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: '10000',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
    fontFamily: 'Poppins, sans-serif'
  });
  
  const modalRect = modalUsuario.getBoundingClientRect();
  const elementRect = elemento.getBoundingClientRect();
  
  errorElement.style.top = (elementRect.bottom - modalRect.top + 10) + 'px';
  errorElement.style.left = (elementRect.left - modalRect.left) + 'px';
  
  modalUsuario.appendChild(errorElement);
  elemento.style.borderColor = '#e74c3c';
  
  setTimeout(() => {
    if (errorElement.parentNode) errorElement.remove();
  }, 3000);
}

// Eliminar todos los mensajes de error del modal usuario
function removerMensajesUsuario() {
  document.querySelectorAll('.mensaje-error-usuario').forEach(mensaje => mensaje.remove());
  formUsuario.querySelectorAll('input, select').forEach(input => input.style.borderColor = '');
}

// === UTILIDADES PARA MODAL USUARIO ===

// Abrir modal de usuario y configurar título
function abrirModalUsuario(titulo = 'Nuevo usuario') {
  modalTituloUsuario.textContent = titulo;
  formUsuario.reset();
  removerMensajesUsuario();
  modalUsuario.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
  
  const primerInput = formUsuario.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus();
}

// Cerrar modal de usuario
function cerrarModalUsuario() {
  modalUsuario.classList.add('oculto');
  document.body.style.overflow = '';
}

// === UTILIDADES PARA MODAL CAMBIO DE CLAVE ===

// Abrir modal de cambio de contraseña
function openChangePasswordModal() {
  formCambioClave.reset();
  modalCambioClave.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
  
  const primerInput = formCambioClave.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus();
}

// Cerrar modal de cambio de contraseña
function closeChangePasswordModal() {
  modalCambioClave.classList.add('oculto');
  document.body.style.overflow = '';
}

// === EVENTOS DE MODALES ===
btnAdd.addEventListener('click', () => abrirModalUsuario());
cancelarUsuario.addEventListener('click', cerrarModalUsuario);
cancelarClave.addEventListener('click', closeChangePasswordModal);

modalUsuario.addEventListener('click', (e) => { if (e.target === modalUsuario) cerrarModalUsuario(); });
modalCambioClave.addEventListener('click', (e) => { if (e.target === modalCambioClave) closeChangePasswordModal(); });

// === EVENTOS DEL FORMULARIO USUARIO ===
formUsuario.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function() {
    this.style.borderColor = '';
    removerMensajesUsuario();
  });
});

selectRol.addEventListener('change', function() {
  this.style.borderColor = '';
  removerMensajesUsuario();
});

// Evitar comportamiento de validación HTML5 nativa
formUsuario.addEventListener('invalid', function(e) { e.preventDefault(); }, true);

// Enviar formulario de usuario
formUsuario.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!validarFormularioUsuario()) return;
  
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

// === SUBMENÚ ===
function toggleSubmenu() {
  const submenu = document.querySelector('.submenu');
  submenu.classList.toggle('open');
}

// === PAGINACIÓN BÁSICA ===
const pageSize = document.getElementById('pageSize');
pageSize.addEventListener('change', function() {
  console.log('Cambiando tamaño de página a:', this.value);
  actualizarInfoPaginacion();
});

function actualizarInfoPaginacion() {
  const rows = document.querySelectorAll('#tablaUsuarios tbody tr');
  const totalRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
  const infoPag = document.getElementById('infoPag');
  infoPag.textContent = `Mostrando 0 a 0 de ${totalRows} entradas`;
}

function inicializarTabla() {
  const tbody = document.querySelector('#tablaUsuarios tbody');
  tbody.innerHTML = '';
  actualizarInfoPaginacion();
}

// === FUNCIONES DE VALIDACIÓN PARA CAMBIO DE CLAVE ===
function validarCambioClave() {
  removerMensajesClave();
  
  const currentPassword = document.getElementById('currentPassword').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  
  let errores = [];
  
  if (!currentPassword) errores.push({ campo: 'currentPassword', mensaje: 'La contraseña actual es obligatoria' });
  else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(currentPassword)) errores.push({ campo: 'currentPassword', mensaje: 'Debe contener letras y números' });
  else if (currentPassword.length < 6) errores.push({ campo: 'currentPassword', mensaje: 'Mínimo 6 caracteres' });
  
  if (!newPassword) errores.push({ campo: 'newPassword', mensaje: 'La nueva contraseña es obligatoria' });
  else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword)) errores.push({ campo: 'newPassword', mensaje: 'Debe contener letras y números' });
  else if (newPassword.length < 6) errores.push({ campo: 'newPassword', mensaje: 'Mínimo 6 caracteres' });
  
  if (!confirmPassword) errores.push({ campo: 'confirmPassword', mensaje: 'Confirme la nueva contraseña' });
  else if (newPassword !== confirmPassword) errores.push({ campo: 'confirmPassword', mensaje: 'Las contraseñas no coinciden' });
  
  if (errores.length > 0) {
    errores.forEach(error => mostrarErrorClave(error.campo, error.mensaje));
    return false;
  }
  
  return true;
}

function mostrarErrorClave(campoId, mensaje) {
  const elemento = document.getElementById(campoId);
  if (!elemento) return;
  
  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-clave';
  errorElement.textContent = mensaje;
  
  Object.assign(errorElement.style, {
    position: 'fixed',
    background: '#e74c3c',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: '10000',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
    fontFamily: 'Poppins, sans-serif'
  });
  
  const rect = elemento.getBoundingClientRect();
  errorElement.style.top = (rect.bottom + 10) + 'px';
  errorElement.style.left = rect.left + 'px';
  
  document.body.appendChild(errorElement);
  elemento.style.borderColor = '#e74c3c';
  
  setTimeout(() => {
    if (errorElement.parentNode) errorElement.remove();
    elemento.style.borderColor = '';
  }, 3000);
}

function removerMensajesClave() {
  document.querySelectorAll('.mensaje-error-clave').forEach(mensaje => mensaje.remove());
  document.querySelectorAll('#modalCambioClave input').forEach(input => input.style.borderColor = '');
}

// === CONFIGURACIÓN UNIFICADA DEL FORMULARIO DE CAMBIO DE CLAVE ===
document.addEventListener('DOMContentLoaded', function() {
  const formCambioClave = document.getElementById('formCambioClave');
  
  if (formCambioClave) {
    // Prevenir validación nativa HTML5
    formCambioClave.addEventListener('invalid', function(e) { e.preventDefault(); }, true);
    
    // Enviar formulario de cambio de clave
    formCambioClave.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validarCambioClave()) {
        alert('Contraseña cambiada correctamente');
        closeChangePasswordModal();
      }
    });
    
    // Limpiar errores al escribir en los inputs
    formCambioClave.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', function() {
        this.style.borderColor = '';
        removerMensajesClave();
      });
    });
  }
  
  // Inicializar tabla al cargar la página
  inicializarTabla();
});


//Formato semiestructurado xml

function cargarUsuariosXML() {
  fetch('Usuarios.xml')
    .then(res => res.text())
    .then(str => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "application/xml");
      const usuarios = xmlDoc.getElementsByTagName('usuario');
      const tbody = document.querySelector('#tablaUsuarios tbody');
      tbody.innerHTML = '';

      for (let i = 0; i < usuarios.length; i++) {
        const id = usuarios[i].getElementsByTagName('id')[0].textContent;
        const nombre = usuarios[i].getElementsByTagName('nombre')[0].textContent;
        const correo = usuarios[i].getElementsByTagName('correo')[0].textContent;
        const estado = usuarios[i].getElementsByTagName('estado')[0].textContent;
        const rol = usuarios[i].getElementsByTagName('rol')[0].textContent;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${id}</td>
          <td>${nombre}</td>
          <td>${correo}</td>
          <td>${estado}</td>
          <td>${rol}</td>
          <td>
            <button class="btn-edit">Editar</button>
            <button class="btn-delete">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      }

      actualizarInfoPaginacion();
    });
}

document.addEventListener('DOMContentLoaded', () => {
  cargarUsuariosXML();
});
