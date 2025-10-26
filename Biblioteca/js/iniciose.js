// iniciose.js Validaciones
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('.botónIS');
    
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Botón clickeado');
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        // Limpiar estilos y mensajes anteriores
        email.style.borderColor = '';
        password.style.borderColor = '';
        removerTodosLosMensajes();
        
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
        
        console.log('Errores encontrados:', errores.length);
        
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
    
    function validarEmailUleam(email) {
        const regexUleam = /^e\d{10}@live\.uleam\.edu\.ec$/;
        return regexUleam.test(email);
    }
    
    function mostrarMensajeCerca(elemento, mensaje, tipo) {
        console.log('Mostrando mensaje:', mensaje);
        
        // Crear mensaje
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'mensaje-error-toast';
        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.position = 'fixed';
        mensajeDiv.style.background = tipo === 'error' ? '#e74c3c' : '#2ecc71';
        mensajeDiv.style.color = 'white';
        mensajeDiv.style.padding = '10px 15px';
        mensajeDiv.style.borderRadius = '5px';
        mensajeDiv.style.fontSize = '14px';
        mensajeDiv.style.fontWeight = 'bold';
        mensajeDiv.style.zIndex = '1000';
        mensajeDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        mensajeDiv.style.whiteSpace = 'nowrap';
        
        // Posicionar relativo al elemento
        const rect = elemento.getBoundingClientRect();
        
        // Posicionar justo debajo del elemento
        mensajeDiv.style.top = (rect.bottom + 5) + 'px';
        mensajeDiv.style.left = rect.left + 'px';
        
        // Agregar al body
        document.body.appendChild(mensajeDiv);
        
        console.log('Mensaje agregado en posición:', rect.bottom + 5, rect.left);
        
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
    
    // Limpiar al escribir
    document.getElementById('email').addEventListener('input', function() {
        this.style.borderColor = '';
        removerTodosLosMensajes();
    });
    
    document.getElementById('password').addEventListener('input', function() {
        this.style.borderColor = '';
        removerTodosLosMensajes();
    });
});