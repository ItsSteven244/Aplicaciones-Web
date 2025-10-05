document.addEventListener("DOMContentLoaded", function() {
    // Obtener el formulario
    const form = document.getElementById("Formulario");

    // Agregar el evento de envío (submit)
    form.addEventListener("submit", function(event) {
        // Evitar que el formulario se envíe si las validaciones no son correctas
        event.preventDefault();

        // Obtener los valores de los inputs
        const cedulaInput = document.getElementById("cedula");
        const nombreInput = document.getElementById("nombre");
        const apellidoInput = document.getElementById("apellido");
        const direccionInput = document.getElementById("direccion");
        const telefonoInput = document.getElementById("telefono");
        const emailInput = document.getElementById("email");
        const generoInput = document.getElementById("genero");

        const cedula = cedulaInput.value;
        const nombre = nombreInput.value;
        const apellido = apellidoInput.value;
        const direccion = direccionInput.value;
        const telefono = telefonoInput.value;
        const email = emailInput.value;
        const genero = generoInput.value;

        // Limpiar los mensajes de error anteriores
        clearErrors();

        let valid = true; // bandera general

        // Validación de cédula
        if (!/^\d{10}$/.test(cedula)) {
            showError('cedula-error', "La cédula debe tener 10 dígitos.");
            cedulaInput.value = ""; // 🔹 Limpia campo con error
            valid = false;
        }

// Validación de nombre
if (nombre.trim() === "") {
    showError('nombre-error', "El campo 'Nombre' es obligatorio.");
    nombreInput.value = "";
    valid = false;
} else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
    showError('nombre-error', "El campo 'Nombre' solo debe contener letras.");
    nombreInput.value = "";
    valid = false;
}

// Validación de apellido
if (apellido.trim() === "") {
    showError('apellido-error', "El campo 'Apellido' es obligatorio.");
    apellidoInput.value = "";
    valid = false;
} else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellido)) {
    showError('apellido-error', "El campo 'Apellido' solo debe contener letras.");
    apellidoInput.value = "";
    valid = false;
}


        // Validación de dirección
        if (direccion.trim() === "") {
            showError('direccion-error', "El campo 'Dirección' es obligatorio.");
            direccionInput.value = "";
            valid = false;
        }

        // Validación de teléfono
        if (!/^\d{10}$/.test(telefono)) {
            showError('telefono-error', "El teléfono debe tener 10 dígitos.");
            telefonoInput.value = "";
            valid = false;
        }

        // Validación de email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            showError('email-error', "Por favor ingresa un correo electrónico válido.");
            emailInput.value = "";
            valid = false;
        }

        // Validación de género
        if (genero === "") {
            showError('genero-error', "Por favor seleccione su género.");
            generoInput.value = "";
            valid = false;
        }

        // Si todo está correcto
        if (valid) {
            alert("Formulario enviado correctamente.");
            form.submit();
        }
    });

    // Mostrar error debajo del campo
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }

    // Limpiar todos los mensajes de error
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = "");
    }
});
