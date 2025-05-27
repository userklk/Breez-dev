document.getElementById("registro-form").addEventListener("submit", function (e) {
	e.preventDefault();
  
	const nombre = document.getElementById("nombre").value.trim();
	const telefono = document.getElementById("telefono").value.trim();
	const password = document.getElementById("password").value.trim();
  
	if (nombre === '') {
	  alert("El nombre es obligatorio.");
	  return;
	}
  // Validación simple de teléfono
	if (!/^[0-9]{9}$/.test(telefono)) {
	  alert("Teléfono inválido. Deben ser 9 dígitos.");
	  return;
	}
  // Validación simple de contraseña
	if (password.length < 4) {
	  alert("La contraseña debe tener al menos 4 caracteres.");
	  return;
	}
  
	fetch('/registrar', {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify({ nombre, telefono, password })
	})
	  .then(res => {
		if (!res.ok) throw new Error('Error al registrar usuario');
		return res.text();
	  })
	  .then(msg => {

		document.getElementById("registro-form").reset();

		setTimeout(() => {
		  window.location.href = 'login.html';
		}, 200);
	  })

	  .catch(err => {
		console.error('Error al registrar:', err);
		alert("Error al registrar usuario.");
	  });
  });
  