let todosLosCoches = [];
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
    mostrarPagina(paginaActual);
  });

function mostrarPagina(pagina) {
  cuerpo.innerHTML = ""; 
  const inicio = (pagina - 1) * cochesPorPagina;
  const fin = inicio + cochesPorPagina;
  const lote = todosLosCoches.slice(inicio, fin);

  lote.forEach((coche) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${coche.id}</td>
      <td>${coche.matricula}</td>
      <td>${coche.marca}</td>
      <td>${coche.modelo}</td>
      <td>${coche.año}</td>
      <td class="${
        coche.estado === "alquilado" ? "estado-alquilado" : "estado-disponible"
      }">${coche.estado}</td>
      <td>${coche.color || "-"}</td>
      <td>${coche.velocidad || "-"}</td>
      <td>${coche.precio} €</td>
      <td><button onclick="verCoche(${coche.id})">👁️</button></td>
    `;
    cuerpo.appendChild(fila);
  });

  const totalPaginas = Math.ceil(todosLosCoches.length / cochesPorPagina);
  spanPagina.textContent = `Página ${pagina}`;
  btnAnterior.disabled = pagina === 1;
  btnSiguiente.disabled = pagina === totalPaginas;
}

btnAnterior.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarPagina(paginaActual);
  }
});

btnSiguiente.addEventListener("click", () => {
  const totalPaginas = Math.ceil(todosLosCoches.length / cochesPorPagina);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    mostrarPagina(paginaActual);
  }
});

function verCoche(id) {
  alert("Detalles del coche ID: " + id);
}
let ordenActual = { campo: "id", ascendente: true };

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
}
let cochesFiltrados = [];

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
  mostrarPaginaFiltrada();
}

function resetFiltros() {
  document.getElementById('filtro-id').value = '';
  document.getElementById('filtro-matricula').value = '';
  document.getElementById('filtro-precio').value = '';

  cochesFiltrados = [...todosLosCoches];
  paginaActual = 1;
  mostrarPaginaFiltrada();
}

function mostrarPaginaFiltrada() {
  cuerpo.innerHTML = '';
  const inicio = (paginaActual - 1) * cochesPorPagina;
  const fin = inicio + cochesPorPagina;
  const lote = cochesFiltrados.slice(inicio, fin);

  lote.forEach(coche => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${coche.id}</td>
      <td>${coche.matricula}</td>
      <td>${coche.marca}</td>
      <td>${coche.modelo}</td>
      <td>${coche.año}</td>
      <td class="${coche.estado === 'alquilado' ? 'estado-alquilado' : 'estado-disponible'}">${coche.estado}</td>
      <td>${coche.color || '-'}</td>
      <td>${coche.velocidad || '-'}</td>
      <td>${coche.precio} €</td>
      <td><button onclick="verCoche(${coche.id})">👁️</button></td>
    `;
    cuerpo.appendChild(fila);
  });

  const totalPaginas = Math.ceil(cochesFiltrados.length / cochesPorPagina);
  spanPagina.textContent = `Página ${paginaActual}`;
  btnAnterior.disabled = paginaActual === 1;
  btnSiguiente.disabled = paginaActual >= totalPaginas;
}
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
  .then(res => {
    if (res.ok) {
      alert('Vehículo actualizado');
      cerrarPanel();
      location.reload(); // refresca la tabla
    } else {
      alert('Error al guardar');
    }
  });
});

function cerrarPanel() {
  document.getElementById('panel-edicion').classList.remove('visible');
}
