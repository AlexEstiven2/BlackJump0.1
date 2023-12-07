document.getElementById("logoutButton").addEventListener("click", () => {
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.href = "/Sesion";
});

//Definicion de las variables
const Url = 'http://localhost:8080/api/categories/'

const contenedor = document.querySelector('tbody')
let resultado = '';
let idCategoria = '';

const formCategory = document.querySelector('form')
const IMAGEN = document.getElementById('Image')
const NOMBRE_CATE = document.getElementById('Category')
const ESTADO_CATE = document.getElementById('Estado')
const FK_ID_GEN = document.getElementById('Genero')

let opcion = ''

// Función para crear una nueva categoría
const crearCategory = () => {
    const formData = new FormData(document.getElementById('tuFormulario'));

    if (!formData.has('IMAGEN')) {
        console.error('No se ha seleccionado una imagen');
        return;
    }

    fetch(Url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            obtenerCategoriasDesdeServidor(); // Actualiza la tabla después de agregar la categoría
        })
        .catch(error => console.log(error));

    alertify.message('¡Categoría creada con éxito!');
};

btnCrear.addEventListener('click', () => {
    IMAGEN.value = '';
    NOMBRE_CATE.value = '';
    ESTADO_CATE.value = '';
    FK_ID_GEN.value = '';

    modalCategory.show();
    opcion = 'crear';
});

// Función para mostrar las categorías
const mostrar = (categories) => {
    resultado = ''; // Reiniciar resultado para evitar duplicados

    categories.forEach(category1 => {
        // Construir la URL completa de la imagen utilizando la ruta de la imagen en la base de datos
        const imagenUrl = `${category1.IMAGEN}`;
        resultado += `
        <tr>
            <td>${category1.ID_CATEGORIA}</td>
            <td><img src="../../Upload/Categories/${imagenUrl}" class="ima"></td>
            <td>${category1.NOMBRE_CATE}</td>
            <td>${category1.ESTADO_CATE}</td>
            <td>${category1.FK_ID_GEN}</td>
            <td class="text-center"><a class="btnEditar btn btn-dark btn-sm">Editar</a><a class="btnEliminar btn btn-dark btn-sm">Eliminar</a></td>
        </tr>`; 
    });

    contenedor.innerHTML = resultado;
};

//Procedure to display the categories
const obtenerCategoriasDesdeServidor = () => {
    fetch(Url)
        .then(response => response.json())
        .then(data => mostrar(data))
        .catch(error => console.log(error));
};

// Llama a la función para obtener categorías cuando se carga la página
window.addEventListener('load', obtenerCategoriasDesdeServidor);



var modalCategory = new bootstrap.Modal(document.getElementById('modalCategory'), {});

// Función para editar una categoría
const editarCategoria = (idCategoria) => {
    const formData = new FormData(document.getElementById('tuFormulario'));

    if (!formData.has('IMAGEN')) {
        console.error('No se ha seleccionado una imagen');
        return;
    }

    fetch(Url + idCategoria, {
        method: 'PUT',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            obtenerCategoriasDesdeServidor(); // Actualiza la tabla después de editar la categoría
        })
        .catch(error => console.log(error));

    alertify.message('¡Categoría Actualizada con éxito!');
};

// Agregar un evento de escucha a la tabla para manejar clics en los botones "Editar"
contenedor.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnEditar')) {
        idCategoria = e.target.parentElement.parentElement.firstElementChild.textContent;
        
        // Obtén los datos actuales de la categoría
        const nombreCategoria = e.target.parentElement.parentElement.children[2].textContent;
        const estadoCategoria = e.target.parentElement.parentElement.children[3].textContent;
        const fkIdGen = e.target.parentElement.parentElement.children[4].textContent;

        // Rellena el formulario con los datos actuales de la categoría
        NOMBRE_CATE.value = nombreCategoria;
        ESTADO_CATE.value = estadoCategoria;
        FK_ID_GEN.value = fkIdGen;

        // Muestra el formulario
        modalCategory.show();

        // Cambia la opción a 'editar'
        opcion = 'editar';
    }
});

//Agrega el evento submit al formulario
document.getElementById('btnEnviar').addEventListener('click', (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de la manera predeterminada

    const formData = new FormData(document.getElementById('tuFormulario'));

    if (opcion == 'crear') {
        alertify.confirm('¿Estás seguro de que quieres crear esta categoría?', function () {
            fetch(Url, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                obtenerCategoriasDesdeServidor(); // Actualiza la tabla después de agregar la categoría
            })
            .catch(error => console.log(error));

            alertify.message('¡Categoría creada con éxito!');
        });
    } else if (opcion == 'editar') {
        alertify.confirm('¿Estás seguro de que quieres editar esta categoría?', function () {
            fetch(Url + idCategoria, {
                method: 'PUT',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                obtenerCategoriasDesdeServidor(); // Actualiza la tabla después de editar la categoría
            })
            .catch(error => console.log(error));

            alertify.message('¡Categoría Actualizada con éxito!');
        });
    }

    // Cierra el formulario después de agregar o editar la categoría
    modalCategory.hide();
});

// Agregar una función para eliminar una categoría por su ID
const eliminarCategoria = (idCategoria) => {
    // Pregunta al usuario si está seguro de eliminar la categoría utilizando alertify.confirm
    alertify.confirm("¿Estás seguro de eliminar esta categoría?",
        function () {
            // Si el usuario hace clic en "Aceptar", envía una solicitud DELETE para eliminar la categoría por su ID
            fetch(Url + idCategoria, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Log the response from the server
                    // Actualiza la tabla después de eliminar la categoría
                    obtenerCategoriasDesdeServidor();
                })
                .catch(error => console.log(error));
            alertify.success('Eliminado');

        },
        function () {
            // Si el usuario hace clic en "Cancelar", muestra un mensaje de error
            alertify.error('Cancel');
        });
};

// Agregar un evento de escucha a la tabla para manejar clics en los botones "Eliminar"
contenedor.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnEliminar')) {
        const idCategoria = e.target.parentElement.parentElement.firstElementChild.textContent;
        eliminarCategoria(idCategoria);
    }
});

const searchInput = document.getElementById('buscar');

// Agrega un evento de escucha al campo de búsqueda
searchInput.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    // Obtén todas las categorías del servidor y filtra según la búsqueda
    fetch(Url)
        .then(response => response.json())
        .then(data => {
            const filteredCategories = data.filter(category => 
                category.NOMBRE_CATE.toLowerCase().includes(searchString)
            );
            mostrar(filteredCategories);
        })
        .catch(error => console.log(error));
});