let vehiculos = [];
let indiceActual = 0;
const paso = 2; 
const catalogo = document.getElementById('catalogo');
const btnVerMas = document.getElementById('ver-mas');

fetch('/vehiculos')
  .then(res => res.json())
  .then(data => {
    vehiculos = data;
    mostrarVehiculos(4); 
  });
//Muestra 4 vehiculos al cargar la página
// Muestra los vehículos en bloques de 2
function mostrarVehiculos(cantidad) {
  const fin = Math.min(indiceActual + cantidad, vehiculos.length);

  for (let i = indiceActual; i < fin; i += 2) {
    const bloque = document.createElement('div');
    bloque.className = 'bloque-par';

    const coche1 = vehiculos[i];
    const coche2 = vehiculos[i + 1];

    if (coche1) {
      const cartaIzq = document.createElement('div');
      cartaIzq.className = 'carta-izquierda';
      cartaIzq.innerHTML = crearCartaHTML(coche1);
      bloque.appendChild(cartaIzq);
    }

    if (coche2) {
      const cartaDer = document.createElement('div');
      cartaDer.className = 'carta-derecha';
      cartaDer.innerHTML = crearCartaHTML(coche2);
      bloque.appendChild(cartaDer);
    }

    catalogo.appendChild(bloque);
  }
  indiceActual = fin;

  // Si ya no hay más coches, ocultamos el botón
  if (indiceActual >= vehiculos.length) {
    btnVerMas.style.display = 'none';
  }
}
//VER mas
btnVerMas.addEventListener('click', () => {
  mostrarVehiculos(paso);
});

function crearCartaHTML(coche) {
  return `
    <a href="reservar.html?id=${coche.id}" class="carta-link">
      <div class="carta">
        <img src="${coche.imagen}" alt="${coche.marca} ${coche.modelo}">
        <div class="info-carta">
          <h3 class="Texto-inf-carta">${coche.marca} ${coche.modelo}</h3>
          <p>${coche.precio} € / día</p>
          <p>${coche.año}</p>
        </div>
        <p class="estado-carta">${coche.estado}</p>
      </div>
    </a>
  `;
}
