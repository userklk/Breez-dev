document
  .getElementById("registro-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const password = document.getElementById("password").value.trim();
    const mensaje = document.getElementById("mensaje");

    // Validación simple
    if (!nombre || !password) {
      mensaje.textContent = "❌ Debes ingresar nombre/usuario y contraseña.";
      mensaje.style.color = "red";
      return;
    }

    // Enviar solicitud al server
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Guardar en localStorage 
          localStorage.setItem("usuario", JSON.stringify(data.usuario));

          // Guardar usuario
          localStorage.setItem("usuario", JSON.stringify(data.usuario));

          window.location.href = "inicio.html";
        } else {
        }
      })
      .catch((error) => {
        console.error("❌ Error al iniciar sesión:", error);
      });
  });
