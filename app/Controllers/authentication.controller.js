import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotevn from "dotenv";
import Conector from "../Src/Conector.js";

dotevn.config();

export const USUARIOS = [
    { NOMBRE_USE: "lucas", APELLIDO_USER: "montaya", CORREO_USER: "lucas@montoya.com", PASSWORD_USER: "$2a$10$XXVSyjzpSR3R3y.FYHJaUO0IWGNEpHy5yR2LbLtCmUyvzd/lt8fm2" },
];

async function Registro(req, res) {
    console.log(req.body);
    const NOMBRE_USER = req.body.NOMBRE_USER;
    const APELLIDO_USER = req.body.APELLIDO_USER;
    const CORREO_USER = req.body.CORREO_USER;
    const PASSWORD_USER = req.body.PASSWORD_USER;

    if (!NOMBRE_USER || !APELLIDO_USER || !CORREO_USER || !PASSWORD_USER) {
        return res.status(400).send({ status: "Error", message: "Los campos están vacíos" });
    }

    const usuarioARevisar = USUARIOS.find(usuario => usuario.NOMBRE_USER === NOMBRE_USER);
    if (usuarioARevisar) {
        return res.status(400).send({ status: "Error", message: "El usuario ya existe" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(PASSWORD_USER, salt)

    const nuevoUSUARIO = {
        NOMBRE_USER,
        APELLIDO_USER,
        CORREO_USER,
        PASSWORD_USER: hashPassword
    };
    USUARIOS.push(nuevoUSUARIO);
    console.log(nuevoUSUARIO); // Corregir aquí, cerrar el paréntesis de console.log

    // Insert the new user into the database
    const ses = `INSERT INTO USUARIOS (NOMBRE_USER, APELLIDO_USER, CORREO_USER, PASSWORD_USER) VALUES ('${NOMBRE_USER}', '${APELLIDO_USER}', '${CORREO_USER}', '${hashPassword}')`;
    Conector.query(ses, function (error, results, fields) {
        if (error) {
            console.error(error);
            return res.status(500).send({ status: "Error", message: "Error al insertar el usuario en la base de datos" });
        }

        return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUSUARIO.NOMBRE_USER} agregado`, redirect: "./Sesion" });
    });
}


async function Sesion(req, res) {
    console.log(req.body);
    const CORREO_USER = req.body.CORREO_USER;
    const PASSWORD_USER = req.body.PASSWORD_USER;
    if (!CORREO_USER || !PASSWORD_USER) {
        return res.status(400).send({ status: "Error", message: "Los campos están vacíos" });
    }

    // Find the user in the database
    const ses = `SELECT * from USUARIOS u INNER JOIN ROLES r ON r.ID_ROL = u.FK_ID_ROL WHERE CORREO_USER = '${CORREO_USER}'`;
    Conector.query(ses, async function (error, results, fields) {
        if (error) {
            console.error(error);
            return res.status(500).send({ status: "Error", message: "Error al buscar el usuario en la base de datos" });
        }

        if (results.length === 0) {
            return res.status(400).send({ status: "Error", message: "Error durante el inicio de sesión" });
        }

        const usuarioARevisar = results[0];
        const sesionCorrecto = await bcryptjs.compare(PASSWORD_USER, usuarioARevisar.PASSWORD_USER);
        if (!sesionCorrecto) {
            return res.status(400).send({ status: "Error", message: "Error durante el inicio de sesión" });
        }

        const token = jsonwebtoken.sign({ correo: usuarioARevisar.CORREO_USER }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        const cookieOption = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            path: "/"
        }

        let redirect = "/BlackJump"

        if (usuarioARevisar.ID_ROL == 1) {
            redirect = "/Admin"
        }

        console.log("Usuario")
        console.log(usuarioARevisar)

        res.cookie("jwt", token, cookieOption);
        res.send({ status: "ok", message: "Usuario inicio sesión", redirect });
    });
}

export const methods = {
    Sesion,
    Registro,
}