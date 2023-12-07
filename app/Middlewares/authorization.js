import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv"; // Cambio en esta línea
import { USUARIOS } from "./../Controllers/authentication.controller.js";

dotenv.config();

function soloUsers(req, res, next) {
    const logueado = revisarCookie(req);
    if (logueado) return next();
    return res.redirect('/Sesion');
}
function solouser(req, res, next){
    const logueadoadmin = admiCookie(req);
    if (logueadoadmin) return next();
    return res.redirect('/Admin')
}
function soloAdmin(req, res, next) {
    const logueadoadmin = admiCookie(req);
    if (!logueadoadmin) return next();
    return res.redirect('/Sesion')
}
function soloPublico(req,res, next){
    const logueado = revisarCookie(req);
    if (!logueado) return next();
    return res.redirect('/BlackJump')
}

function admiCookie(req) {
    try {
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        console.log(decodificada);
        const adminARevisar = ADMIN.find(admin => admin.CORREO_USER === decodificada.correo);
        console.log(adminARevisar);
        if (!adminARevisar) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

function revisarCookie(req) {
    try {
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        console.log(decodificada);
        const usuarioARevisar = USUARIOS.find(usuario => usuario.CORREO_USER === decodificada.correo);
        console.log(usuarioARevisar);
        if (!usuarioARevisar) {
            return true;
        }
        return true;
    } catch {
        return false;
    }
}
export const methods = {
    soloAdmin,
    soloPublico,
    solouser,
    soloUsers,
};
