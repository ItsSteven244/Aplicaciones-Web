// === Referencias del DOM ===
const modalAddBook        = document.getElementById('addBookModal');
const btnAdd              = document.getElementById('btnAdd');
const form                = document.getElementById('formLibro');
const cancelar            = document.getElementById('cancelar');
const modalTitulo         = document.getElementById('modalTitulo');
const modalChangePassword = document.getElementById('changePasswordModal');
const searchInput         = document.getElementById('searchInput');

// === Referencias para la carga de logo ===
const logoPreview = document.getElementById('logoPreview');
const logoInput = document.getElementById('logoInput');
const previewImage = document.getElementById('previewImage');

// === UTILIDADES DE MODAL ===
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
  
  // Validar ISBN
  const isbn = formData.get('isbn').trim();
  if (!isbn) errores.push({ campo: 'isbn', mensaje: 'El ISBN es obligatorio' });
  else if (!/^\d{3}-\d{4}$/.test(isbn)) errores.push({ campo: 'isbn', mensaje: 'Formato: 000-0000 (3 números, guión, 4 números)' });

  // Validar Título
  const titulo = formData.get('titulo').trim();
  if (!titulo) errores.push({ campo: 'titulo', mensaje: 'El título es obligatorio' });
  else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(titulo)) errores.push({ campo: 'titulo', mensaje: 'Solo se permiten letras y espacios' });

  // Validar Cantidad
  const cantidad = formData.get('cantidad').trim();
  if (!cantidad) errores.push({ campo: 'cantidad', mensaje: 'La cantidad es obligatoria' });
  else if (cantidad <= 0) errores.push({ campo: 'cantidad', mensaje: 'La cantidad debe ser mayor a 0' });

  // Validar Autor
  const autor = formData.get('autor').trim();
  if (!autor) errores.push({ campo: 'autor', mensaje: 'El autor es obligatorio' });
  else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(autor)) errores.push({ campo: 'autor', mensaje: 'Solo se permiten letras y espacios' });

  // Validar Editorial
  const editorial = formData.get('editorial').trim();
  if (!editorial) errores.push({ campo: 'editorial', mensaje: 'La editorial es obligatoria' });
  else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(editorial)) errores.push({ campo: 'editorial', mensaje: 'Solo se permiten letras y espacios' });

  // Validar Materia
  const materia = formData.get('materia').trim();
  if (!materia) errores.push({ campo: 'materia', mensaje: 'La materia es obligatoria' });
  else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(materia)) errores.push({ campo: 'materia', mensaje: 'Solo se permiten letras y espacios' });

  // Validar Logo
  const logoFile = logoInput.files[0];
  if (!logoFile) errores.push({ campo: 'logoPreview', mensaje: 'El logo es obligatorio' });

  // Mostrar errores
  if (errores.length > 0) {
    errores.forEach(error => mostrarError(error.campo, error.mensaje));
    return false;
  }

  return true;
}

function mostrarError(campoId, mensaje) {
  let elemento = (campoId === 'logoPreview') ? logoPreview : document.querySelector(`[name="${campoId}"]`) || document.getElementById(campoId);
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


  //Para posicionar el mensaje cerca del input dentro del modal
  //guarda la posicion y tamaño del modal y obtiene las coordenadas del elemento y del modal
  const modalRect = modalAddBook.getBoundingClientRect();
  //guarda la posicion y tamaño del input  
  const elementRect = elemento.getBoundingClientRect();

  //Esas 2 lineas hacen que el mensaje de error aparezca justo debajo y alineado con el input que tiene error
  errorElement.style.top = (elementRect.bottom - modalRect.top + 10) + 'px';
  errorElement.style.left = (elementRect.left - modalRect.left) + 'px';

  modalAddBook.appendChild(errorElement); //muestra el mensaje

 //si el error en el logo
  if (campoId === 'logoPreview') {
    elemento.style.borderColor = '#e74c3c';
    elemento.style.borderWidth = '2px';
    elemento.style.borderStyle = 'solid';
  } else { //si el erro es en otro campo/input
    elemento.style.borderColor = '#e74c3c';
  }

  setTimeout(() => {
    if (errorElement.parentNode) errorElement.remove();
  }, 3000);
}

function removerMensajes() {
  const mensajes = document.querySelectorAll('.mensaje-error-libro');
  mensajes.forEach(m => m.remove());

  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(i => i.style.borderColor = '');

  if (logoPreview) {
    logoPreview.style.borderColor = '';
    logoPreview.style.borderWidth = '';
    logoPreview.style.borderStyle = '';
  }
}

// === EVENTOS (en este caso para cuando se apreta un boton) ===
btnAdd.addEventListener('click', () => abrirModal());
cancelar.addEventListener('click', cerrarModal);


//Para cerrar el modal al apretar fuera
window.onclick = function(event) {
  if (event.target === modalAddBook && !modalAddBook.classList.contains('oculto')) cerrarModal();
  if (event.target === modalChangePassword && modalChangePassword.style.display === "block") closeChangePasswordModal();
}

searchInput.addEventListener('input', () => { //borra los mensajes de error de la busqueda cuando se escribe
  document.querySelectorAll('.mensaje-error-busqueda').forEach(m => m.remove());
});

// === LOGO ===
logoPreview.addEventListener('click', () => logoInput.click()); //abre el explorador de archivos
logoInput.addEventListener('change', function() {
  const file = this.files[0]; //permite seleccionar el archivo
  if (!file) return; //si no se selecciona ningun archivo la funcion termina

  //Archivo solo de 5MB
  if (!file.type.match('image.*')) { alert('Por favor, selecciona un archivo de imagen válido.'); return; }
  if (file.size > 5 * 1024 * 1024) { alert('La imagen es demasiado grande. Tamaño máximo 5MB.'); return; }

  const reader = new FileReader();  //permite leer el archivo el navegador
  reader.onload = () => {
    previewImage.src = reader.result;
    previewImage.style.display = 'block';  //hace visible la imagen como previa
    logoPreview.querySelector('.logo-placeholder').style.display = 'none';
    logoPreview.classList.add('active');
  }
  reader.readAsDataURL(file); //convierte el archivo a base64, osea se usa caracteres seguros para html

  removerMensajes();
});

// === FORMULARIO ===
form.addEventListener('submit', (e) => { //cuando el usuario intente enviar algo pasa lo siguiente:
  e.preventDefault(); //evita que se recargue la página
  e.stopPropagation(); //evite que se envie el formulario a otro lugar
  if (!validarFormulario()) return;

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
  if (logoFile) libroData.logo = logoFile.name;

  console.log('Datos del libro válidos:', libroData);
  alert('Libro registrado correctamente');
  cerrarModal();
});

form.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function() {
    this.style.borderColor = '';
    removerMensajes();
  });
});

// === CAMBIO DE CONTRASEÑA ===
//Abre cierra el modal de cambio de clave
function openChangePasswordModal() { modalChangePassword.style.display = "block"; }
function closeChangePasswordModal() { modalChangePassword.style.display = "none"; }

// --- Función para abrir/cerrar el submenú --
function toggleSubmenu() { document.querySelector('.submenu').classList.toggle('open'); }

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

  if (errores.length > 0) { errores.forEach(error => mostrarErrorClave(error.campo, error.mensaje)); return false; }
  return true;
}

function mostrarErrorClave(campoId, mensaje) {
  const elemento = document.getElementById(campoId);
  if (!elemento) return;

  const errorElement = document.createElement('div');
  errorElement.className = 'mensaje-error-clave';
  errorElement.textContent = mensaje;
  Object.assign(errorElement.style, {
    position: 'fixed', background: '#e74c3c', color: 'white', padding: '10px 15px',
    borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', zIndex: '10000',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif'
  });

  //Para posicionar el mensaje cerca del input dentro del modal
         //guarda la posicion y tamaño del modal y obtiene las coordenadas del elemento y del modal
  const rect = elemento.getBoundingClientRect();

    //Esas 2 lineas hacen que el mensaje de error aparezca justo debajo y alineado con el input que tiene error
  errorElement.style.top = (rect.bottom + 10) + 'px';
  errorElement.style.left = rect.left + 'px';
  document.body.appendChild(errorElement);

  elemento.style.borderColor = '#e74c3c';
  setTimeout(() => { if (errorElement.parentNode) errorElement.remove(); elemento.style.borderColor = ''; }, 3000);
}

function removerMensajesClave() {
  document.querySelectorAll('.mensaje-error-clave').forEach(m => m.remove());
  document.querySelectorAll('#changePasswordModal input').forEach(i => i.style.borderColor = '');
}


// Configurar el formulario de cambio de clave
// Espera a que todo el contenido del DOM se haya cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {

  // Selecciona el formulario dentro del modal de cambio de contraseña
  const formCambioClave = document.querySelector('#changePasswordModal .formulario');

  // Verifica que el formulario exista
  if (formCambioClave) {

    // Desactiva la validación automática del navegador
    formCambioClave.setAttribute('novalidate', 'true');

    // Agrega un listener para cuando el usuario envía el formulario
    formCambioClave.addEventListener('submit', function(e) {
      e.preventDefault(); // Evita que el formulario se envíe y recargue la página
      // Valida manualmente los datos del formulario
      if (validarCambioClave()) { 
        alert('Contraseña cambiada correctamente'); // Muestra mensaje de éxito
        closeChangePasswordModal(); // Cierra el modal
      }
    });

    // Limpia los mensajes de error y el borde rojo al escribir en los inputs
    formCambioClave.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', function() {
        this.style.borderColor = ''; // Restaura el color del borde
        removerMensajesClave(); // Elimina cualquier mensaje de error visible
      });
    });

    // Si el usuario hace click en el fondo del modal (fuera del formulario), se eliminan los errores
    modalChangePassword.addEventListener('click', function(e) {
      if (e.target === modalChangePassword) removerMensajesClave();
    });
  }
});

// Formato semiestructurado xml

function cargarLibrosDesdeXML() {
  fetch('Libros.xml')
    .then(response => response.text())
    .then(str => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "application/xml");
      const libros = xmlDoc.getElementsByTagName('libro');
      const tbody = document.querySelector('#tablaLibros tbody');
      tbody.innerHTML = '';

      for(let i = 0; i < libros.length; i++) {
        const isbn = libros[i].getElementsByTagName('isbn')[0].textContent;
        const titulo = libros[i].getElementsByTagName('titulo')[0].textContent;
        const cantidad = libros[i].getElementsByTagName('cantidad')[0].textContent;
        const autor = libros[i].getElementsByTagName('autor')[0].textContent;
        const editorial = libros[i].getElementsByTagName('editorial')[0].textContent;
        const materia = libros[i].getElementsByTagName('materia')[0].textContent;
        const estado = libros[i].getElementsByTagName('estado')[0].textContent;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${isbn}</td>
          <td>${titulo}</td>
          <td>${cantidad}</td>
          <td>${autor}</td>
          <td>${editorial}</td>
          <td>${materia}</td>
          <td>${estado}</td>
          <td>
            <button class="btn-edit">Editar</button>
            <button class="btn-delete">Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
      }
    });
}

document.addEventListener('DOMContentLoaded', cargarLibrosDesdeXML);
