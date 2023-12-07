const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("Registro-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const NOMBRE_USER = e.target.querySelector("#NOMBRE_USER").value;
    const APELLIDO_USER = e.target.querySelector("#APELLIDO_USER").value;
    const CORREO_USER = e.target.querySelector("#CORREO_USER").value;
    const PASSWORD_USER = e.target.querySelector("#PASSWORD_USER").value;

    const res = await fetch("http://localhost:8080/api/Registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            NOMBRE_USER: NOMBRE_USER,
            APELLIDO_USER: APELLIDO_USER,
            CORREO_USER: CORREO_USER,
            PASSWORD_USER: PASSWORD_USER,
        })
    });

    if (!res.ok) {
        return mensajeError.classList.toggle("escondido", false);
    } else {
        const resJson = await res.json();
        if (resJson.redirect) {
            window.location.href = resJson.redirect;
        }
    }
});
