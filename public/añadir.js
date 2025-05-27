
document.getElementById('form-nuevo-coche').addEventListener('submit', e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Validar imagen
  const archivo = form.imagen.files[0];
  if (archivo && !archivo.type.startsWith('image/')) {
    alert('❌ El archivo debe ser una imagen válida.');
    return;
  }
  //APP VALIDA
  fetch('/vehiculos', {
    method: 'POST',
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al guardar en el servidor');
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

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('empleado');
  window.location.href = 'admin.html';
}
