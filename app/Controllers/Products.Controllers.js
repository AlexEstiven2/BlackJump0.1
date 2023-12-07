import path from 'path';
import Conector from "../Src/Conector.js";
import multer from "multer";
import { log } from 'console';

// Configura el middleware Multer para subir imágenes
const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'app', 'Assets', 'Upload', 'Products'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload1 = multer({ storage: storage });

export { upload1 };

const crearProducto = (req, res) => {
    const query = `
        INSERT INTO PRODUCTO (IMAGEN, NOMBRE_PRODUCTO, DESCRIP_PRODUCTO, COLOR_PRODUCTO, ESTADO_PRODUCTO, GEN_PRODUCTO, FK_ID_CATEGORIA, TALLAS_PRODUCTO, STOCK_PRODUCTO, PRECIO_PRODUCTO)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const productoImagen = req.file.filename;
    const productoNombre = req.body.NOMBRE_PRODUCTO;
    const productoDescripcion = req.body.DESCRIP_PRODUCTO;
    const productoColor = Array.isArray(req.body.COLOR_PRODUCTO) ? req.body.COLOR_PRODUCTO.join(',') : req.body.COLOR_PRODUCTO;
    const productoEstado = req.body.ESTADO_PRODUCTO;
    const productoGenero = req.body.GEN_PRODUCTO;
    const productoCategoria = req.body.FK_ID_CATEGORIA;
    const productoTallas = req.body.TALLAS_PRODUCTO.join(','); // Convierte el array de tallas a una cadena de texto
    const productoStock = req.body.STOCK_PRODUCTO;
    const productoPrecio = req.body.PRECIO_PRODUCTO;

    const values = [
        productoImagen,
        productoNombre,
        productoDescripcion,
        productoColor,
        productoEstado,
        productoGenero,
        productoCategoria,
        productoTallas,
        productoStock,
        productoPrecio
    ];

    Conector.query(query, values, (error, result) => {
        if (error) {
            console.error('Error al insertar el producto', error);
            res.status(500).json({ error: 'Error al insertar el producto' });
        } else {
            console.log('Producto insertado con éxito');
            res.status(200).json({ message: 'Producto insertado con éxito' });
        }
    });
};

const obtenerProductos = (req, res) => {
    const query = `SELECT * FROM PRODUCTO`;

    Conector.query(query, (error, result) => { 
        if (error) {
            console.error('Error al obtener los productos', error);
            res.status(500).json({ error: 'Error al obtener los productos'});
        } else {
            result.forEach(producto => {
                producto.TALLAS_PRODUCTO = producto.TALLAS_PRODUCTO.split(',');
                producto.COLOR_PRODUCTO = producto.COLOR_PRODUCTO.split(','); // Convierte la cadena de colores a un array
            });
            res.status(200).json(result);
        }
    });
}

    //Renderizar en los frontend por el genero y por categorias
    const obtenerProductosPorGeneroYCategoria = (req, callback) => {
        const query = 'SELECT PRODUCTO.IMAGEN AS IMAGEN_PRODUCTO, CATEGORIA.IMAGEN AS IMAGEN_CATEGORIA, PRODUCTO.*, CATEGORIA.* FROM PRODUCTO INNER JOIN CATEGORIA ON PRODUCTO.FK_ID_CATEGORIA = CATEGORIA.ID_CATEGORIA';
        Conector.query(query, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                result.forEach(producto => {
                    producto.TALLAS_PRODUCTO = producto.TALLAS_PRODUCTO.split(',');
                    producto.COLOR_PRODUCTO = producto.COLOR_PRODUCTO.split(',');
                });
                const productos = result;

                const productosFiltrados = [];

                productos.forEach(producto => {
                    let urlCategory = decodeURIComponent(req.originalUrl.split('/')[4].toLowerCase());
                    let productCategory = producto.NOMBRE_CATE.toLowerCase();
                    if (producto.GEN_PRODUCTO.toLowerCase() === req.originalUrl.split('/')[3].toLowerCase() && productCategory.startsWith(urlCategory)) {
                        productosFiltrados.push(producto);
                    }
                });

                callback(null, productosFiltrados);
            }
        });
    };
    //Termina renderizar en los frontend por el genero y por categorias

const editarProducto = (req, res) => {
    const idProducto = req.params.id;

    const query = `
        UPDATE PRODUCTO SET IMAGEN = ?, NOMBRE_PRODUCTO = ?, DESCRIP_PRODUCTO = ?, COLOR_PRODUCTO = ?, ESTADO_PRODUCTO = ?, GEN_PRODUCTO = ?, FK_ID_CATEGORIA = ?, TALLAS_PRODUCTO = ?, STOCK_PRODUCTO = ?, PRECIO_PRODUCTO = ?
        WHERE ID_PRODUCTO = ?
    `;

    const productoImagen = req.file.filename;
    const productoNombre = req.body.NOMBRE_PRODUCTO;
    const productoDescripcion = req.body.DESCRIP_PRODUCTO;
    const productoColor = req.body.COLOR_PRODUCTO.join(','); 
    const productoEstado = req.body.ESTADO_PRODUCTO;
    const productoGenero = req.body.GEN_PRODUCTO;
    const productoCategoria = req.body.FK_ID_CATEGORIA;
    const productoTallas = req.body.TALLAS_PRODUCTO.join(','); // Convierte el array de tallas a una cadena de texto
    const productoStock = req.body.STOCK_PRODUCTO;
    const productoPrecio = req.body.PRECIO_PRODUCTO;

    const values = [
        productoImagen,
        productoNombre,
        productoDescripcion,
        productoColor,
        productoEstado,
        productoGenero,
        productoCategoria,
        productoTallas,
        productoStock,
        productoPrecio,
        idProducto
    ];

    Conector.query(query, values, (error, result) => {
        if (error) {
            console.error('Error al editar el producto', error);
            res.status(500).json({ error: 'Error al editar el producto' });
        } else {
            console.log('Producto editado con éxito');
            res.status(200).json({ message: 'Producto editado con éxito' });
        }
    });
};

const eliminarProducto = (req, res) => {
    const idProducto = req.params.id; // Obtener el ID del producto a eliminar desde los parámetros de la URL

    const query = `DELETE FROM PRODUCTO WHERE ID_PRODUCTO = ?`;
    const values = [idProducto];

    // Utilizar la conexión para realizar la eliminación en la base de datos
    Conector.query(query, values, (error, result) => {
        if (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Error deleting product' });
        } else {
            console.log('Product deleted successfully');
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    });
};

export default {
    crearProducto,
    obtenerProductos,
    editarProducto,
    eliminarProducto,
    obtenerProductosPorGeneroYCategoria,
};