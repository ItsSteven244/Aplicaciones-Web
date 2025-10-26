// === FUNCIONES PARA EL SUBMENÚ DE ADMINISTRACIÓN ===
function toggleSubmenu() {
    var submenu = document.querySelector('.submenu');
    submenu.classList.toggle('open');
}

// Cerrar el submenú si se hace click fuera de él
document.addEventListener('click', function(event) {
    var submenu = document.querySelector('.submenu');
    var isClickInsideSubmenu = submenu.contains(event.target);
    
    if (!isClickInsideSubmenu && submenu.classList.contains('open')) {
        submenu.classList.remove('open');
    }
});

// Función para abrir el modal de cambio de clave
function openModal() {
    document.getElementById("changePasswordModal").style.display = "block";
}

// Función para cerrar el modal de cambio de clave
function closeModal() {
    document.getElementById("changePasswordModal").style.display = "none";
}

// Cerrar el modal si el usuario hace clic fuera de él
window.onclick = function(event) {
    if (event.target == document.getElementById("changePasswordModal")) {
        closeModal();
    }
}

// === FUNCIONES PARA FILTROS DE LIBROS ===

function aplicarFiltros() {
    const campo = document.getElementById('filtroCampo').value;
    const operador = document.getElementById('filtroOperador').value;
    const valor = document.getElementById('filtroValor').value.trim();

    // Remover mensajes anteriores
    removerMensajesFiltro();

    let errores = [];

    // Validar que no esté vacío
    if (valor === '') {
        errores.push('El campo de filtro no puede estar vacío');
    }
    
    // Validar que solo contenga letras, números y espacios
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑüÜ]*$/;
    if (valor !== '' && !regex.test(valor)) {
        errores.push('Solo se permiten letras, números y espacios');
    }

    // Mostrar errores si los hay
    if (errores.length > 0) {
        errores.forEach(mensaje => {
            mostrarErrorFiltro(document.getElementById('filtroValor'), mensaje);
        });
        return; // Detener la ejecución si hay errores
    }

    // Si pasa la validación, aplicar el filtro normal
    const librosFiltrados = librosEjemplo.filter(libro => {
        const valorCampo = libro[campo].toLowerCase();
        
        if (operador === 'igual') {
            return valorCampo === valor.toLowerCase();
        } else { // contiene
            return valorCampo.includes(valor.toLowerCase());
        }
    });

    mostrarLibros(librosFiltrados);
}

// AGREGA estas funciones al final de tu script (después de aplicarFiltros):
function mostrarErrorFiltro(elemento, mensaje) {
    console.log('Mostrando error:', mensaje); // Para debug
    
    const errorElement = document.createElement('div');
    errorElement.className = 'mensaje-error-filtro';
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
    errorElement.style.left = (rect.left - 50) + 'px'; // Ajuste para centrar
    
    document.body.appendChild(errorElement);

    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
    }, 3000);
}

function removerMensajesFiltro() {
    const mensajes = document.querySelectorAll('.mensaje-error-filtro');
    mensajes.forEach(mensaje => {
        console.log('Removiendo mensaje'); // Para debug
        mensaje.remove();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');
    const filtroValor = document.getElementById('filtroValor');
    
    // Event listener para el botón (ya existe, pero asegurar que use la nueva función)
    btnAplicarFiltro.addEventListener('click', function(e) {
        e.preventDefault(); 
        aplicarFiltros();
    });

    // Event listener para Enter
    filtroValor.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            aplicarFiltros();
        }
    });

    // Limpiar mensajes al escribir
    filtroValor.addEventListener('input', function() {
        removerMensajesFiltro();
    });
});



// === FUNCIONES DE VALIDACIÓN PARA CAMBIO DE CLAVE ===
function validarCambioClave() {
    removerMensajesClave();
    
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    let errores = [];
    
    // Validar Contraseña Actual (solo letras y números)
    if (!currentPassword) {
        errores.push({ campo: 'currentPassword', mensaje: 'La contraseña actual es obligatoria' });
    } else if (!/^[a-zA-Z0-9]+$/.test(currentPassword)) {
        errores.push({ campo: 'currentPassword', mensaje: 'Solo se permiten letras y números' });
    }
    
    // Validar Nueva Contraseña (solo letras y números)
    if (!newPassword) {
        errores.push({ campo: 'newPassword', mensaje: 'La nueva contraseña es obligatoria' });
    } else if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
        errores.push({ campo: 'newPassword', mensaje: 'Solo se permiten letras y números' });
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
    const modal = document.getElementById('changePasswordModal');
    const modalRect = modal.getBoundingClientRect();
    const elementRect = elemento.getBoundingClientRect();
    
    errorElement.style.top = (elementRect.bottom - modalRect.top + 10) + 'px';
    errorElement.style.left = (elementRect.left - modalRect.left) + 'px';
    
    modal.appendChild(errorElement);
    
    // Marcar con borde rojo
    elemento.style.borderColor = '#e74c3c';
    
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
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




// === FUNCIONES DE VALIDACIÓN PARA CAMBIO DE CLAVE ===
function validarCambioClave() {
    removerMensajesClave();
    
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    let errores = [];
    
    // Validar Contraseña Actual (solo letras y números)
    if (!currentPassword) {
        errores.push({ campo: 'currentPassword', mensaje: 'La contraseña actual es obligatoria' });
    } else if (!/^[a-zA-Z0-9]+$/.test(currentPassword)) {
        errores.push({ campo: 'currentPassword', mensaje: 'Solo se permiten letras y números' });
    }
    
    // Validar Nueva Contraseña (solo letras y números)
    if (!newPassword) {
        errores.push({ campo: 'newPassword', mensaje: 'La nueva contraseña es obligatoria' });
    } else if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
        errores.push({ campo: 'newPassword', mensaje: 'Solo se permiten letras y números' });
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





// === FUNCIONES DE VALIDACIÓN PARA CAMBIO DE CLAVE ===
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
                // Aquí iría tu lógica de cambio de clave
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