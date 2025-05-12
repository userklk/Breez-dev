const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`/vehiculos`)
  .then((res) => res.json())
  .then((vehiculos) => {
    const coche = vehiculos.find((v) => v.id == id);
    if (!coche)
      return (document.getElementById("detalle-coche").textContent =
        "Coche no encontrado");

    // ✅ Establecer imagen como fondo del body
    const body = document.getElementById("body-reservar");
    body.style.backgroundImage = `url('${coche.imagen}')`;
    body.classList.add("fondo-coche");

    // ✅ Mostrar la info del coche
    document.getElementById("detalle-coche").innerHTML = `
    <div class="info-carta">
      <div class="carta-derecha">
        <p class="dec-infos"><strong>Precio:</strong> ${coche.precio} € / día</p>
        <p class="dec-infos"><strong>Año:</strong> ${coche.año}</p>
        <p class="dec-infos"><strong>Estado:</strong> ${coche.estado}</p>
        <p class="descripcion-carta dec-infos" >${coche.descripcion}</p>
        <img class="img-res" src="${coche.imagen}" alt="${coche.modelo}" />
      </div>
    <div class="carta-izquierda">
    <h1 class="dec-infos">${coche.marca} ${coche.modelo}</h1>
       <form id="form-reserva">
  <div class="form-row">
    <label for="nombre">Nombre del conductor:</label>
    <input type="text" id="nombre" name="nombre" required />
    
    <label for="correo">Correo electrónico:</label>
    <input type="email" id="correo" name="correo" required />
  </div>

  <div class="form-row">
    <label for="dni">DNI/NIE:</label>
    <input type="text" id="dni" name="dni" required />
    
    <label for="modelo">Modelo de coche:</label>
    <input type="text" id="modelo" name="modelo" readonly />
  </div>

  <div class="form-row">
    <label for="fecha-reserva">Fecha de Reserva:</label>
    <input type="date" id="fecha-reserva" name="fecha_reserva" required />
    
    <label for="fecha-entrega">Fecha de entrega:</label>
    <input type="date" id="fecha-entrega" name="fecha_entrega" required />
  </div>

  <div class="form-row">
    <label for="localizacion-entrega">Localización de entrega:</label>
    <input type="text" id="localizacion-entrega" name="localizacion_entrega" required />
    
    <label for="localizacion-recogida">Localización de recogida:</label>
    <input type="text" id="localizacion-recogida" name="localizacion_recogida" required />
  </div>

  <hr />

  <div class="form-checks">
    <label>
      <input type="checkbox" required />
      Condiciones de <a href="#">alquiler</a>.
    </label><br />
    <label>
      <input type="checkbox" required />
      He leído y acepto las condiciones de uso.
    </label>
  </div>

  <button type="submit" class="btn-reservar">Reservar</button>
</form>

        </div>
      </div>
    `;
  });
