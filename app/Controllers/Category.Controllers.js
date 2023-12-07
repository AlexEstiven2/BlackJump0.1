import path from 'path';
import Conector from "../Src/Conector.js";
import multer from "multer";

// Configura el middleware Multer para subir imágenes
const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'app', 'Assets', 'Upload', 'Categories'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

export { upload };


const crearCategory = (req, res) => {
    const query = `
        INSERT INTO CATEGORIA (IMAGEN, NOMBRE_CATE, ESTADO_CATE, FK_ID_GEN) VALUES (?,?,?,?)
    `;

    // Asegúrate de obtener correctamente los valores del formulario
    const categoryNombre = req.body.NOMBRE_CATE;
    const categoryEstado = req.body.ESTADO_CATE;
    const categoryFk_id_gen = req.body.FK_ID_GEN;
    
    // Obtén solo el nombre del archivo sin la ruta completa
    const imageName = req.file.filename;

    const values = [
        imageName, // Almacena solo el nombre de la imagen
        categoryNombre,
        categoryEstado,
        categoryFk_id_gen
    ];

    // Utilizar la conexión para realizar la inserción en la base de datos
    Conector.query(query, values, (error, result) => {
        if (error) {
            console.error('Error al insertar la categoría', error);
            res.status(500).json({ error: 'Error al insertar la categoría' });
        } else {
            console.log('Categoría insertada con éxito');
            res.status(200).json({ message: 'Categoría insertada con éxito' });
        }
    });
};

// Método para obtener todas las categorías
const obtenerCategorias = (req, res) => {
    // Consulta SQL para obtener todas las categorías
    const query = `SELECT * FROM CATEGORIA`;

    // Ejecuta la consulta utilizando la conexión a la base de datos
    Conector.query(query, (error, result) => { 
        if (error) {
            console.error('Error al obtener las categorías', error);
            res.status(500).json({ error: 'Error al obtener las categorías' });
        } else {
            // Envía las categorías obtenidas como respuesta en formato JSON
            res.status(200).json(result);
        }
    });
};

//Renderizar en los frontend por el genero
const obtenerCategoriasPorGenero = (callback) => {
    // Consulta SQL para obtener todas las categorías
    const query = `SELECT * FROM CATEGORIA`;

    // Ejecuta la consulta utilizando la conexión a la base de datos
    Conector.query(query, (error, result) => {
        if (error) {
            callback(error, null);
        } else {
            const categorias = result;
            const categoriasPorGenero = {
                hombres: categorias.filter(cat => cat.FK_ID_GEN === 1),
                mujeres: categorias.filter(cat => cat.FK_ID_GEN === 2),
                Ninos: categorias.filter(cat => cat.FK_ID_GEN === 3),
                // Agrega más géneros si es necesario
            };
            callback(null, categoriasPorGenero);
        }
    });
};

const obtenerCategoriasCaballeros = async (req, res) => {
    try {
        // Realiza una consulta a tu base de datos para obtener todas las categorías
        obtenerCategoriasPorGenero((error, categoriasPorGenero) => {
            if (error) {
                console.error('Error al obtener categorías de caballeros: ', error);
                res.status(500).json({ error: 'Error al obtener categorías' });
            } else {
                // Responde con un JSON que contiene solo las categorías de hombres
                res.json(categoriasPorGenero.hombres);
            }
        });
    } catch (error) { 
        console.error('Error al obtener categorías de caballeros: ', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

const obtenerCategoriasDamas = async (req, res) => {
    try {
        // Realiza una consulta a tu base de datos para obtener todas las categorías
        obtenerCategoriasPorGenero((error, categoriasPorGenero) => {
            if (error) {
                console.error('Error al obtener categorías de Damas: ', error);
                res.status(500).json({ error: 'Error al obtener categorías' });
            } else {
                // Responde con un JSON que contiene solo las categorías de hombres
                res.json(categoriasPorGenero.mujeres);
            }
        });
    } catch (error) { 
        console.error('Error al obtener categorías de Damas: ', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

const obtenerCategoriasNinos = async (req, res) => {
    try {
        // Realiza una consulta a tu base de datos para obtener todas las categorías
        obtenerCategoriasPorGenero((error, categoriasPorGenero) => {
            if (error) {
                console.error('Error al obtener categorías de  Niños: ', error);
                res.status(500).json({ error: 'Error al obtener categorías' });
            } else {
                // Responde con un JSON que contiene solo las categorías de hombres
                res.json(categoriasPorGenero.Ninos);
            }
        });
    } catch (error) { 
        console.error('Error al obtener categorías de  Niños: ', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};
//Termina renderizar en los frontend por el genero

const editarCategoria = (req, res) => {
    const categoryId = req.params.id; // Obtén el ID de la categoría a editar

    // Asegúrate de obtener correctamente los valores del formulario
    const categoryNombre = req.body.NOMBRE_CATE;
    const categoryEstado = req.body.ESTADO_CATE;
    const categoryFk_id_gen = req.body.FK_ID_GEN;
    // Obtén solo el nombre del archivo sin la ruta completa
    const imageName = req.file ? req.file.filename : null;

    // Consulta SQL para actualizar la categoría con el ID proporcionado
    const query = `
        UPDATE CATEGORIA SET IMAGEN = ?, NOMBRE_CATE = ?, ESTADO_CATE = ?, FK_ID_GEN = ? WHERE ID_CATEGORIA = ?
    `;

    const values = [
        imageName, // Almacena solo el nombre de la imagen
        categoryNombre,
        categoryEstado,
        categoryFk_id_gen,
        categoryId
    ];

    // Ejecuta la consulta utilizando la conexión a la base de datos
    Conector.query(query, values, (error, result) => {
        if (error) {
            console.error('Error al editar la categoría', error);
            res.status(500).json({ error: 'Error al editar la categoría' });
        } else {
            console.log('Categoría editada con éxito');
            res.status(200).json({ message: 'Categoría editada con éxito' });
        }
    });
};


// Función para eliminar una categoría por su ID
const eliminarCategoria = (req, res) => {
    const categoryId = req.params.id; // Obtén el ID de la categoría a eliminar

    // Consulta SQL para eliminar la categoría con el ID proporcionado
    const query = `DELETE FROM CATEGORIA WHERE ID_CATEGORIA = ?`;

    // Ejecuta la consulta utilizando la conexión a la base de datos
    Conector.query(query, [categoryId], (error, result) => {
        if (error) {
            console.error('Error al eliminar la categoría', error);
            res.status(500).json({ error: 'Error al eliminar la categoría' });
        } else {
            console.log('Categoría eliminada con éxito');
            res.status(200).json({ message: 'Categoría eliminada con éxito' });
        }
    });
};

export default {
    crearCategory,
    obtenerCategorias,
    editarCategoria,
    eliminarCategoria,
    obtenerCategoriasPorGenero,
    obtenerCategoriasCaballeros,
    obtenerCategoriasDamas,
    obtenerCategoriasNinos,
};