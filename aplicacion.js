
/* ==========================================
   TALLER 6 - CRUD DE LIBROS
   FASE 3: LÓGICA CON JAVASCRIPT
   ========================================== */

// 1. ESTADO DE LA APLICACIÓN

// Recuperar libros guardados en el navegador
let libros = JSON.parse(localStorage.getItem('listaLibros')) || [];

// Indicar si estamos editando un libro
let estaEditando = false;


// 2. ELEMENTOS DEL DOM

const formulario = document.getElementById('formulario-crud');
const entradaTitulo = document.getElementById('titulo');
const entradaAutor = document.getElementById('autor');
const entradaId = document.getElementById('id-elemento');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');


// 3. OPERACIÓN READ - LEER LIBROS

function renderizarLibros() {

    // Limpiar la tabla antes de mostrar los datos
    cuerpoTabla.innerHTML = '';

    // Verificar si existen libros registrados
    if (libros.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">
                    No hay libros registrados.
                </td>
            </tr>
        `;

        localStorage.setItem('listaLibros', JSON.stringify(libros));
        return;
    }

    // Recorrer el arreglo de libros
    libros.forEach(libro => {

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>
                <button class="btn-editar"
                    onclick="prepararEdicion('${libro.id}')">
                    Editar
                </button>

                <button class="btn-eliminar"
                    onclick="eliminarLibro('${libro.id}')">
                    Eliminar
                </button>
            </td>
        `;

        cuerpoTabla.appendChild(fila);
    });

    // Guardar los datos en localStorage
    localStorage.setItem('listaLibros', JSON.stringify(libros));
}


// 4. OPERACIONES CREATE Y UPDATE

formulario.addEventListener('submit', (evento) => {

    // Evitar que la página se recargue
    evento.preventDefault();

    // Obtener datos ingresados
    const valorTitulo = entradaTitulo.value.trim();
    const valorAutor = entradaAutor.value.trim();
    const idActual = entradaId.value;

    // Validar los campos
    if (valorTitulo === '' || valorAutor === '') {
        alert('Por favor, complete todos los campos.');
        return;
    }

    if (estaEditando) {

        // UPDATE: actualizar el libro seleccionado
        libros = libros.map(libro =>
            libro.id === idActual
                ? {
                    ...libro,
                    titulo: valorTitulo,
                    autor: valorAutor
                }
                : libro
        );

    } else {

        // CREATE: crear un libro nuevo
        const nuevoLibro = {
            id: crypto.randomUUID(),
            titulo: valorTitulo,
            autor: valorAutor
        };

        // Agregar al arreglo
        libros.push(nuevoLibro);
    }

    // Limpiar el formulario
    reiniciarFormulario();

    // Actualizar la tabla
    renderizarLibros();
});


// 5. PREPARAR EDICIÓN

window.prepararEdicion = function(id) {

    // Buscar el libro por su ID
    const libroEncontrado = libros.find(
        libro => libro.id === id
    );

    if (!libroEncontrado) return;

    // Cargar los datos en el formulario
    entradaTitulo.value = libroEncontrado.titulo;
    entradaAutor.value = libroEncontrado.autor;
    entradaId.value = libroEncontrado.id;

    // Activar el modo edición
    estaEditando = true;

    botonGuardar.textContent = 'Actualizar Libro';
    botonCancelar.classList.remove('oculto');
};


// 6. OPERACIÓN DELETE - ELIMINAR

window.eliminarLibro = function(id) {

    // Confirmar antes de eliminar
    const confirmar = confirm(
        '¿Está seguro de que desea eliminar este libro?'
    );

    if (confirmar) {

        // Eliminar el libro seleccionado
        libros = libros.filter(
            libro => libro.id !== id
        );

        // Si estaba editándose, limpiar formulario
        if (estaEditando && entradaId.value === id) {
            reiniciarFormulario();
        }

        // Actualizar tabla y almacenamiento
        renderizarLibros();
    }
};


// 7. CANCELAR EDICIÓN

botonCancelar.addEventListener(
    'click',
    reiniciarFormulario
);


// 8. REINICIAR FORMULARIO

function reiniciarFormulario() {

    formulario.reset();

    entradaId.value = '';

    estaEditando = false;

    botonGuardar.textContent = 'Guardar Libro';

    botonCancelar.classList.add('oculto');
}


// 9. INICIALIZAR APLICACIÓN

renderizarLibros();
