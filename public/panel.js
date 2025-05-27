let todosLosCoches = [];
let cochesFiltrados = [];
let paginaActual = 1;
const cochesPorPagina = 5;

const cuerpo = document.getElementById("cuerpo-tabla-coches");
const spanPagina = document.getElementById("pagina-actual");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");

fetch("/vehiculos")
  .then((res) => res.json())
  .then((data) => {
    todosLosCoches = data;
    cochesFiltrados = [...todosLosCoches];
    mostrarPagina(paginaActual);
  });

function getDatosActuales() {
  return cochesFiltrados.length ? cochesFiltrados : todosLosCoches;
}
//MUestar en la tabla de 5 en 5
function mostrarPagina(pagina) {
  cuerpo.innerHTML = "";
  const datos = getDatosActuales();
  const inicio = (pagina - 1) * cochesPorPagina;
  const fin = inicio + cochesPorPagina;
  const lote = datos.slice(inicio, fin);

  lote.forEach((coche) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${coche.id}</td>
      <td>${coche.matricula}</td>
      <td>${coche.marca}</td>
      <td>${coche.modelo}</td>
      <td>${coche.año}</td>
      <td class="${coche.estado === "alquilado" ? "estado-alquilado" : "estado-disponible"}">${coche.estado}</td>
      <td>${coche.color || "-"}</td>
      <td>${coche.velocidad || "-"}</td>
      <td>${coche.precio} €</td>
      <td><button onclick="verCoche(${coche.id})">👁️</button></td>
    `;
    cuerpo.appendChild(fila);
  });

  const totalPaginas = Math.ceil(datos.length / cochesPorPagina);
  spanPagina.textContent = `Página ${pagina}`;
  btnAnterior.disabled = pagina === 1;
  btnSiguiente.disabled = pagina >= totalPaginas;
}
//cambiar de pagina
btnAnterior.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarPagina(paginaActual);
  }
});

btnSiguiente.addEventListener("click", () => {
  const datos = getDatosActuales();
  const totalPaginas = Math.ceil(datos.length / cochesPorPagina);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    mostrarPagina(paginaActual);
  }
});

let ordenActual = { campo: "id", ascendente: true };
//Sort para ordenar los coches
function ordenarPor(campo) {
  if (ordenActual.campo === campo) {
    ordenActual.ascendente = !ordenActual.ascendente;
  } else {
    ordenActual.campo = campo;
    ordenActual.ascendente = true;
  }

  todosLosCoches.sort((a, b) => {
    let valorA = a[campo];
    let valorB = b[campo];

    if (!isNaN(valorA) && !isNaN(valorB)) {
      valorA = Number(valorA);
      valorB = Number(valorB);
    } else {
      valorA = valorA?.toString().toLowerCase() || "";
      valorB = valorB?.toString().toLowerCase() || "";
    }

    if (valorA > valorB) return ordenActual.ascendente ? -1 : 1;
    if (valorA < valorB) return ordenActual.ascendente ? 1 : -1;
    return 0;
  });

  paginaActual = 1;
  mostrarPagina(paginaActual);
  aplicarFiltros();
}
//Aplica losfilytos todos de de texto
function aplicarFiltros() {
  const idFiltro = document.getElementById('filtro-id').value.trim();
  const matFiltro = document.getElementById('filtro-matricula').value.trim().toLowerCase();
  const precioFiltro = document.getElementById('filtro-precio').value.trim();

  cochesFiltrados = todosLosCoches.filter(coche => {
    const coincideId = idFiltro === '' || coche.id.toString().includes(idFiltro);
    const coincideMat = matFiltro === '' || coche.matricula.toLowerCase().includes(matFiltro);
    const coincidePrecio = precioFiltro === '' || coche.precio <= parseFloat(precioFiltro);

    return coincideId && coincideMat && coincidePrecio;
  });

  paginaActual = 1;
  mostrarPagina(paginaActual);
}

function resetFiltros() {
  document.getElementById('filtro-id').value = '';
  document.getElementById('filtro-matricula').value = '';
  document.getElementById('filtro-precio').value = '';

  cochesFiltrados = [...todosLosCoches];
  paginaActual = 1;
  mostrarPagina(paginaActual);
}
//VEr para editr en el panel
function verCoche(id) {
  const coche = todosLosCoches.find(c => c.id === id);
  if (!coche) return;

  document.getElementById('editar-id').value = coche.id;
  document.getElementById('editar-matricula').value = coche.matricula;
  document.getElementById('editar-marca').value = coche.marca;
  document.getElementById('editar-modelo').value = coche.modelo;
  document.getElementById('editar-año').value = coche.año;
  document.getElementById('editar-color').value = coche.color || '';
  document.getElementById('editar-velocidad').value = coche.velocidad || '';
  document.getElementById('editar-precio').value = coche.precio;
  document.getElementById('editar-estado').value = coche.estado;

  document.getElementById('panel-edicion').classList.add('visible');
}

document.getElementById('form-editar-coche').addEventListener('submit', e => {
  e.preventDefault();
//Al ser actualizado el coche, se actualiza en la tabla
  const cocheActualizado = {
    id: parseInt(document.getElementById('editar-id').value),
    matricula: document.getElementById('editar-matricula').value,
    marca: document.getElementById('editar-marca').value,
    modelo: document.getElementById('editar-modelo').value,
    año: parseInt(document.getElementById('editar-año').value),
    color: document.getElementById('editar-color').value,
    velocidad: parseInt(document.getElementById('editar-velocidad').value),
    precio: parseFloat(document.getElementById('editar-precio').value),
    estado: document.getElementById('editar-estado').value
  };

  fetch('/vehiculos/' + cocheActualizado.id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cocheActualizado)
  })
    .then(async res => {
      const contentType = res.headers.get("content-type");
      if (!res.ok) throw new Error("Error de servidor");

      if (contentType && contentType.includes("application/json")) {
        return res.json();
      } else {
        throw new Error("La respuesta no es JSON");
      }
    })
    .then(data => {
      if (data.success) {
        const index = todosLosCoches.findIndex(c => c.id === cocheActualizado.id);
        if (index !== -1) todosLosCoches[index] = cocheActualizado;

        const i = cochesFiltrados.findIndex(c => c.id === cocheActualizado.id);
        if (i !== -1) cochesFiltrados[i] = cocheActualizado;

        alert('Vehículo actualizado');
        cerrarPanel();
        mostrarPagina(paginaActual);
      } else {
        alert('Error al guardar: ' + (data.error || ''));
      }
    })
    .catch(err => {
      alert('Error en la solicitud: ' + err.message);
    });
});
//Intento de alert
function mostrarMensaje(texto, color = '#28a745') {
  const msg = document.getElementById('mensaje-flotante');
  msg.textContent = texto;
  msg.style.backgroundColor = color;
  msg.classList.add('visible');
  
  setTimeout(() => {
    msg.classList.remove('visible');
  }, 3000); // se oculta en 3s
}

function cerrarPanel() {
  document.getElementById('panel-edicion').classList.remove('visible');
}
// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('empleado');
  window.location.href = 'admin.html';
}
