document.getElementById("logoutButton").addEventListener("click", () => {
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.href = "/Sesion";
});

//Definicion de las variables
const Url = 'http://localhost:8080/api/products/'

const contenedor = document.querySelector('tbody')
let resultado = ''
let idProducto = '';

const formProducts = document.querySelector('form')
const IMAGEN = document.getElementById('Image')
const NOMBRE_PRODUCTO = document.getElementById('Name')
const DESCRIP_PRODUCTO = document.getElementById('Description')
const COLOR_PRODUCTO = document.getElementById('Colors')
const ESTADO_PRODUCTO = document.getElementById('Estado')
const GEN_PRODUCTO = document.getElementById('Genero')
const FK_ID_CATEGORIA = document.getElementById('Categories')
const TALLAS_PRODUCTO = document.getElementById('Size')
const STOCK_PRODUCTO = document.getElementById('Stock')
const PRECIO_PRODUCTO = document.getElementById('Prices')

let opcion = ''

// Function to create a new product
const crearProducto = () => {
    const formData = new FormData(document.getElementById('miFormulario'))

    // Agrega las tallas al formData
    const tallas = TALLAS_PRODUCTO.value.split(','); // Asume que las tallas están separadas por comas
    formData.append('TALLAS', JSON.stringify(tallas));

    if (!formData.has('IMAGEN')) {
        console.error('No se ha seleccionado una imagen');
        return;
    }
    // Send a POST request to create the product
    fetch(Url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            obtenerProductoDesdeServidor();
        })
        .catch(error => console.log(error));
    alertify.message('¡Producto creado con éxito!');
};

btnCrear.addEventListener('click', () => {
    IMAGEN.value = '';
    NOMBRE_PRODUCTO.value = '';
    DESCRIP_PRODUCTO.value = '';
    COLOR_PRODUCTO.value = '';
    ESTADO_PRODUCTO.value = '';
    GEN_PRODUCTO.value = '';
    FK_ID_CATEGORIA.value = '';
    TALLAS_PRODUCTO.value = '';
    STOCK_PRODUCTO.value = '';
    PRECIO_PRODUCTO.value = '';

    modalProducts.show();
    opcion = 'crear';
})

// Function to display the results
const mostrar = (productos) => {
    resultado = '';

    productos.forEach(producto1 => {
        const imagenUrl = `${producto1.IMAGEN}`
        resultado += `
    <tr>
        <td>${producto1.ID_PRODUCTO}</td>
        <td><img src="../../Upload/Products/${imagenUrl}" class="ima" width="45px" height="45px"></td>
        <td>${producto1.NOMBRE_PRODUCTO}</td>
        <td>${producto1.DESCRIP_PRODUCTO}</td>
        <td>${producto1.COLOR_PRODUCTO}</td> 
        <td>${producto1.ESTADO_PRODUCTO}</td>
        <td>${producto1.GEN_PRODUCTO}</td>
        <td>${producto1.FK_ID_CATEGORIA}</td>
        <td>${producto1.TALLAS_PRODUCTO}</td>
        <td>${producto1.STOCK_PRODUCTO}</td>
        <td>${producto1.PRECIO_PRODUCTO}</td>
        <td class="text-center"><a class="btnEditar btn btn-dark btn-sm">Editar</a><a class="btnEliminar btn btn-dark btn-sm">Eliminar</a></td>
    </tr>`;
    });
    contenedor.innerHTML = resultado;
};

// Procedure to display the products
const obtenerProductoDesdeServidor = () => {
    fetch(Url)
        .then(response => response.json())
        .then(data => mostrar(data))
        .catch(error => console.log(error));
}

window.addEventListener('load', obtenerProductoDesdeServidor);

// Agrega el evento submit al formulario
formProducts.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que el formulario se envíe automáticamente
    crearProducto();
});

let modalProducts = new bootstrap.Modal(document.getElementById('modalProducts'), {
    keyboard: false
});

// Function to edit a product
const editarProducto = (idProducto) => {
    const formData = new FormData(document.getElementById('miFormulario'))

    // Agrega las tallas al formData
    const tallas = TALLAS_PRODUCTO.value.split(','); // Asume que las tallas están separadas por comas
    formData.append('TALLAS', JSON.stringify(tallas));


    if (!formData.has('IMAGEN')) {
        console.error('No se ha seleccionado una imagen');
        return;
    }

    fetch(Url + idProducto.trim(), {
        method: 'PUT',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            obtenerProductoDesdeServidor(); // Actualiza la tabla después de editar el producto
        })
        .catch(error => console.log(error));

    alertify.message('¡Producto Actualizado con éxito!');
};

// Agregar un evento de escucha a la tabla para manejar clics en los botones "Editar"
contenedor.addEventListener('click', (e) => {
    if (e.target.classList.contains('btnEditar')) {
        idProducto = e.target.parentElement.parentElement.firstElementChild.textContent.trim();

        // Obtén los datos actuales del producto
        const nombreProducto = e.target.parentElement.parentElement.children[2].textContent;
        const descripProducto = e.target.parentElement.parentElement.children[3].textContent;
        const colorProducto = e.target.parentElement.parentElement.children[4].textContent;
        const estadoProducto = e.target.parentElement.parentElement.children[5].textContent;
        const genProducto = e.target.parentElement.parentElement.children[6].textContent;
        const fkIdCategoria = e.target.parentElement.parentElement.children[7].textContent;
        const tallasProducto = e.target.parentElement.parentElement.children[8].textContent;
        const stockProducto = e.target.parentElement.parentElement.children[9].textContent;
        const precioProducto = e.target.parentElement.parentElement.children[10].textContent;

        // Rellena el formulario con los datos actuales del producto
        NOMBRE_PRODUCTO.value = nombreProducto;
        DESCRIP_PRODUCTO.value = descripProducto;
        COLOR_PRODUCTO.value = colorProducto;
        ESTADO_PRODUCTO.value = estadoProducto;
        GEN_PRODUCTO.value = genProducto;
        FK_ID_CATEGORIA.value = fkIdCategoria;
        TALLAS_PRODUCTO.value = tallasProducto;
        STOCK_PRODUCTO.value = stockProducto;
        PRECIO_PRODUCTO.value = precioProducto;

        // Muestra el formulario
        modalProducts.show();

        // Cambia la opción a 'editar'
        opcion = 'editar';
    }
});

// Modificar el controlador de eventos del botón "Enviar" para manejar la edición de productos
document.getElementById('btnEnviar').addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData(document.getElementById('miFormulario'));

    if (opcion == 'crear') {
        alertify.confirm('¿Estás seguro de que quieres crear este producto?', function () {
            fetch(Url, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    obtenerProductoDesdeServidor(); // Actualiza la tabla después de agregar el producto
                })
                .catch(error => console.log(error));
                alertify.message('¡Producto creado con éxito!');
        });
    } else if (opcion == 'editar') {
        alertify.confirm('¿Estás seguro de que quieres editar este producto?', function () {
            fetch(Url + idProducto.trim(), {
                method: 'PUT',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    obtenerProductoDesdeServidor(); // Actualiza la tabla después de editar el producto
                    alertify.message('¡Producto Actualizado con éxito!');
                })
                .catch(error => console.log(error));
        });
    }

    modalProducts.hide();
});

// Function to delete a product
const eliminarProducto = (idProducto) => {
    // Pregunta al usuario si está seguro de eliminar el producto utilizando alertify.confirm
    alertify.confirm("¿Estás seguro de eliminar este producto?",
        function () {
            // Si el usuario hace clic en "Aceptar", envía una solicitud DELETE para eliminar el producto por su ID
            fetch(Url + idProducto.trim(), {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Log the response from the server
                    // Actualiza la tabla después de eliminar el producto
                    obtenerProductoDesdeServidor();
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
        idProducto = e.target.parentElement.parentElement.firstElementChild.textContent.trim();
        eliminarProducto(idProducto);
    }
});

const searchInput = document.getElementById('buscar');

searchInput.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    fetch(Url)
        .then(response => response.json())
        .then(data => {
            const filteredProducts = data.filter(product => 
                product.NOMBRE_PRODUCTO.toLowerCase().includes(searchString)
            );
            mostrar(filteredProducts);
        })
        .catch(error => console.log(error));
});