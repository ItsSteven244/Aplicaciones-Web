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

// === MODAL DE CAMBIO DE CLAVE ===
function openModal() {
    document.getElementById("changePasswordModal").style.display = "block";
}
function closeModal() {
    document.getElementById("changePasswordModal").style.display = "none";
}
window.onclick = function(event) {
    if (event.target == document.getElementById("changePasswordModal")) {
        closeModal();
    }
}

// === FUNCIONES DE FILTRO ===
function mostrarErrorFiltro(elemento, mensaje) {
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
    errorElement.style.left = (rect.left - 50) + 'px';

    document.body.appendChild(errorElement);

    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
    }, 3000);
}

function removerMensajesFiltro() {
    const mensajes = document.querySelectorAll('.mensaje-error-filtro');
    mensajes.forEach(mensaje => mensaje.remove());
}

// Eventos del filtro
document.addEventListener('DOMContentLoaded', function() {
    const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');
    const filtroValor = document.getElementById('filtroValor');

    btnAplicarFiltro.addEventListener('click', function(e) {
        e.preventDefault();
        aplicarFiltros();
    });

    filtroValor.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            aplicarFiltros();
        }
    });

    filtroValor.addEventListener('input', function() {
        removerMensajesFiltro();
    });
});

// === FUNCIONES DE VALIDACIÓN DE CAMBIO DE CLAVE ===
function validarCambioClave() {
    removerMensajesClave();

    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    let errores = [];

    // Contraseña actual
    if (!currentPassword) {
        errores.push({ campo: 'currentPassword', mensaje: 'La contraseña actual es obligatoria' });
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(currentPassword)) {
        errores.push({ campo: 'currentPassword', mensaje: 'Debe contener letras y números' });
    } else if (currentPassword.length < 6) {
        errores.push({ campo: 'currentPassword', mensaje: 'Mínimo 6 caracteres' });
    }

    // Nueva contraseña
    if (!newPassword) {
        errores.push({ campo: 'newPassword', mensaje: 'La nueva contraseña es obligatoria' });
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword)) {
        errores.push({ campo: 'newPassword', mensaje: 'Debe contener letras y números' });
    } else if (newPassword.length < 6) {
        errores.push({ campo: 'newPassword', mensaje: 'Mínimo 6 caracteres' });
    }

    // Confirmar contraseña
    if (!confirmPassword) {
        errores.push({ campo: 'confirmPassword', mensaje: 'Confirme la nueva contraseña' });
    } else if (newPassword !== confirmPassword) {
        errores.push({ campo: 'confirmPassword', mensaje: 'Las contraseñas no coinciden' });
    }

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

// Formulario de cambio de clave
document.addEventListener('DOMContentLoaded', function() {
    const formCambioClave = document.querySelector('#changePasswordModal .formulario');
    if (formCambioClave) {
        formCambioClave.setAttribute('novalidate', 'true');

        formCambioClave.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validarCambioClave()) {
                alert('Contraseña cambiada correctamente');
                closeModal();
            }
        });

        const inputs = formCambioClave.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
                removerMensajesClave();
            });
        });

        const modal = document.getElementById('changePasswordModal');
        modal.addEventListener('click', function(e) {
            if (e.target === modal) removerMensajesClave();
        });
    }
});


//JSON
// ========== FIX RÁPIDO PARA CAMBIO DE CLAVE ==========
document.addEventListener('click', function(e) {
    // Si se hace clic en "Cambio de clave", abrir modal y mantener submenú
    if (e.target.closest('a') && e.target.closest('a').textContent.includes('Cambio de clave')) {
        e.stopPropagation();
        openModal();
        return;
    }
});

// ========== CÓDIGO PARA LIBROS ==========
let libros = [];

// Cargar libros
async function cargarLibros() {
    try {
        const respuesta = await fetch('Menu.json');
        libros = await respuesta.json();
        mostrarLibros(libros);
    } catch {
        document.getElementById('librosGrid').innerHTML = 
            '<div class="libro-vacio"><p>Error cargando libros</p></div>';
    }
}

// Mostrar libros CON TODOS LOS DATOS
function mostrarLibros(lista) {
    const grid = document.getElementById('librosGrid');
    
    if (!lista || lista.length === 0) {
        grid.innerHTML = `
            <div class="libro-vacio">
                <i class="fas fa-book-open"></i>
                <p>No se encontraron libros</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = lista.map(libro => `
        <div class="libro-card">
            <div class="libro-imagen">
                <img src="${libro.imagen}" alt="${libro.titulo}" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/350x200/0f8c8c/ffffff?text=${encodeURIComponent(libro.titulo)}'">
            </div>
            <div class="libro-info">
                <h3 class="libro-titulo">${libro.titulo}</h3>
                <p class="libro-isbn">ISBN: ${libro.isbn}</p>
                <p class="libro-descripcion">${libro.descripcion}</p>
                
                <div class="libro-detalles">
                    <span class="libro-cantidad ${libro.cantidad > 0 ? 'disponible' : 'agotado'}">
                        <i class="fas ${libro.cantidad > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${libro.cantidad > 0 ? 'Disponible' : 'Agotado'} (${libro.cantidad})
                    </span>
                </div>
                
                <div class="libro-metadata">
                    <span><strong>Materia:</strong> ${libro.materia}</span>
                    <span><strong>Autor:</strong> ${libro.autor}</span>
                    <span><strong>Editorial:</strong> ${libro.editorial}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Aplicar filtros (función que faltaba)
function aplicarFiltros() {
    const campo = document.getElementById('filtroCampo').value;
    const operador = document.getElementById('filtroOperador').value;
    const valor = document.getElementById('filtroValor').value.toLowerCase().trim();
    
    if (!valor) {
        mostrarLibros(libros);
        return;
    }
    
    const filtrados = libros.filter(libro => {
        const valorLibro = String(libro[campo] || '').toLowerCase();
        
        if (operador === 'igual') {
            return valorLibro === valor;
        } else { // contiene
            return valorLibro.includes(valor);
        }
    });
    
    mostrarLibros(filtrados);
    
    // Mostrar mensaje si no hay resultados
    if (filtrados.length === 0 && valor) {
        const filtroValor = document.getElementById('filtroValor');
        mostrarErrorFiltro(filtroValor, 'No se encontraron libros con esos criterios');
    }
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('filtroValor').value = '';
    removerMensajesFiltro();
    mostrarLibros(libros);
}

// Iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarLibros();
    
    // Botón limpiar
    document.getElementById('btnLimpiarFiltro').addEventListener('click', limpiarFiltros);
});