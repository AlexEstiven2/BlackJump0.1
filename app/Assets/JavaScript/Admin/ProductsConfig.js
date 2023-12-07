// En productsConfig.js
export const productosUrl = 'http://localhost:8080/api/products/';

import { agregarAlCarritoShop } from './Shop.js';
// Función para obtener todos los productos desde el servidor
export const obtenerProductosDesdeServidor = async () => {
    try {
        const response = await fetch(productosUrl);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Función para obtener productos por categoría desde el servidor
export const obtenerProductosPorCategoriaDesdeServidor = async (categoryId) => {
    try {
        const response = await fetch(`${productosUrl}?categoryId=${categoryId}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const agregarAlCarrito = (producto) => {
    if (producto && producto.NOMBRE_PRODUCTO) { // Verifica que el producto sea válido
        console.log(`Producto ${producto.NOMBRE_PRODUCTO} agregado al carrito`);
        agregarAlCarritoShop(producto);
    } else {
        console.error('Producto no válido');
    }
}


// Función para renderizar los productos en las tarjetas
export const renderizarProductos = (productos, container) => {
    let resultado = '';

    productos.forEach(producto => {
        const imagenUrl = `${producto.IMAGEN}`;

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

        resultado += `
        <div class="card card-car">
            <img class="Imagen" src="../../Upload/Products/${imagenUrl}">
            <h3 class="NombreP">${producto.NOMBRE_PRODUCTO}</h3>
            <p class="price">Precio: $${producto.PRECIO_PRODUCTO}</p>
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
                                    <div class="color">Color: ${colores}</div>
                                    <p class="selected-color">Color seleccionado: <span id="selectedColor${producto.ID_PRODUCTO}">${colorSeleccionado}</span></p>      
                                    <p class="estado">Estado: ${producto.ESTADO_PRODUCTO}</p>
                                    <p class="genero">Género: ${producto.GEN_PRODUCTO}</p>
                                    <div class="tallas"><p class="ta">TALLAS</p>${tallas}</div>
                                    <p class="selected-size">Talla seleccionada: <span id="selectedSize${producto.ID_PRODUCTO}"></span></p>
                                    <p class="price">Precio: $${producto.PRECIO_PRODUCTO}</p>
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
                        <button type="button" class="btn btn-black agregar-alcarrito">Agregar</button>
                    </div>
                </div>
            </div>
        </div>
        <!--Terminan Detalles Productos-->
        `;
    });

    container.innerHTML = resultado;

    // Obtener todos los elementos de radio de tallas
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    // Elemento HTML para mostrar la talla seleccionada
    const selectedSizeElement = document.getElementById("selectedSize");

    // Función para manejar el cambio de talla
    function handleSizeChange(event) {
        const selectedSize = event.target.value;
        selectedSizeElement.textContent = selectedSize;
    }

    // Agregar un oyente de eventos de cambio a cada botón de radio
    sizeInputs.forEach((input) => {
        input.addEventListener("change", handleSizeChange);
    });

    productos.forEach((producto) => {
        if (Array.isArray(producto.COLOR_PRODUCTO)) {
            const select = document.getElementById(`color${producto.ID_PRODUCTO}`);
            select.addEventListener('change', () => {
                const selectedColorElement = document.getElementById(`selectedColor${producto.ID_PRODUCTO}`);
                selectedColorElement.textContent = select.value;
            });
        }
    });

    productos.forEach((producto) => {
        if (Array.isArray(producto.TALLAS_PRODUCTO)) {
            producto.TALLAS_PRODUCTO.forEach((talla, index) => {
                const radio = document.getElementById(`talla${producto.ID_PRODUCTO}${index}`);
                radio.addEventListener('change', () => {
                    const selectedSizeElement = document.getElementById(`selectedSize${producto.ID_PRODUCTO}`);
                    selectedSizeElement.textContent = talla;
                });
            });
        }
    });

    productos.forEach((producto, index) => {
        const botonesAgregarAlCarrito = document.querySelectorAll('.agregar-alcarrito');
        botonesAgregarAlCarrito[index].addEventListener('click', () => {
            const productoParaAgregar = {
                ...producto,
                COLOR_PRODUCTO: document.getElementById(`selectedColor${producto.ID_PRODUCTO}`).textContent,
                TALLAS_PRODUCTO: document.getElementById(`selectedSize${producto.ID_PRODUCTO}`).textContent,
            };
            agregarAlCarrito(productoParaAgregar);
        });
    });

    // Crea una sola instancia del modal
    const myModalElement = document.getElementById('myModal');
    const modal = new bootstrap.Modal(myModalElement);

    // Manejar el clic en los botones "Ver más" para abrir el modal correspondiente
    productos.forEach(producto => {
        const botonVerMas = document.querySelector(`[data-bs-target="#modalDetalle${producto.ID_PRODUCTO}"]`);
        botonVerMas.addEventListener('click', () => {
            // Configura el modal para el producto actual
            const modalElement = document.getElementById(`modalDetalle${producto.ID_PRODUCTO}`);
            const modal = new bootstrap.Modal(modalElement);
            // Muestra el modal
            modal.show();
        });
    });  
};