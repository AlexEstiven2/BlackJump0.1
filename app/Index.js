import express from "express";
import sseExpress from "sse-express";
import cookieParser from "cookie-parser";
import CryptoJS from "crypto-js";
//Importar base de datos
import Conector from "./Src/Conector.js";



//Fix para __dirname
import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Import methods
import { methods as authentication } from "./Controllers/authentication.controller.js";
import { methods as authorization } from "./Middlewares/authorization.js";
import ProductsControllers from "./Controllers/Products.Controllers.js";
import  CategoryControllers from "./Controllers/Category.Controllers.js";
import { upload } from "./Controllers/Category.Controllers.js";
import { upload1 } from "./Controllers/Products.Controllers.js";

//Server
const app = express();
app.set('port', 8080);
app.listen(app.get('port'));
console.log('Servidor corriendo en puerto', app.get('port'));

// Configuración para SSE (por ejemplo, /sse)
app.get('/sse', sseExpress, (req, res) => {
    // Maneja la lógica de SSE aquí
    // Puedes enviar actualizaciones a través de req.app.sse.send('actualización');
});

//Configuracion
app.use(express.static(path.join(__dirname, 'Assets')));
app.use(express.json());
app.use(cookieParser());

// Función para cifrar la URL
function encryptURL(url) {
    const secretKey = "secret key"; // Reemplaza esto con tu propia clave secreta
    const encryptedURL = CryptoJS.AES.encrypt(url, secretKey).toString();
    return encryptedURL;
}

// Función para descifrar la URL
function decryptURL(encryptedURL) {
    const secretKey = "secret key"; // Debe ser la misma clave secreta que usaste para cifrar
    const bytes = CryptoJS.AES.decrypt(encryptedURL, secretKey);
    const originalURL = bytes.toString(CryptoJS.enc.Utf8);
    return originalURL;
}

app.use('/Upload/Products', express.static(path.join(__dirname, 'Upload/Products')));

// Metodos Get Publico
app.get('/BLACKJUMP1', (req, res) => res.sendFile(__dirname + '/Views/Frontend/BLACKJUMP1.html'));
app.get('/CABALLERO1', (req, res) => res.sendFile(__dirname + '/Views/Frontend/CABALLEROS1.html'));
app.get('/DAMA1', (req, res) => res.sendFile(__dirname + '/Views/Frontend/DAMAS1.html'));
app.get('/NINNO1', (req, res) => res.sendFile(__dirname + '/Views/Frontend/NIÑOS1.html'));
app.get('/CONTACTO1', (req, res) => res.sendFile(__dirname + '/Views/Frontend/CONTACTOS1.html'));

app.get('/Sesion', authorization.soloPublico, (req, res) => res.sendFile(__dirname + '/Views/Frontend/Sesión.html'));
app.get('/Registro', authorization.soloPublico, (req, res) => res.sendFile(__dirname + '/Views/Frontend/Registro.html'));

// Metodos Get Admin
app.get('/Admin', authorization.soloAdmin, (req, res) => res.sendFile(__dirname + '/Views/Admin/Admin.html'));
app.get('/Products', authorization.soloAdmin, (req, res) => res.sendFile(__dirname + '/Views/Admin/Products.html'))
app.get('/Categories', authorization.soloAdmin, (req, res) => res.sendFile(__dirname + '/Views/Admin/Categories.html'))
app.get('/Shop', authorization.soloAdmin, (req, res) => res.sendFile(__dirname + '/Views/Admin/Shop.html'))

// Metodos Get Users
app.get('/BlackJump', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/BlackJump.html'));
app.get('/Caballero', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/Caballero.html'));
app.get('/Damas', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/Damas.html'));
app.get('/Ninnos', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/Niños.html'));
app.get('/Carrito', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/Carrito.html'));
app.get('/Contactos', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/Contacto.html'));
app.get('/Perfil', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/Perfil.html'));
app.get('/DetalleC', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/DetalleC.html'));
app.get('/Productos', authorization.soloUsers, (req, res) => res.sendFile(__dirname + '/Views/Users/Productos.html'));

//Mestodos Get Publicos


//Metodo Post
app.post('/api/Sesion', authentication.Sesion);
app.post('/api/Registro', authentication.Registro);

//Products
app.get('/api/products', (req, res) => {
    ProductsControllers.obtenerProductos(req, res);
})

//Me todos para obtener los productos
app.get('/api/products/Caballeros/:categoria', (req, res) => {
    ProductsControllers.obtenerProductosPorGeneroYCategoria(req, (error, productosFiltrados) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.json(productosFiltrados);
        }
    });
});
app.get('/api/products/Damas/:categoria', (req, res) => {
    ProductsControllers.obtenerProductosPorGeneroYCategoria(req, (error, productosFiltrados) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.json(productosFiltrados);
        }
    });
});
app.get('/api/products/Ninnos/:categoria', (req, res) => {
    ProductsControllers.obtenerProductosPorGeneroYCategoria(req, (error, productosFiltrados) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.json(productosFiltrados);
        }
    });
});
//Terminan me todos para obtener los productos

app.post('/api/products', upload1.single('IMAGEN'), (req, res) => {
    // Utiliza el controlador de productos para crear un producto
    ProductsControllers.crearProducto(req, res);
});
app.put('/api/products/:id', upload1.single('IMAGEN'), (req, res) => {
    // Utiliza el controlador de productos para editar un producto
    ProductsControllers.editarProducto(req, res);
});
app.delete('/api/products/:id', (req, res) => {
    // Obtener el ID del producto desde los parámetros de la URL
    const idProducto = req.params.id;
    ProductsControllers.eliminarProducto(req, res, idProducto);
});


//Categories
app.get('/api/categories', (req, res) => {
    CategoryControllers.obtenerCategorias(req, res);
});
//
app.get('/api/categories/caballeros', (req, res) => {
    CategoryControllers.obtenerCategoriasCaballeros(req, res);
});
app.get('/api/categories/Damas', (req, res) => {
    CategoryControllers.obtenerCategoriasDamas(req, res);
});
app.get('/api/categories/Ninos', (req, res) => {
    CategoryControllers.obtenerCategoriasNinos(req, res);
});
app.get('/api/categories/', (req, res) => {
    CategoryControllers.obtenerCategoriasPorGenero(req, res);
});
app.get('/Productos/:id', authorization.soloUsers, (req, res) => {
    const categoryId = req.params.id;
    // Ahora puedes usar categoryId para obtener los detalles de la categoría específica
    res.sendFile(__dirname + '/Views/Users/Productos.html');
});
//
app.post('/api/categories', upload.single('IMAGEN'), (req, res) => {
    CategoryControllers.crearCategory(req, res);
});
app.put('/api/categories/:id', upload.single('IMAGEN'), (req, res) => {
    CategoryControllers.editarCategoria(req, res);
});
app.delete('/api/categories/:id', (req, res) => {
    CategoryControllers.eliminarCategoria(req, res);
});

