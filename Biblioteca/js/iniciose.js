// iniciose.js Validaciones
document.addEventListener('DOMContentLoaded', function() {    /* Espera a que la página se cargue */
    const loginButton = document.querySelector('.botónIS');
    
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();         /* Estas lineas evitan que se recargue la página, primero se verifica si no hay errores */    
        
        const email = document.getElementById('email');    /* Para guardar el email, pero primera busca el id "email" */
        const password = document.getElementById('password');
        
        // Limpiar estilos y mensajes anteriores
        email.style.borderColor = '';
        password.style.borderColor = '';
        removerTodosLosMensajes();
        
        //Para crear una lista vacia donde se van a guardar los errores
        let errores = [];
        
        // Validar email
        if (email.value === '') {
            errores.push({ campo: email, mensaje: 'El correo electrónico es obligatorio' });
        } else if (!validarEmailUleam(email.value)) {
            errores.push({ campo: email, mensaje: 'Formato: e0123456789@live.uleam.edu.ec' });
        }
        
        // Validar contraseña
        if (password.value === '') {
            errores.push({ campo: password, mensaje: 'La contraseña es obligatoria' });
        } else if (password.value.length < 6) {
            errores.push({ campo: password, mensaje: 'Mínimo 6 caracteres' });
        }
        
        
        // Mostrar TODOS los errores 
        if (errores.length > 0) {
            errores.forEach(error => {
                error.campo.style.borderColor = 'red';
                mostrarMensajeCerca(error.campo, error.mensaje, 'error');
            });
        } else {
            mostrarMensajeCerca(loginButton, 'Inicio de sesión exitoso', 'exito');
        }
    });
    
    // Función para validar el formato de email
    function validarEmailUleam(email) {
        const regexUleam = /^e\d{10}@live\.uleam\.edu\.ec$/;
        return regexUleam.test(email);
    }
    
    function mostrarMensajeCerca(elemento, mensaje, tipo) {   //Mostrar mensajes emergentes
        console.log('Mostrando mensaje:', mensaje);
        
        // Crear mensaje
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'mensaje-error-toast';
        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.position = 'fixed'; //Para fijar el mensaje
        mensajeDiv.style.background = tipo === 'error' ? '#e74c3c' : '#2ecc71'; //Si hay error se cambia el color y asi sucesivamente
        mensajeDiv.style.color = 'white';
        mensajeDiv.style.padding = '10px 15px';
        mensajeDiv.style.borderRadius = '5px';
        mensajeDiv.style.fontSize = '14px';
        mensajeDiv.style.fontWeight = 'bold'; //Negrita
        mensajeDiv.style.zIndex = '1000'; //El texto al frente
        mensajeDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        mensajeDiv.style.whiteSpace = 'nowrap';  //No saltos de linea
        
        // Posicionar relativo al elemento
        const rect = elemento.getBoundingClientRect(); //Saber exactamente donde esta el elemento
        
        // Posicionar justo debajo del elemento
        mensajeDiv.style.top = (rect.bottom + 5) + 'px';
        mensajeDiv.style.left = rect.left + 'px';
        
        // Agregar al body
        document.body.appendChild(mensajeDiv);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (mensajeDiv.parentNode) {
                mensajeDiv.remove();
            }
        }, 3000);
    }
    
    function removerTodosLosMensajes() {
        const mensajes = document.querySelectorAll('.mensaje-error-toast');
        mensajes.forEach(mensaje => mensaje.remove());
    }
    
    // Limpiar al escribir, si el borde esta en rojo se limpia
    document.getElementById('email').addEventListener('input', function() {
        this.style.borderColor = '';
        removerTodosLosMensajes();
    }); 

    // Limpiar al escribir, si el borde esta en rojo se limpia
    document.getElementById('password').addEventListener('input', function() {
        this.style.borderColor = '';
        removerTodosLosMensajes();
    });
});
