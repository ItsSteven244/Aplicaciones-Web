// === Referencias del DOM ===
const modalEstudiante    = document.getElementById('modalEstudiante');
const modalCambioClave   = document.getElementById('modalCambioClave');
const btnAdd             = document.getElementById('btnAdd');
const form               = document.getElementById('formEst'); //leer los datos ingresados, validar el formulario y evitar que la página se recargue al enviar.
const cancelarEstudiante = document.getElementById('cancelarEstudiante');
const cancelarClave      = document.getElementById('cancelarClave');
const modalTitulo        = document.getElementById('modalTituloEstudiante');
const searchInput        = document.getElementById('searchInput');

// === FUNCIONES DE VALIDACIÓN PARA EL FORMULARIO ===
function validarFormulario() {  //funcion para validar el formulario pero antes se remueve mensajes de errores
  removerMensajes();
  
  const formData = new FormData(form); // obtener los datos del formulario
  let errores = []; //array para almacenar los errores
  
  const codigo = formData.get('codigo').trim();  //Obtiene el valor del campo codigo asi es con las demas
  if (!codigo) { //Si el campo esta vacio
    errores.push({ campo: 'codigo', mensaje: 'El código es obligatorio' });
  } else if (!/^\d{2}-\d{2}$/.test(codigo)) {
    errores.push({ campo: 'codigo', mensaje: 'Formato: 00-00 (2 números, guión, 2 números)' });
  }
  
  const dni = formData.get('dni').trim();
  if (!dni) {
    errores.push({ campo: 'dni', mensaje: 'El DNI es obligatorio' });
  } else if (!/^\d{10}$/.test(dni)) {
    errores.push({ campo: 'dni', mensaje: 'El DNI debe tener 10 dígitos' });
  }
  
  const nombre = formData.get('nombre').trim();
  if (!nombre) {
    errores.push({ campo: 'nombre', mensaje: 'El nombre es obligatorio' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(nombre)) {
    errores.push({ campo: 'nombre', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  const carrera = formData.get('carrera').trim();
  if (!carrera) {
    errores.push({ campo: 'carrera', mensaje: 'La carrera es obligatoria' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(carrera)) {
    errores.push({ campo: 'carrera', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  const direccion = formData.get('direccion').trim();
  if (!direccion) {
    errores.push({ campo: 'direccion', mensaje: 'La dirección es obligatoria' });
  } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/.test(direccion)) {
    errores.push({ campo: 'direccion', mensaje: 'Solo se permiten letras y espacios' });
  }
  
  const telefono = formData.get('telefono').trim();
  if (!telefono) {
    errores.push({ campo: 'telefono', mensaje: 'El teléfono es obligatorio' });
  } else if (!/^\d{10}$/.test(telefono)) {
    errores.push({ campo: 'telefono', mensaje: 'El teléfono debe tener 10 dígitos' });
  }
  
  if (errores.length > 0) {
    errores.forEach(error => mostrarError(error.campo, error.mensaje));
    return false;
  }
  
  return true;
}

function mostrarError(campoId, mensaje) {      //Funcion para recibir el id del campo donde ocurrio el error
  const elemento = document.querySelector(`[name="${campoId}"]`);
  if (!elemento) return; //si no encuentra el campo no hace nada
  
  const errorElement = document.createElement('div'); //div que contendra el mensaje del error
  errorElement.className = 'mensaje-error-estudiante';
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
  errorElement.style.whiteSpace = 'nowrap'; //Fuerza a que todo el texto se mantenga en una sola línea, sin saltos
  errorElement.style.fontFamily = 'Poppins, sans-serif';

        //Para posicionar el mensaje cerca del input dentro del modal
         //guarda la posicion y tamaño del modal y obtiene las coordenadas del elemento y del modal
  const modalRect = modalEstudiante.getBoundingClientRect();
        //guarda la posicion y tamaño del input                           
  const elementRect = elemento.getBoundingClientRect();
  
  //Esas 2 lineas hacen que el mensaje de error aparezca justo debajo y alineado con el input que tiene error
  errorElement.style.top = (elementRect.bottom - modalRect.top + 10) + 'px';
  errorElement.style.left = (elementRect.left - modalRect.left) + 'px';
  
  modalEstudiante.appendChild(errorElement); //muestra el mensaje
  elemento.style.borderColor = '#e74c3c'; //borde del input rojo
  
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 3000);
}

function removerMensajes() {
  const mensajes = document.querySelectorAll('.mensaje-error-estudiante'); //recorre todos los mensajes y los remueve
  mensajes.forEach(mensaje => mensaje.remove());
  
  const inputs = form.querySelectorAll('input'); //recorre los input, color del borde
  inputs.forEach(input => input.style.borderColor = '');
}

// === FUNCIONES DE MODALES ===
function abrirModalEstudiante(titulo = 'Nuevo estudiante') {
  modalTitulo.textContent = titulo;
  form.reset(); //resetea el formulario
  removerMensajes();//borra los mensajes de error
  modalEstudiante.classList.remove('oculto'); //muestra el modal quitando la clase oculto
  const primerInput = form.querySelector('input, select, textarea'); //busca el primer input, select o textarea
  if (primerInput) primerInput.focus(); //y si existe se pone el cursor para escribir
}

//Los siguientes codigos agrega la clase oculto para cerrar el modal
function cerrarModalEstudiante() {
  modalEstudiante.classList.add('oculto');
}

function openChangePasswordModal() {
  modalCambioClave.classList.remove('oculto');
}

function closeChangePasswordModal() {
  modalCambioClave.classList.add('oculto');
}

// === EVENTOS (en este caso para cuando se apreta un boton) ===
btnAdd.addEventListener('click', () => abrirModalEstudiante());
cancelarEstudiante.addEventListener('click', cerrarModalEstudiante);
cancelarClave.addEventListener('click', closeChangePasswordModal);

//Para cerrar el modal al apretar fuera
modalEstudiante.addEventListener('click', (e) => {
  if (e.target === modalEstudiante) cerrarModalEstudiante();
});

modalCambioClave.addEventListener('click', (e) => {
  if (e.target === modalCambioClave) closeChangePasswordModal();
});

searchInput.addEventListener('input', function() { //borra los mensajes de error de la busqueda cuando se escribe
  const mensajes = document.querySelectorAll('.mensaje-error-busqueda');
  mensajes.forEach(mensaje => mensaje.remove());
});

form.addEventListener('submit', (e) => { //cuando el usuario intente enviar algo pasa lo siguiente:
  e.preventDefault(); //evita que se recargue la página
  e.stopPropagation(); //evite que se envie el formulario a otro lugar
  
  if (!validarFormulario()) return;
  
  const formData = new FormData(form);
  const estudianteData = {
    codigo: formData.get('codigo'),
    dni: formData.get('dni'),
    nombre: formData.get('nombre'),
    carrera: formData.get('carrera'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono')
  };
  
  console.log('Datos del estudiante válidos:', estudianteData); //para ver los datos en la consola del navegador
  alert('Estudiante registrado correctamente');
  cerrarModalEstudiante();
});

//Para eliminar el borde rojo cuando se escribe
form.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function() {
    this.style.borderColor = '';
    removerMensajes();
  });
});

// --- Función para abrir/cerrar el submenú ---
function toggleSubmenu() {
  var submenu = document.querySelector('.submenu');
  submenu.classList.toggle('open');
}

// === VALIDACIÓN DE CAMBIO DE CLAVE ===
function validarCambioClave() {
  removerMensajesClave(); //borra los mensajes de error anteriores
  
  const currentPassword = document.getElementById('currentPassword').value.trim(); //obtiene la informacion de los inputs
  const newPassword = document.getElementById('newPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  
  let errores = []; //array para almacenar los errores
  
  //pregunta si esta vacio 
  if (!currentPassword) {
      errores.push({ campo: 'currentPassword', mensaje: 'La contraseña actual es obligatoria' });
  } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(currentPassword)) {
      errores.push({ campo: 'currentPassword', mensaje: 'Debe contener letras y números' });
  } else if (currentPassword.length < 6) {
      errores.push({ campo: 'currentPassword', mensaje: 'Mínimo 6 caracteres' });
  }
  
  if (!newPassword) {
      errores.push({ campo: 'newPassword', mensaje: 'La nueva contraseña es obligatoria' });
  } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(newPassword)) {
      errores.push({ campo: 'newPassword', mensaje: 'Debe contener letras y números' });
  } else if (newPassword.length < 6) {
      errores.push({ campo: 'newPassword', mensaje: 'Mínimo 6 caracteres' });
  }
  
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
  const elemento = document.getElementById(campoId);
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
  
  //Para posicionar el mensaje cerca del input dentro del modal
         //guarda la posicion y tamaño del modal y obtiene las coordenadas del elemento y del modal
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

//para borrar los mensajes de error en el cambio de clave
function removerMensajesClave() {
  const mensajes = document.querySelectorAll('.mensaje-error-clave');
  mensajes.forEach(mensaje => mensaje.remove());
  
  const inputs = document.querySelectorAll('#modalCambioClave input');
  inputs.forEach(input => input.style.borderColor = '');
}

// Configurar el formulario de cambio de clave
// Esperar a que el DOM/HTML este cargado para poder ejecutar
document.addEventListener('DOMContentLoaded', function() {
  const formCambioClave = document.querySelector('#modalCambioClave .formulario'); //obtiene el formulario
  
  //Si existe
  if (formCambioClave) {
      formCambioClave.addEventListener('invalid', function(e) {
          e.preventDefault(); //evita mensajes nativos del navegador
      }, true);
      
      formCambioClave.addEventListener('submit', function(e) {
          e.preventDefault(); //evita que se recargue la página
          
          if (validarCambioClave()) {
              alert('Contraseña cambiada correctamente');
              closeChangePasswordModal();
          }
      });
      
      const inputs = formCambioClave.querySelectorAll('input');
      inputs.forEach(input => {
          input.addEventListener('input', function() {
              this.style.borderColor = ''; //borra el borde rojo
              removerMensajesClave(); //borra los mensajes de error
          });
      });
  }
});


//Formato semiestructurado xml

function cargarEstudiantesXML() {
  fetch('Estudiantes.xml')
    .then(res => res.text())
    .then(str => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "application/xml");
      const estudiantes = xmlDoc.getElementsByTagName('estudiante');
      const tbody = document.querySelector('#tablaEst tbody');
      tbody.innerHTML = '';

      for (let i = 0; i < estudiantes.length; i++) {
        const codigo = estudiantes[i].getElementsByTagName('codigo')[0].textContent;
        const dni = estudiantes[i].getElementsByTagName('dni')[0].textContent;
        const nombre = estudiantes[i].getElementsByTagName('nombre')[0].textContent;
        const carrera = estudiantes[i].getElementsByTagName('carrera')[0].textContent;
        const direccion = estudiantes[i].getElementsByTagName('direccion')[0].textContent;
        const telefono = estudiantes[i].getElementsByTagName('telefono')[0].textContent;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${codigo}</td>
          <td>${dni}</td>
          <td>${nombre}</td>
          <td>${carrera}</td>
          <td>${direccion}</td>
          <td>${telefono}</td>
          <td>
            <button class="btn-edit">Editar</button>
            <button class="btn-delete">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      }
    });
}

document.addEventListener('DOMContentLoaded', cargarEstudiantesXML);
