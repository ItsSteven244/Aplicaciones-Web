// === Referencias del DOM ===
const modalAddPrestamo    = document.getElementById('addPrestamoModal'); // Modal para agregar préstamo
const btnAdd              = document.getElementById('btnAdd'); // Botón para abrir el modal
const form                = document.getElementById('formPrestamo'); // Formulario del préstamo
const cancelar            = document.getElementById('cancelar'); // Botón para cancelar/cerrar modal
const modalTitulo         = document.getElementById('modalTituloPrestamo'); // Título del modal
const modalChangePassword = document.getElementById('changePasswordModal'); // Modal de cambio de contraseña
const searchInput         = document.getElementById('searchInput'); // Input de búsqueda

const inputLibro    = document.getElementById('inputLibro'); // Input de libro
const dropdownLibro = document.getElementById('dropdownLibro'); // Dropdown de sugerencias para libro
const inputEst      = document.getElementById('inputEstudiante'); // Input de estudiante
const dropdownEst   = document.getElementById('dropdownEst'); // Dropdown de sugerencias para estudiante
const fechaPrest    = document.getElementById('fechaPrestamo'); // Input de fecha de préstamo
const fechaDevol    = document.getElementById('fechaDevolucion'); // Input de fecha de devolución
const observacion   = document.getElementById('observacion'); // Textarea de observación

// Función para agregar ceros a la izquierda
const pad  = (n) => String(n).padStart(2, '0');
// Convertir una fecha a formato ISO YYYY-MM-DD
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

// Mostrar mensaje de "Ingrese 2 o más caracteres" en dropdown
function showHint(drop) {
  drop.hidden = false;
  drop.innerHTML = `<div class="hint">Ingrese 2 o más caracteres</div>`;
}

// Renderiza resultados en el dropdown
function renderResults(drop, items) {
  drop.hidden = false;
  drop.innerHTML = items.length
    ? items.map(n => `<div class="item" role="option">${n}</div>`).join('')
    : `<div class="hint">Sin resultados</div>`;
}

// === FUNCIONES DE ERRORES ===
// Mostrar mensaje de error en inputs
function mostrarError(campoId, mensaje, tipo = 'prestamo') {
  const clase = tipo === 'clave' ? 'mensaje-error-clave' : 'mensaje-error-prestamo';
  const elemento = document.getElementById(campoId) || document.querySelector(`[name="${campoId}"]`);
  if (!elemento) return;

  const errorElement = document.createElement('div');
  errorElement.className = clase;
  errorElement.textContent = mensaje;
  Object.assign(errorElement.style, {
    position: tipo === 'clave' ? 'fixed' : 'absolute',
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

  if (tipo === 'prestamo') {
    const modalRect = modalAddPrestamo.getBoundingClientRect();
    const rect = elemento.getBoundingClientRect();
    // Posicionar mensaje debajo del input dentro del modal
    errorElement.style.top = (rect.bottom - modalRect.top + 10) + 'px';
    errorElement.style.left = (rect.left - modalRect.left) + 'px';
    modalAddPrestamo.appendChild(errorElement);
  } else {
    const rect = elemento.getBoundingClientRect();
    // Posicionar mensaje cerca del input en pantalla
    errorElement.style.top = (rect.bottom + 10) + 'px';
    errorElement.style.left = rect.left + 'px';
    document.body.appendChild(errorElement);
  }

  elemento.style.borderColor = '#e74c3c'; // Borde rojo en input con error
  setTimeout(() => {
    if (errorElement.parentNode) errorElement.remove(); // Eliminar mensaje tras 3s
    elemento.style.borderColor = '';
  }, 3000);
}

// Remover mensajes de error
function removerMensajes(tipo = 'prestamo') {
  const clase = tipo === 'clave' ? '.mensaje-error-clave' : '.mensaje-error-prestamo';
  document.querySelectorAll(clase).forEach(m => m.remove());
  const inputs = tipo === 'clave'
    ? document.querySelectorAll('#changePasswordModal input')
    : form.querySelectorAll('input, textarea, select');
  inputs.forEach(i => i.style.borderColor = '');
}

// === VALIDACIÓN FORMULARIO ===
function validarFormulario() {
  removerMensajes(); // Limpiar errores anteriores
  const formData = new FormData(form);
  let errores = [];

  // Validar libro
  const libro = inputLibro.value.trim();
  if (!libro) errores.push({ campo: 'inputLibro', mensaje: 'El libro es obligatorio' });
  else if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(libro)) errores.push({ campo: 'inputLibro', mensaje: 'Solo se permiten letras, números y espacios' });

  // Validar estudiante
  const estudiante = inputEst.value.trim();
  if (!estudiante) errores.push({ campo: 'inputEstudiante', mensaje: 'El estudiante es obligatorio' });
  else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(estudiante)) errores.push({ campo: 'inputEstudiante', mensaje: 'Solo se permiten letras y espacios' });

  // Validar cantidad
  const cantidad = formData.get('cantidad').trim();
  if (!cantidad) errores.push({ campo: 'cantidad', mensaje: 'La cantidad es obligatoria' });
  else if (cantidad <= 0) errores.push({ campo: 'cantidad', mensaje: 'La cantidad debe ser mayor a 0' });

  // Validar fechas
  const fechaP = fechaPrest.value;
  const fechaD = fechaDevol.value;
  if (!fechaP) errores.push({ campo: 'fechaPrestamo', mensaje: 'La fecha de préstamo es obligatoria' });
  if (!fechaD) errores.push({ campo: 'fechaDevolucion', mensaje: 'La fecha de devolución es obligatoria' });
  if (fechaP && fechaD && fechaD <= fechaP) errores.push({ campo: 'fechaDevolucion', mensaje: 'La fecha de devolución debe ser posterior a la fecha de préstamo' });

  // Validar observación
  const obs = observacion.value.trim();
  if (obs && !/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ.,;:!?¿¡()\-_]+$/.test(obs))
    errores.push({ campo: 'observacion', mensaje: 'Solo se permiten letras, números, espacios y signos de puntuación básicos' });

  // Mostrar errores si existen
  if (errores.length > 0) {
    errores.forEach(e => mostrarError(e.campo, e.mensaje));
    return false;
  }
  return true;
}

// === MODAL PRESTAMO ===
function abrirModal(titulo = 'Prestar Libro') {
  modalTitulo.textContent = titulo;
  form.reset(); // Resetear formulario
  removerMensajes(); // Limpiar errores

  // Inicializar fechas
  const hoy = new Date();
  fechaPrest.value = toISO(hoy);
  const dev = new Date(hoy); dev.setDate(hoy.getDate() + 7);
  fechaDevol.value = toISO(dev);

  showHint(dropdownLibro); // Mostrar hint inicial
  showHint(dropdownEst);

  modalAddPrestamo.classList.remove('oculto'); // Mostrar modal
  document.body.style.overflow = 'hidden'; // Evitar scroll en background

  const primerInput = form.querySelector('input, select, textarea');
  if (primerInput) primerInput.focus(); // Colocar cursor en primer input
}
function cerrarModal() {
  modalAddPrestamo.classList.add('oculto'); // Ocultar modal
  document.body.style.overflow = ''; // Restaurar scroll
}

// === EVENTOS ===
btnAdd.addEventListener('click', () => abrirModal()); // Abrir modal
cancelar.addEventListener('click', cerrarModal); // Cerrar modal
modalAddPrestamo.addEventListener('click', (e) => { if (e.target === modalAddPrestamo) cerrarModal(); }); // Cerrar al click fuera
searchInput.addEventListener('input', () => removerMensajes()); // Limpiar errores al buscar

// Formulario submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!validarFormulario()) return;

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

// Limpiar errores al escribir
form.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', () => removerMensajes()));

// Validación de fechas en tiempo real
[fechaPrest, fechaDevol].forEach(f => f.addEventListener('change', () => {
  if (fechaPrest.value && fechaDevol.value && fechaDevol.value <= fechaPrest.value)
    mostrarError('fechaDevolucion', 'La fecha de devolución debe ser posterior a la fecha de préstamo');
  else removerMensajes();
}));

// === COMBOBOX ===
async function handleComboInput(input, dropdown, buscarFn) {
  const q = input.value.trim().toLowerCase();
  if (q.length < 2) { showHint(dropdown); return; }
  const results = await buscarFn(q);
  renderResults(dropdown, (results || []).slice(0, 8));
}

inputLibro.addEventListener('input', () => handleComboInput(inputLibro, dropdownLibro, async q => []));
inputEst.addEventListener('input', () => handleComboInput(inputEst, dropdownEst, async q => []));

// Selección de item en dropdown
[dropdownLibro, dropdownEst].forEach((dd, i) => dd.addEventListener('click', e => {
  const it = e.target.closest('.item'); if (!it) return;
  const input = i === 0 ? inputLibro : inputEst;
  input.value = it.textContent; dd.hidden = true;
}));

// Cerrar dropdown al click fuera
document.addEventListener('click', e => {
  if (!dropdownLibro.contains(e.target) && e.target !== inputLibro) dropdownLibro.hidden = true;
  if (!dropdownEst.contains(e.target) && e.target !== inputEst) dropdownEst.hidden = true;
});

// === SUBMENU ===
function toggleSubmenu() { document.querySelector('.submenu').classList.toggle('open'); } // Abrir/cerrar submenú

// === CAMBIO DE CLAVE ===
function validarCambioClave() {
  removerMensajes('clave'); // Limpiar errores previos
  const currentPassword = document.getElementById('currentPassword').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  let errores = [];

  // Validar contraseña actual
  if (!currentPassword) errores.push({ campo: 'currentPassword', mensaje: 'La contraseña actual es obligatoria' });
  else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(currentPassword)) errores.push({ campo: 'currentPassword', mensaje: 'Debe contener letras y números' });
  else if (currentPassword.length < 6) errores.push({ campo: 'currentPassword', mensaje: 'Mínimo 6 caracteres' });

  // Validar nueva contraseña
  if (!newPassword) errores.push({ campo: 'newPassword', mensaje: 'La nueva contraseña es obligatoria' });
  else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword)) errores.push({ campo: 'newPassword', mensaje: 'Debe contener letras y números' });
  else if (newPassword.length < 6) errores.push({ campo: 'newPassword', mensaje: 'Mínimo 6 caracteres' });

  // Validar confirmación
  if (!confirmPassword) errores.push({ campo: 'confirmPassword', mensaje: 'Confirme la nueva contraseña' });
  else if (newPassword !== confirmPassword) errores.push({ campo: 'confirmPassword', mensaje: 'Las contraseñas no coinciden' });

  if (errores.length > 0) { errores.forEach(e => mostrarError(e.campo, e.mensaje, 'clave')); return false; }
  return true;
}

// Configuración del formulario de cambio de clave
document.addEventListener('DOMContentLoaded', () => {
  const formClave = document.querySelector('#changePasswordModal .formulario');
  if (formClave) {
    formClave.setAttribute('novalidate', 'true'); // Evita validación nativa del navegador
    formClave.addEventListener('submit', e => {
      e.preventDefault();
      if (validarCambioClave()) { alert('Contraseña cambiada correctamente'); closeChangePasswordModal(); }
    });
    formClave.querySelectorAll('input').forEach(i => i.addEventListener('input', () => removerMensajes('clave')));
    // Cerrar modal de cambio de contraseña al hacer click fuera
modalChangePassword.addEventListener('click', e => {
  if (e.target === modalChangePassword) {
    removerMensajes('clave'); // Limpiar errores
    closeChangePasswordModal(); // Cerrar modal
  }
});
;
  }
});

// Abrir/cerrar modal de cambio de contraseña
function openChangePasswordModal() { modalChangePassword.classList.remove('oculto'); document.body.style.overflow = 'hidden'; }
function closeChangePasswordModal() { modalChangePassword.classList.add('oculto'); document.body.style.overflow = ''; }





//Formato semiestructurado JSON
const tablaPrestamos = document.querySelector('#tablaPrestamos tbody');

async function cargarPrestamosJSON() {
  const res = await fetch('Prestamos.json');
  const prestamos = await res.json();
  tablaPrestamos.innerHTML = '';

  prestamos.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.libro}</td>
      <td>${p.estudiante}</td>
      <td>${p.fechaPrestamo}</td>
      <td>${p.fechaDevolucion}</td>
      <td>${p.cantidad}</td>
      <td>${p.observacion}</td>
      <td>${p.estado}</td>
      <td>
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Eliminar</button>
      </td>
    `;
    tablaPrestamos.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => cargarPrestamosJSON());
