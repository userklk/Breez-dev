
// Mantiene la animacion de todos los input

let inputsForm = document.getElementsByClassName('form_input');
for (let i = 0; i < inputsForm.length; i++) {
  inputsForm[i].addEventListener('keyup', function(){
    if(this.value.length>=1) {
      this.nextElementSibling.classList.add('fijar');
    } else {
      this.nextElementSibling.classList.remove('fijar');
    }
  });
}
//conecta con api de whatsapp con uno de nuestro admin
function enviarMensaje() {
            const nombre = document.getElementById("nombre").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            const mensaje = document.getElementById("mensaje").value.trim();
            const mensajeError = document.getElementById("mensaje-error");
            const telefonoPropietario = "34677646699"; 
            // Validación simple
            if (!nombre || !telefono || !mensaje) {
                mensajeError.textContent = "❌ Debes completar todos los campos.";
                mensajeError.style.color = "red";
                return;
            }
            // URL de whatsapp
            const url = "https://wa.me/" + telefonoPropietario + "?text="
            +encodeURIComponent("Hola, soy " + nombre + ". Mi número de teléfono es " + telefono + ". Mensaje: " + mensaje);

            window.open(url, "_blank");
            // Limpiar los campos después de enviar el mensaje
            document.getElementById("nombre").value = nombre;
            document.getElementById("telefono").value = telefono;
            document.getElementById("mensaje").value = "";
        
        }