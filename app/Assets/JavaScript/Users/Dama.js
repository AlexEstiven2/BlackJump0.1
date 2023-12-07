// Dama.js

//Code perfil
document.addEventListener("DOMContentLoaded", function () {
    const userMenuTrigger = document.getElementById("userMenuTrigger");
    const userMenu = document.getElementById("userMenu");

    userMenuTrigger.addEventListener("click", function (e) {
        e.preventDefault();
        userMenu.classList.toggle("active");
    });

    // Cerrar el menú si se hace clic en cualquier parte fuera de él
    document.addEventListener("click", function (e) {
        if (!userMenu.contains(e.target) && !userMenuTrigger.contains(e.target)) {
            userMenu.classList.remove("active");
        }
    });
});
//Termina code perfil

//Code cerrar Sesion
document.querySelector(".CerrarSesion").addEventListener("click", () => {
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.href = "/Sesion";
});
//Termina code cerrar Sesion

// Hacer una solicitud a la API para obtener las categorías de damas
fetch('http://localhost:8080/api/categories/Damas')
    .then(response => response.json())
    .then(categorias => {
        renderizarCategorias(categorias); // Llama a la función de renderizado
    })
    .catch(error => console.error('Error al obtener categorías: ', error));

// Función para renderizar las categorías en la página
function renderizarCategorias(categorias) {
    const contenedorCategorias = document.querySelector('.categorias-scroll');
    let resultado = '';

    categorias.forEach(category => {
        const imagenUrl = `${category.IMAGEN}`;
        resultado += `
        <div class="categoria" data-id="${category.ID_CATEGORIA}">
            <a href="/Productos/${category.ID_CATEGORIA}"><img class="cat" src="../../Upload/Categories/${imagenUrl}"></a>
            <h2 class="h5 text-center mt-3 mb-3">${category.NOMBRE_CATE}</h2>
        </div>
    `;
    });

    contenedorCategorias.innerHTML = resultado; 
}
//Termina hacer una solicitud a la API para obtener las categorías de damas

// Hacer una solicitud a la API para obtener los Productos de Damas
import { agregarAlCarrito as agregarAlCarritoShop } from './Carrito.js';

document.addEventListener('DOMContentLoaded', function () {

    // Asegúrate de que este elemento exista en tu HTML
    const contenedorProductos = document.getElementById('card-carousel');

    function obtenerProductos(categorias) {
        // Asegúrate de que esta URL es correcta y que tu servidor está corriendo
        fetch(`http://localhost:8080/api/products/Damas/${categorias}`)
            .then(response => response.json())
            .then(productos => {
                if (Array.isArray(productos)) {
                    const cardCarousel = document.querySelector(`#${categorias}-container .card-carousel`);
                    if (cardCarousel) {
                        renderizarProductos(productos, cardCarousel);
                    } else {
                        console.error('Error: Contenedor de productos no encontrado');
                    }
                } else {
                    console.error('Error: La respuesta de la API no es un array');
                }
            })
            .catch(error => console.error('Error al obtener productos: ', error));
    }

    // Asegúrate de que estas categorías coinciden exactamente con las categorías en tu base de datos
    obtenerProductos(encodeURIComponent('Gorros'));
    obtenerProductos('Camisas');
    obtenerProductos('Busos');
    obtenerProductos('Camibusos');
    obtenerProductos('Pantalones');
    obtenerProductos('Conjuntos');    

    function renderizarProductos(productos, container) {
        let resultado = '';

        productos.forEach(producto => {
            const imagenUrl = `${producto.IMAGEN_PRODUCTO}`;

            let colores = '';
            let colorSeleccionado = 'No hay colores disponibles para este producto.';
            if (Array.isArray(producto.COLOR_PRODUCTO) && producto.COLOR_PRODUCTO.length > 0) {
                colorSeleccionado = producto.COLOR_PRODUCTO[0];
                colores += `<select id="color${producto.ID_PRODUCTO}" name="color${producto.ID_PRODUCTO}">`;
                producto.COLOR_PRODUCTO.forEach((color, index) => {
                    if (index === 0) {
                        colores += `<option value="${color}" selected>${color}</option>`;
                    } else {
                        colores += `<option value="${color}">${color}</option>`;
                    }
                });
                colores += `</select>`;
            }

            let tallas = '';
            if (Array.isArray(producto.TALLAS_PRODUCTO) && producto.TALLAS_PRODUCTO.length > 0) {
                producto.TALLAS_PRODUCTO.forEach((talla, index) => {
                    tallas += `
                        <label for="talla${producto.ID_PRODUCTO}${index}">
                            <input type="radio" id="talla${producto.ID_PRODUCTO}${index}" name="talla${producto.ID_PRODUCTO}" value="${talla}">
                            ${talla}
                        </label>
                    `;
                });
            } else {
                tallas = 'No hay tallas disponibles para este producto.';
            }
            // Agregar select de cantidad
            let cantidad = '';
            cantidad += `<select id="cantidad${producto.ID_PRODUCTO}" name="cantidad${producto.ID_PRODUCTO}" data-price="${producto.PRECIO_PRODUCTO}">`;
            for (let i = 1; i <= 4; i++) {
                cantidad += `<option value="${i}">${i}</option>`;
            }
            cantidad += `</select>`;

            //Convertir precio en moneda local
            const precioFormateado = producto.PRECIO_PRODUCTO.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

            resultado += `
            <div class="card card-car">
                <img class="Imagen" src="../../Upload/Products/${imagenUrl}">
                <h3 class="NombreP">${producto.NOMBRE_PRODUCTO}</h3>
                <p class="price">Precio: ${precioFormateado}</p>
                <button type="button" class="btn-add-to-cart" data-bs-toggle="modal" data-bs-target="#modalDetalle${producto.ID_PRODUCTO}">Ver mas</button>
            </div>
            <!--Detalle Productos-->
            <div class="modal fade" id="modalDetalle${producto.ID_PRODUCTO}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">${producto.NOMBRE_PRODUCTO}</h5>
                            <button type="button" class="btn-close close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="details">
                                        <h3 class="NombreP">${producto.NOMBRE_PRODUCTO}</h3>
                                        <p class="description">${producto.DESCRIP_PRODUCTO}</p>     
                                        <p class="estado">Estado: ${producto.ESTADO_PRODUCTO}</p>
                                        <p class="genero">Género: ${producto.GEN_PRODUCTO}</p>
                                        <div class="color">Color: ${colores}</div>
                                        <p class="selected-color">Color seleccionado: <span id="selectedColor${producto.ID_PRODUCTO}">${colorSeleccionado}</span></p> 
                                        <div class="tallas"><p class="ta">TALLAS</p>${tallas}</div>
                                        <p class="selected-size">Talla seleccionada: <span id="selectedSize${producto.ID_PRODUCTO}"></span></p>
                                        <div class="cantidad">Cantidad: ${cantidad}</div>
                                        <p class="total-price">Precio total: $<span id="totalPrice${producto.ID_PRODUCTO}">${precioFormateado}</span></p>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="ecommerce-gallery" data-mdb-zoom-effect="true" data-mdb-auto-height="true">
                                        <div class="row py-2 shadow-5">
                                            <div class="col-12 mb-2">
                                                <div class="lightbox">
                                                    <img src="../../Upload/Products/${imagenUrl}" alt="${producto.NOMBRE_PRODUCTO}" class="ecommerce-gallery-main-img active w-100" />
                                                </div>
                                            </div>
                                            <!-- Imágenes adicionales de la galería -->
                                            <div class="col-4 mt-1 mb-1">
                                                <img src="../../Upload/Products/${imagenUrl}" data-mdb-img="../../Upload/Products/${imagenUrl}" alt="${producto.NOMBRE_PRODUCTO}" class="active w-100" />
                                            </div>
                                            <div class="col-4 mt-1 mb-1">
                                                <img src="../../Upload/Products/${imagenUrl}" data-mdb-img="../../Upload/Products/${imagenUrl}" alt="${producto.NOMBRE_PRODUCTO}" class="active w-100" />
                                            </div>
                                            <div class="col-4 mt-1 mb-1">
                                                <img src="../../Upload/Products/${imagenUrl}" data-mdb-img="../../Upload/Products/${imagenUrl}" alt="${producto.NOMBRE_PRODUCTO}" class="active w-100" />
                                            </div>
                                            <!-- Agrega más imágenes aquí si es necesario -->
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-white" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-black agregar-al-carrito" data-id="${producto.ID_PRODUCTO}">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
            <!--Terminan Detalles Productos-->
            `;
        });

        container.innerHTML = resultado;

        // Obtener todos los elementos de radio de tallas
        const sizeInputs = document.querySelectorAll('input[name^="talla"]');
        // Agregar un oyente de eventos de cambio a cada botón de radio
        sizeInputs.forEach((input) => {
            input.addEventListener("change", (event) => {
                const selectedSizeElement = document.getElementById(`selectedSize${event.target.name.replace('talla', '')}`);
                selectedSizeElement.textContent = event.target.value;
            });
        });

        productos.forEach((producto) => {
            if (Array.isArray(producto.COLOR_PRODUCTO)) {
                const selectColor = document.getElementById(`color${producto.ID_PRODUCTO}`);
                selectColor.addEventListener('change', () => {
                    const selectedColorElement = document.getElementById(`selectedColor${producto.ID_PRODUCTO}`);
                    selectedColorElement.textContent = selectColor.value;
                });
            }
        
            const selectCantidad = document.getElementById(`cantidad${producto.ID_PRODUCTO}`);
            if (selectCantidad) {
                selectCantidad.addEventListener('change', () => {
                    const precioOriginal = parseFloat(selectCantidad.dataset.price);
                    const cantidad = parseInt(selectCantidad.value);
                    const precioTotal = precioOriginal * cantidad;
                    const precioTotalFormateado = precioTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
                    document.getElementById(`totalPrice${producto.ID_PRODUCTO}`).textContent = precioTotalFormateado;
                });
            }
        });
        
        // ... rest of the function here

        productos.forEach((producto) => {
            const botonAgregarAlCarrito = document.querySelector(`.agregar-al-carrito[data-id="${producto.ID_PRODUCTO}"]`);
            botonAgregarAlCarrito.addEventListener('click', () => {
                const productoParaAgregar = {
                    ...producto,
                    COLOR_PRODUCTO: document.getElementById(`selectedColor${producto.ID_PRODUCTO}`).textContent,
                    TALLAS_PRODUCTO: document.getElementById(`selectedSize${producto.ID_PRODUCTO}`).textContent,
                    CANTIDAD: document.getElementById(`cantidad${producto.ID_PRODUCTO}`).value,
                };
                agregarAlCarritoDamas(productoParaAgregar);
            });
        });
        const agregarAlCarritoDamas = (producto) => {
            if (producto && producto.NOMBRE_PRODUCTO) { // Verifica que el producto sea válido
                console.log(`Producto ${producto.NOMBRE_PRODUCTO} agregado al carrito`);
                agregarAlCarritoShop(producto);  // Llama a agregarAlCarritoShop en lugar de agregarAlCarrito
            } else {
                console.error('Producto no válido');
            }
        }

        // Crea una sola instancia del modal
        const myModalElement = document.getElementById('myModal');
        const modal = new bootstrap.Modal(myModalElement);

        // Manejar el clic en los botones "Ver más" para abrir el modal correspondiente
        productos.forEach(producto => {
            const botonVerMas = document.querySelector(`[data-bs-target="#modalDetalle${producto.ID_PRODUCTO}"]`);
            botonVerMas.addEventListener('click', () => {
                // Configura el modal para el producto actual
                const modalElement = document.getElementById(`modalDetalle${producto.ID_PRODUCTO}`);
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                } else {
                    console.error(`Error: No se encontró el elemento modal para el producto ${producto.ID_PRODUCTO}`);
                }
            });
        });
    };
});
//Termina hacer una solicitud a la API para obtener los Productos de Damas