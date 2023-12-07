//ProductsCat.js

//Code perfil
document.addEventListener("DOMContentLoaded", function () {
    const userMenuTrigger = document.getElementById("userMenuTrigger");
    const userMenu = document.getElementById("userMenu");

    document.addEventListener('DOMContentLoaded', function (e) {
        e.preventDefault();
        userMenu.classList.toggle("active");
    });

    // Cerrar el menú si se hace clic en cualquier parte fuera de él
    document.addEventListener("click", function (e) {
        if (!userMenu.contains(e.target) && !userMenuTrigger.contains(e.target)) {
            userMenu.classList.remove("active");
        }
    });
});
//Termina code perfil

//Code cerrar Sesion
document.querySelector(".CerrarSesion").addEventListener("click", () => {
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.href = "/Sesion";
});
//Termina code cerrar Sesion

//Se renderizan los productos