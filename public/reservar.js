const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`/vehiculos`)
  .then((res) => res.json())
  .then((vehiculos) => {
    const coche = vehiculos.find((v) => v.id == id);
    if (!coche)
      return (document.getElementById("detalle-coche").textContent =
        "Coche no encontrado");


    const body = document.getElementById("body-reservar");
    body.style.backgroundImage = `url('${coche.imagen}')`;
    body.classList.add("fondo-coche");

    document.getElementById("detalle-coche").innerHTML = `
  <div class="info-carta">
    <div class="carta-izquierda">
      <img class="img-fondo" src="${coche.imagen}" alt="${coche.modelo}" />
      <div class="overlay-info">
        <p class="dec-infos">${coche.precio} € / día</p>
        <p class="dec-infos">Año: ${coche.año}</p>
        <p class="dec-infos">Velocidad: ${coche.velocidad} Km/H</p>
      </div>
      </div>
        
        <div class="carta-derecha">
        <h1 class="dec-infos">${coche.marca} ${coche.modelo}</h1>
        <p class="descripcion-carta dec-infos">${coche.descripcion}</p>


  <form id="form-reserva">
        <div class="form-grid">
	<div>
		<label for="nombre">Nombre del conductor:</label>
		<input type="text" id="nombre" name="nombre" required />
	</div>

	<div>
		<label for="correo">Correo electrónico:</label>
		<input type="email" id="correo" name="correo" required />
	</div>

	<div>
		<label for="dni">DNI/NIE:</label>
		<input type="text" id="dni" name="dni" required />
	</div>

	<div>
		<label for="modelo">Modelo de coche:</label>
		<input type="text" id="modelo" name="modelo" readonly />
	</div>

	<div>
		<label for="fecha-reserva">Fecha de Reserva:</label>
		<input type="date" id="fecha-reserva" name="fecha_reserva" required />
	</div>

	<div>
		<label for="fecha-entrega">Fecha de entrega:</label>
		<input type="date" id="fecha-entrega" name="fecha_entrega" required />
	</div>

	<div>
		<label for="localizacion-entrega">Localización de entrega:</label>
		<input type="text" id="localizacion-entrega" name="localizacion_entrega" required />
	</div>

	<div>
		<label for="localizacion-recogida">Localización de recogida:</label>
		<input type="text" id="localizacion-recogida" name="localizacion_recogida" required />
	</div>
</div>

  
  <hr />
  
  <div class="form-checks">
      <label class="checkbox-label">
    <input class="checkbox-input" type="checkbox" required />
     Condiciones de <a href="#">alquiler</a>.
    </label>
    <label class="checkbox-label">
    <input class="checkbox-input" type="checkbox" required />
     He leído y acepto las condiciones de uso.
    </label>
  </div>
  
  <button type="submit" class="btn-reservar">Reservar</button>
  </form>
  
  </div>
  </div>
  `;
});


let galeriaAbierta = false;

window.addEventListener('wheel', (e) => {
  const galeria = document.getElementById('galeria-oculta');

  // Scroll arriba mas fotos
  if (!galeriaAbierta && e.deltaY > 0) {
    galeriaAbierta = true;
    mostrarGaleria();
    return;
  }

  // inversa
  if (galeriaAbierta && e.deltaY < 0) {
    galeriaAbierta = false;
    ocultarGaleria();
  }
});

function mostrarGaleria() {
  const galeria = document.getElementById('galeria-oculta');
  galeria.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const imagenes = [
    'img/coches/int1.jpeg',
    'img/coches/int2.jpeg',
    'img/coches/int3.jpeg',
    'img/coches/int4.jpeg',
    'img/coches/int5.jpeg',
    'img/coches/int6.png'
  ];
  

  const contenedor = document.getElementById('imagenes-extra');
  contenedor.innerHTML = imagenes.map(img => `
    <img src="${img}" alt="Coche extra">
  `).join('');
}

function ocultarGaleria() {
  const galeria = document.getElementById('galeria-oculta');
  galeria.classList.add('ocultando');

  setTimeout(() => {
    galeria.style.display = 'none';
    galeria.classList.remove('ocultando');
    document.body.style.overflow = 'auto';
  }, 500);
}
