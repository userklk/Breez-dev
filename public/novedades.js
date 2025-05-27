let coches = [];
let indexActual = 0;

fetch("/vehiculos")
  .then(res => res.json())
  .then(data => {
    coches = mezclar(data);
    mostrarCoche(coches[indexActual]);
  });

function mezclar(array) {
  return array.sort(() => Math.random() - 0.5);
}
//Math.radnom para mostrar coches aleatorios
function mostrarCoche(coche) {
  const contenedor = document.getElementById("novedad-coche");
  contenedor.innerHTML = `
    <div class="card">
      <img src="${coche.imagen}" alt="${coche.modelo}" class="card-img">
      <div class="card-info">
        <h2>${coche.marca} ${coche.modelo}</h2>
        <p>${coche.descripcion || "Sin descripción."}</p>
        <ul>
          <li><strong>Año:</strong> ${coche.año}</li>
          <li><strong>Velocidad:</strong> ${coche.velocidad} km/h</li>
          <li><strong>Precio:</strong> ${coche.precio} €/día</li>
        </ul>
      </div>
    </div>
  `;
}

document.getElementById("btn-siguiente").addEventListener("click", () => {
  indexActual = (indexActual + 1) % coches.length;
  mostrarCoche(coches[indexActual]);
});
