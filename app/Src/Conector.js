import mysql from 'mysql';

const Conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'BLACKJUMP',
});

Conexion.connect((error) => {
    if (error) {
        throw error;
    } else {
        console.log('Conexion exitosa');
    }
});

const Conector = {
    query: (ses, callback) => {
        Conexion.query(ses, callback);
    },
    end: () => {
        Conexion.end();
    },
};


export default Conector;