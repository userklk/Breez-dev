// Protección: solo admins
const empleado = JSON.parse(localStorage.getItem('empleado'));
if (!empleado || !empleado.email) {
  alert('Acceso denegado. Inicia sesión como administrador.');
  window.location.href = 'admin.html';
}

// Subida y guardado
document.getElementById('form-nuevo-coche').addEventListener('submit', e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // No convertir tipos si en la base todo es TEXT
  fetch('/vehiculos', {
    method: 'POST',
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Error del servidor");
      return res.json();
    })
    .then(data => {
      if (data.success) {
        alert('✅ Vehículo añadido correctamente');
        form.reset();
      } else {
        alert('❌ Error al guardar: ' + (data.error || 'Desconocido'));
      }
    })
    .catch(err => {
      alert('❌ Error en la solicitud: ' + err.message);
    });
});

function cerrarSesion() {
  localStorage.removeItem('empleado');
  window.location.href = 'admin.html';
}
