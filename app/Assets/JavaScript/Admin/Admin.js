document.getElementById("logoutButton").addEventListener("click", () => {
	document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.location.href = "/Sesion";
});


// add hovered class to selected list item
let list = document.querySelectorAll(".Navigation .NavLi");

function activeLink() {
	list.forEach((item) => {
		item.classList.remove("hovered");
	});
	this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let Navigation = document.querySelector(".Navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
	Navigation.classList.toggle("active");
	main.classList.toggle("active");
};


// En Admin.js
import { obtenerCategoriasDesdeServidor, renderizarCategorias, handleCategoryClick } from './categoriasConfig.js';
import { obtenerProductosDesdeServidor, renderizarProductos, obtenerProductosPorCategoriaDesdeServidor } from './ProductsConfig.js';

const adminCategoriesContainer = document.querySelector('.categorias-scroll');
const cardCarousel = document.getElementById('card-carousels'); // Definir cardCarousel fuera del evento load

window.addEventListener('load', () => {
    obtenerCategoriasDesdeServidor()
        .then(data => {
            renderizarCategorias(data, adminCategoriesContainer);
            const categorias = adminCategoriesContainer.querySelectorAll('.categoria');
            categorias.forEach(categoria => {
                categoria.addEventListener('click', () => {
                    const categoryId = categoria.getAttribute('data-id');
                    handleCategoryClick(categoryId); // No necesitas definir cardCarousel nuevamente
                });
            });
        })
        .catch(error => console.error(error));
});

window.addEventListener('load', () => {
    obtenerCategoriasDesdeServidor()
        .then(data => {
            renderizarCategorias(data, adminCategoriesContainer);
            const categorias = adminCategoriesContainer.querySelectorAll('.categoria');
            categorias.forEach(categoria => {
                categoria.addEventListener('click', () => {
                    const categoryId = categoria.getAttribute('data-id');
                    obtenerProductosPorCategoriaDesdeServidor(categoryId)
                        .then(productos => {
                            if (cardCarousel) {
                                renderizarProductos(productos, cardCarousel);
                            } else {
                                console.error('cardCarousel no está definido');
                            }
                        })
                        .catch(error => console.error(error));
                });
            });
        })
        .catch(error => console.error(error));

    obtenerProductosDesdeServidor()
        .then(productos => {
            if (cardCarousel) {
                renderizarProductos(productos, cardCarousel);
            } else {
                console.error('cardCarousel no está definido');
            }
        })
        .catch(error => console.error(error)); 
});

const searchInput = document.getElementById('buscar');

searchInput.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    obtenerProductosDesdeServidor()
        .then(productos => {
            let filteredProducts = productos.filter(product => 
                product.NOMBRE_PRODUCTO.toLowerCase().includes(searchString)
            );
            if (cardCarousel) {
                renderizarProductos(filteredProducts, cardCarousel);
            } else {
                console.error('cardCarousel no está definido');
            }
        })
        .catch(error => console.error(error)); 
});