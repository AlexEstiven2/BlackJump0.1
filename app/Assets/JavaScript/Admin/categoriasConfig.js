// En categoriesConfig.js
export const categoriasUrl = 'http://localhost:8080/api/categories/';

export const obtenerCategoriasDesdeServidor = async () => {
    try {
        const response = await fetch(categoriasUrl);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error; // Re-lanza el error para manejarlo en el lugar adecuado
    } 
};

export const renderizarCategorias = (categories, container) => {
    let resultado = '';
    
    categories.forEach(category => {
        const imagenUrl = `${category.IMAGEN}`;
        resultado += `
        <div class="categoria" data-id="${category.ID_CATEGORIA}">
            <a href="#"><img class="cat" src="../../Upload/Categories/${imagenUrl}"></a>
            <h2 class="h5 text-center mt-3 mb-3">${category.NOMBRE_CATE}</h2>
        </div>`;
    });

    container.innerHTML = resultado;

    // Agrega un evento de clic a cada categoría para manejar el clic
    const categorias = container.querySelectorAll('.categoria');
    categorias.forEach(categoria => {
        categoria.addEventListener('click', () => {
            // Obtén el ID de la categoría desde el atributo "data-id"
            const categoryId = categoria.getAttribute('data-id');
            
            // Llama a la función para manejar el clic en la categoría
            handleCategoryClick(categoryId);
        });
    });
};

import { obtenerProductosDesdeServidor, renderizarProductos, obtenerProductosPorCategoriaDesdeServidor } from './ProductsConfig.js';

const adminCategoriesContainer = document.querySelector('.categorias-scroll');
let cardCarousel = document.getElementById('card-carousels');

window.addEventListener('load', () => {
    obtenerCategoriasDesdeServidor()
        .then(data => {
            renderizarCategorias(data, adminCategoriesContainer);
            const categorias = adminCategoriesContainer.querySelectorAll('.categoria');
            categorias.forEach(categoria => {
                categoria.addEventListener('click', () => {
                    const categoryId = categoria.getAttribute('data-id');
                    let cardCarousel = document.getElementById('card-carousels');
                    if (cardCarousel) {
                        handleCategoryClick(categoryId, cardCarousel);
                    } else {
                        console.error('cardCarousel no está definido');
                    }
                });
            });
        })
        .catch(error => console.error(error));
});

// Función para manejar el clic en una categoría
export const handleCategoryClick = (categoryId, cardCarousel) => {
    if (cardCarousel) {
        obtenerProductosPorCategoriaDesdeServidor(categoryId)
        .then(productos => {
            // Limpia el carrusel de tarjetas antes de renderizar los nuevos productos
            cardCarousel.innerHTML = '';
            renderizarProductos(productos, cardCarousel);
        })
        .catch(error => {
            console.error('Error al obtener y mostrar productos por categoría:', error);
        });
    } else {
        console.error('cardCarousel no está definido');
    }
};