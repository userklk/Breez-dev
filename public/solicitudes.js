const cuerpo = document.getElementById("cuerpo-tabla-solicitudes");
const spanPagina = document.getElementById("pagina-actual");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");

let todasLasSolicitudes = [];
let paginaActual = 1;
const porPagina = 5;

fetch("/reservas")
  .then((res) => res.json())
  .then((data) => {
    todasLasSolicitudes = data;
    mostrarPagina(paginaActual);
  });

function mostrarPagina(pagina) {
  cuerpo.innerHTML = "";
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  const lote = todasLasSolicitudes.slice(inicio, fin);

  lote.forEach((reserva) => {
    const fila = document.createElement("tr");
    fila.id = `fila-${reserva.id}`;
    fila.innerHTML = `
      <td>${reserva.id}</td>
      <td>${reserva.nombre_conductor}</td>
      <td>${reserva.email}</td>
      <td>${reserva.dni}</td>
      <td>${reserva.modelo_coche }</td>
      <td>${reserva.fecha_inicio}</td>
      <td>${reserva.fecha_fin}</td>
      <td>${reserva.entrega}</td>
      <td>${reserva.recogida}</td>
      <td>${reserva.matricula}</td>
      <td class="color-estado">${reserva.estado}</td>
      <td>
        <button onclick="cambiarEstado(${reserva.id}, 'aceptada')">Aceptar</button>
        <button onclick="cambiarEstado(${reserva.id}, 'rechazada')">Rechazar</button>
      </td>
    `;
    cuerpo.appendChild(fila);
  });

  const totalPaginas = Math.ceil(todasLasSolicitudes.length / porPagina);
  spanPagina.textContent = `Página ${pagina}`;
  btnAnterior.disabled = pagina === 1;
  btnSiguiente.disabled = pagina >= totalPaginas;
}

btnAnterior.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarPagina(paginaActual);
  }
});

btnSiguiente.addEventListener("click", () => {
  const totalPaginas = Math.ceil(todasLasSolicitudes.length / porPagina);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    mostrarPagina(paginaActual);
  }
});

function cambiarEstado(id, nuevoEstado) {
  fetch(`/reservas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ estado: nuevoEstado })
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al actualizar');
      return res.text(); // No JSON
    })
    .then(() => {
      alert(`✅ Estado actualizado a ${nuevoEstado}`);

      const fila = document.getElementById(`fila-${id}`);
      const celdaEstado = fila.querySelector('.color-estado');
      celdaEstado.textContent = nuevoEstado;
      celdaEstado.style.color = nuevoEstado === 'aceptada' ? 'green' : 'red';
    })
    .catch(err => {
      alert('❌ Error: ' + err.message);
    });
}
// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('empleado');
  window.location.href = 'admin.html';
}
