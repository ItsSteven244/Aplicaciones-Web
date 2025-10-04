document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario
    const form = document.getElementById("Formulario");

    // Agregar el evento de envío (submit)
    form.addEventListener("submit", function(event) {
        // Evitar que el formulario se envíe si las validaciones no son correctas
        event.preventDefault();

        // Obtener los valores de los inputs
        const cedula = document.getElementById("cedula").value;
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const direccion = document.getElementById("direccion").value;
        const telefono = document.getElementById("telefono").value;
        const email = document.getElementById("email").value;

        // Limpiar los mensajes de error anteriores
        clearErrors();

        // Variable para verificar si todo está bien
        let valid = true;

        // Validación de cédula (por ejemplo, debe ser un número de 10 dígitos)
        if (!/^\d{10}$/.test(cedula)) {
            showError('cedula-error', "La cédula debe tener 10 dígitos.");
            valid = false;
        }

        // Validación de nombre (no debe estar vacío)
        if (nombre.trim() === "") {
            showError('nombre-error', "El campo 'Nombre' es obligatorio.");
            valid = false;
        }

        // Validación de apellido (no debe estar vacío)
        if (apellido.trim() === "") {
            showError('apellido-error', "El campo 'Apellido' es obligatorio.");
            valid = false;
        }

        // Validación de dirección (no debe estar vacío)
        if (direccion.trim() === "") {
            showError('direccion-error', "El campo 'Dirección' es obligatorio.");
            valid = false;
        }

        // Validación de teléfono (debe tener 10 dígitos numéricos)
        if (!/^\d{10}$/.test(telefono)) {
            showError('telefono-error', "El teléfono debe tener 10 dígitos.");
            valid = false;
        }

        // Validación de email (expresión regular para un formato básico de email)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            showError('email-error', "Por favor ingresa un correo electrónico válido.");
            valid = false;
        }

        // Si todas las validaciones son correctas, enviar el formulario
        if (valid) {
            alert("Formulario enviado correctamente.");
            form.submit(); // Si todo es válido, el formulario se enviará
        }
    });

    // Función para mostrar el mensaje de error debajo del campo
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message; // Coloca el mensaje de error en el span correspondiente
    }

    // Función para limpiar los mensajes de error
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = ""); // Limpia el texto de los errores previos
    }
});
