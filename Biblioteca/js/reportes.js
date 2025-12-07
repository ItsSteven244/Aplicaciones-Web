// === Referencias del DOM ===

// Modales
const modalFiltros       = document.getElementById('modalFiltros');       // Modal de filtros
const modalCambioClave   = document.getElementById('modalCambioClave');  // Modal de cambio de contraseña

// Botones
const btnFiltrar         = document.getElementById('btnFiltrar');        // Botón para abrir modal de filtros
const cancelarFiltros    = document.getElementById('cancelarFiltros');  // Botón para cerrar modal de filtros
const cancelarClave      = document.getElementById('cancelarClave');    // Botón para cerrar modal de cambio de clave

// Formularios
const formFiltros        = document.getElementById('formFiltros');       // Formulario de filtros
const formCambioClave    = document.getElementById('formCambioClave');   // Formulario de cambio de contraseña

// Tabla y elementos relacionados
const tablaReportes      = document.getElementById('tablaReportes');     // Tabla de reportes
const infoPag            = document.getElementById('infoPag');           // Información de paginación
const searchInput        = document.getElementById('searchInput');       // Input de búsqueda
const pageSize           = document.getElementById('pageSize');          // Select de tamaño de página

// === Funciones de validación ===

// Validar el input de búsqueda (solo letras y números)
function validarBusqueda() {
    const termino = searchInput.value.trim();
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]*$/;
    if (termino && !regex.test(termino)) {
        mostrarErrorBusqueda('Solo letras y números');
        return false;
    }
    return true;
}

// Mostrar mensaje de error para la búsqueda
function mostrarErrorBusqueda(mensaje) {
    removerMensajesBusqueda(); // Limpiar errores anteriores

    const errorElement = document.createElement('div');
    errorElement.className = 'mensaje-error-busqueda';
    errorElement.textContent = mensaje;

    // Estilos del mensaje de error
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
    errorElement.style.top  = (rect.bottom + 10) + 'px';
    errorElement.style.left = rect.left + 'px';

    document.body.appendChild(errorElement);
    searchInput.style.borderColor = '#e74c3c';

    // Eliminar el mensaje automáticamente después de 3 segundos
    setTimeout(() => {
        if (errorElement.parentNode) errorElement.remove();
        searchInput.style.borderColor = '';
    }, 3000);
}

// Limpiar mensajes de error de búsqueda
function removerMensajesBusqueda() {
    document.querySelectorAll('.mensaje-error-busqueda').forEach(m => m.remove());
    searchInput.style.borderColor = '';
}

// Validación de cambio de contraseña
function validarCambioClave() {
    removerMensajesClave(); // Limpiar errores previos

    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword     = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    const errores = [];

    // Validar contraseña actual
    if (!currentPassword) errores.push({ campo: 'currentPassword', mensaje: 'La contraseña actual es obligatoria' });
    else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(currentPassword)) errores.push({ campo: 'currentPassword', mensaje: 'Debe contener letras y números' });
    else if (currentPassword.length < 6) errores.push({ campo: 'currentPassword', mensaje: 'Mínimo 6 caracteres' });

    // Validar nueva contraseña
    if (!newPassword) errores.push({ campo: 'newPassword', mensaje: 'La nueva contraseña es obligatoria' });
    else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword)) errores.push({ campo: 'newPassword', mensaje: 'Debe contener letras y números' });
    else if (newPassword.length < 6) errores.push({ campo: 'newPassword', mensaje: 'Mínimo 6 caracteres' });

    // Validar confirmación de contraseña
    if (!confirmPassword) errores.push({ campo: 'confirmPassword', mensaje: 'Confirme la nueva contraseña' });
    else if (newPassword !== confirmPassword) errores.push({ campo: 'confirmPassword', mensaje: 'Las contraseñas no coinciden' });

    // Mostrar errores si existen
    if (errores.length > 0) {
        errores.forEach(e => mostrarErrorClave(e.campo, e.mensaje));
        return false;
    }

    return true;
}

// Mostrar mensaje de error para inputs de cambio de contraseña
function mostrarErrorClave(campoId, mensaje) {
    const elemento = document.getElementById(campoId);
    if (!elemento) return;

    const errorElement = document.createElement('div');
    errorElement.className = 'mensaje-error-clave';
    errorElement.textContent = mensaje;

    // Estilos del mensaje de error
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
    errorElement.style.top  = (rect.bottom + 10) + 'px';
    errorElement.style.left = rect.left + 'px';

    document.body.appendChild(errorElement);
    elemento.style.borderColor = '#e74c3c';

    setTimeout(() => {
        if (errorElement.parentNode) errorElement.remove();
        elemento.style.borderColor = '';
    }, 3000);
}

// Limpiar mensajes de error de cambio de contraseña
function removerMensajesClave() {
    document.querySelectorAll('.mensaje-error-clave').forEach(m => m.remove());
    document.querySelectorAll('#modalCambioClave input').forEach(i => i.style.borderColor = '');
}

// === Modales ===

// Abrir modal de filtros
function abrirModalFiltros() {
    formFiltros.reset();                      // Resetear formulario
    modalFiltros.classList.remove('oculto');  // Mostrar modal
    document.body.style.overflow = 'hidden';  // Evitar scroll en background

    // Colocar cursor en el primer input
    const primerInput = formFiltros.querySelector('input, select, textarea');
    if (primerInput) primerInput.focus();
}

// Cerrar modal de filtros
function cerrarModalFiltros() {
    modalFiltros.classList.add('oculto');
    document.body.style.overflow = '';
}

// Abrir modal de cambio de contraseña
function openChangePasswordModal() {
    formCambioClave.reset();                   // Resetear formulario
    modalCambioClave.classList.remove('oculto'); // Mostrar modal
    document.body.style.overflow = 'hidden';    // Evitar scroll

    const primerInput = formCambioClave.querySelector('input, select, textarea');
    if (primerInput) primerInput.focus();
}

// Cerrar modal de cambio de contraseña
function closeChangePasswordModal() {
    modalCambioClave.classList.add('oculto');
    document.body.style.overflow = '';
}

// === Eventos ===

// Abrir y cerrar modales con botones
btnFiltrar.addEventListener('click', abrirModalFiltros);
cancelarFiltros.addEventListener('click', cerrarModalFiltros);
cancelarClave.addEventListener('click', closeChangePasswordModal);

// Cerrar modales al hacer click fuera
modalFiltros.addEventListener('click', e => { if (e.target === modalFiltros) cerrarModalFiltros(); });
modalCambioClave.addEventListener('click', e => { if (e.target === modalCambioClave) closeChangePasswordModal(); });

// === Filtros y tabla ===

// Enviar formulario de filtros
formFiltros.addEventListener('submit', e => {
    e.preventDefault();
    const estado = document.getElementById('filtroEstado').value;
    const fecha  = document.getElementById('filtroFecha').value;
    aplicarFiltros(estado, fecha);
    cerrarModalFiltros();
});

// Aplicar filtros (ejemplo de uso)
function aplicarFiltros(estado, fecha) {
    console.log('Aplicando filtros...');
    alert(`Filtros aplicados:\nEstado: ${estado || 'Todos'}\nFecha: ${fecha || 'Todas'}`);
}

// === Paginación ===

// Cambiar tamaño de página
pageSize.addEventListener('change', function() {
    console.log('Cambiando tamaño de página a:', this.value);
    actualizarInfoPaginacion();
});

// Actualizar información de paginación
function actualizarInfoPaginacion() {
    const rows = document.querySelectorAll('#tablaReportes tbody tr');
    const totalRows = Array.from(rows).filter(r => r.style.display !== 'none').length;
    infoPag.textContent = `Mostrando 0 a 0 de ${totalRows} entradas`;
}

// Inicializar tabla
function inicializarTabla() {
    tablaReportes.querySelector('tbody').innerHTML = '';
    actualizarInfoPaginacion();
}

// Configuración al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (formCambioClave) {
        formCambioClave.addEventListener('invalid', e => e.preventDefault(), true);

        formCambioClave.addEventListener('submit', e => {
            e.preventDefault();
            if (validarCambioClave()) {
                alert('Contraseña cambiada correctamente');
                closeChangePasswordModal();
            }
        });

        // Limpiar errores al escribir en inputs
        formCambioClave.querySelectorAll('input').forEach(i => {
            i.addEventListener('input', () => removerMensajesClave());
        });
    }
    inicializarTabla();
});

// === Submenú ===

// Abrir o cerrar submenú
function toggleSubmenu() {
    document.querySelector('.submenu').classList.toggle('open');
}




//Formato semiestructurado JSON

const tablaReportesBody = document.querySelector('#tablaReportes tbody');

async function cargarReportesJSON() {
  const res = await fetch('Reportes.json'); // Archivo JSON
  const reportes = await res.json();
  tablaReportesBody.innerHTML = ''; // Limpiar tabla

  reportes.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.estudiante}</td>
      <td>${r.libro}</td>
      <td>${r.fechaPrestamo}</td>
      <td>${r.fechaDevolucion}</td>
      <td>${r.estado}</td>
    `;
    tablaReportesBody.appendChild(tr);
  });

}

document.addEventListener('DOMContentLoaded', () => cargarReportesJSON());
