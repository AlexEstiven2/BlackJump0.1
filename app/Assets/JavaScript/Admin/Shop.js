// En Shop.js
import { agregarAlCarrito } from './ProductsConfig.js';

let carrito = [];
let productos = []; // Asegúrate de que esta lista se llena con tus productos

function obtenerProductoPorId(id) {
    return productos.find(producto => producto.ID_PRODUCTO === id);
}

export function agregarAlCarritoShop(producto) {
    const productoEnCarrito = carrito.find(p => p.ID_PRODUCTO === producto.ID_PRODUCTO && p.COLOR_PRODUCTO === producto.COLOR_PRODUCTO && p.TALLAS_PRODUCTO === producto.TALLAS_PRODUCTO);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}


function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

function eliminarDelCarrito(idProducto, color, talla) {
    alertify.confirm('Confirmar', '¿Estás seguro de que quieres eliminar este producto del carrito?', function () {
        const index = carrito.findIndex(producto => producto.ID_PRODUCTO === idProducto && producto.COLOR_PRODUCTO === color && producto.TALLAS_PRODUCTO === talla);
        if (index !== -1) {
            carrito.splice(index, 1);
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        alertify.success('Producto eliminado');
    }, function () {
        alertify.error('Cancelado');
    });
}

function vaciarCarrito() {
    alertify.confirm('Confirmar', '¿Estás seguro de que quieres vaciar el carrito?', function () {
        carrito = [];
        localStorage.removeItem('carrito');
        actualizarCarrito();
        alertify.success('Carrito vaciado');
    }, function () {
        alertify.error('Cancelado');
    });
}

function actualizarCarrito() {
    const contenedorCarrito = document.getElementById('Carrito');
    const totalElement = document.getElementById('total');
    contenedorCarrito.innerHTML = '';

    let total = 0;
    carrito.forEach(producto => {
        const imagenUrl = `../../Upload/Products/${producto.IMAGEN}`;
        const costo = parseFloat(producto.PRECIO_PRODUCTO) * producto.cantidad;
        const fila = document.createElement('tr');
        fila.innerHTML = `
        <td><img src="${imagenUrl}" class="ima" width="45px" height="45px"></td>
        <td>${producto.NOMBRE_PRODUCTO}</td>
        <td>${producto.COLOR_PRODUCTO}</td>
        <td>${producto.GEN_PRODUCTO}</td>
        <td>${producto.TALLAS_PRODUCTO}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.PRECIO_PRODUCTO}</td>
        <td>${costo}</td>
        <td><button class="btn btn-danger" onclick="eliminarDelCarrito(${producto.ID_PRODUCTO}, '${producto.COLOR_PRODUCTO}', '${producto.TALLAS_PRODUCTO}')">Eliminar</button></td>
    `;

        contenedorCarrito.appendChild(fila);

        total += parseFloat(costo);
    });

    totalElement.textContent = `$${total}`;
}

window.eliminarDelCarrito = eliminarDelCarrito;

document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeLocalStorage();
    actualizarCarrito();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-vaciar-carrito')) {
        vaciarCarrito();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-to-cart')) {
        const productoId = e.target.getAttribute('id-del-contenedor'); // Asegúrate de que este atributo exista en tu HTML
        const producto = obtenerProductoPorId(productoId);

        if (producto && producto.NOMBRE_PRODUCTO) { // Verifica que el producto sea válido
            agregarAlCarrito(producto);
        } else {
            console.error('Producto no válido');
        }
    }
});