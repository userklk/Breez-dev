const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`/vehiculos`)
  .then((res) => res.json())
  .then((vehiculos) => {
    const coche = vehiculos.find((v) => v.id == id);
    if (!coche)
      return (document.getElementById("detalle-coche").textContent = "Coche no encontrado");

    const body = document.getElementById("body-reservar");
    body.style.backgroundImage = `url('${coche.imagen}')`;
    body.classList.add("fondo-coche");
  //Crea un form decicadoa cada coche por tema de matricula e id
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
                <input type="text" id="modelo" name="modelo" value="${coche.modelo}" readonly />
                <input type="hidden" id="id_coche" name="id_coche" value="${coche.id}" />
                <input type="hidden" id="matricula" name="matricula" value="${coche.matricula}" />
              </div>

              <div>
                <label for="fecha-reserva">Fecha de inicio:</label>
                <input type="date" id="fecha-reserva" name="fecha_reserva" required />
              </div>

              <div>
                <label for="fecha-entrega">Fecha fin reserva:</label>
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

    // Vincular envío después de insertar HTML
    const form = document.getElementById('form-reserva');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const reserva = {
        nombre_conductor: document.getElementById('nombre').value,
        email: document.getElementById('correo').value,
        dni: document.getElementById('dni').value,
        modelo: document.getElementById('modelo').value,
        matricula: document.getElementById('matricula').value,
        fecha_inicio: document.getElementById('fecha-reserva').value,
        fecha_fin: document.getElementById('fecha-entrega').value,
        entrega: document.getElementById('localizacion-entrega').value,
        recogida: document.getElementById('localizacion-recogida').value,
        id_coche: document.getElementById('id_coche').value
      };

      fetch('/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reserva)
      })
        .then(res => res.text())
        .then(mensaje => {
          alert(mensaje);
          form.reset();
        })

        .catch(err => {
          alert('❌ Error en la solicitud: ' + err.message);
        });
    });
  });

// GALERÍA
//Con el scroll se abre y cierra la galería de imágenes extra
let galeriaAbierta = false;

window.addEventListener('wheel', (e) => {
  const galeria = document.getElementById('galeria-oculta');

  if (!galeriaAbierta && e.deltaY > 0) {
    galeriaAbierta = true;
    mostrarGaleria();
    return;
  }

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
