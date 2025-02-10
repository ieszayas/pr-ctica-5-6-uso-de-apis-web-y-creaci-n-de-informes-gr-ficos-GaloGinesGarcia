function borrarCamposFormulario(idNombre, idApellidos, idFecha, idNumero) {
    const inputNombre = document.getElementById(idNombre);
    const inputApellidos = document.getElementById(idApellidos);
    const inputFecha = document.getElementById(idFecha);
    const inputNumero = document.getElementById(idNumero);

    
    inputNombre.value = "";
    inputApellidos.value = "";
    inputFecha.value = "dd/mm/aaaa";
    inputNumero.value = "";

    
    eliminarError(inputNombre);
    eliminarError(inputApellidos);
    eliminarError(inputFecha);
    eliminarError(inputNumero);

    
    mostrarMensaje("mensajeEmergente", 3000);
}

function enviarDatosFormulario(idNombre, idApellidos, idFecha, idNumero) {
    const hayErrores = validaciones(idNombre, idApellidos, idFecha, idNumero);
    if (!hayErrores) {
        mostrarMensaje("mensajeEmergenteDos", 3000); 
    }
}

function validaciones(idNombre, idApellidos, idFecha, idNumero) {
    const inputNombre = document.getElementById(idNombre);
    const inputApellidos = document.getElementById(idApellidos);
    const inputFecha = document.getElementById(idFecha);
    const inputNumero = document.getElementById(idNumero);

    
    const validacionLetras = /^[a-zA-Z]+$/;
    const validacionNumeros = /^[0-9]+$/;

    let hayErrores = false;

    
    if (!validacionLetras.test(inputNombre.value)) {
        marcarError(inputNombre); 
        hayErrores = true;
    } else {
        eliminarError(inputNombre);
    }

    if (!validacionLetras.test(inputApellidos.value)) {
        marcarError(inputApellidos);
        hayErrores = true;
    } else {
        eliminarError(inputApellidos);
    }

    
    if (!validacionNumeros.test(inputNumero.value)) {
        marcarError(inputNumero);
        hayErrores = true;
    } else {
        eliminarError(inputNumero);
    }

    
    if (hayErrores) {
        mostrarMensaje("mensajeEmergenteTres", 3000);
    }

    return hayErrores;
}

function marcarError(campo) {
    campo.classList.add("campoError");
}

function eliminarError(campo) {
    campo.classList.remove("campoError");
}

function mostrarMensaje(idMensaje, duracion) {
    const mensaje = document.getElementById(idMensaje);
    mensaje.style.display = 'block';
    mensaje.style.opacity = '1';

    setTimeout(() => {
        mensaje.style.opacity = '0';
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 300); 
    }, duracion);
}

function cambiarModo() {
    const body = document.body;
    const boton = document.getElementById("modoBtn");

    body.classList.toggle("modo-oscuro"); 

    if (body.classList.contains("modo-oscuro")) {
        boton.textContent = "Modo Claro"; 
    } else {
        boton.textContent = "Modo Oscuro";
    }
}

function cambiarColorTabla(event) {
    const colorSeleccionado = event.target.value; 
    const tabla = document.querySelector('.tablaCustom'); 

    
    tabla.style.backgroundColor = colorSeleccionado;
}

function actualizarReloj() {
    const fecha = new Date();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    
    const horaFormateada = `${horas}:${minutos}:${segundos}`;
    document.getElementById("reloj").innerText = horaFormateada;
}



function filtrarLenguajes() {
    
    let input = document.getElementById("busquedaLenguaje").value.toLowerCase();
    
    let filas = document.querySelectorAll("#tabla tbody tr");

    
    filas.forEach(function(fila) {
        
        let lenguaje = fila.cells[1].textContent.toLowerCase();
        
        
        if (lenguaje.includes(input)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}


setInterval(actualizarReloj, 1000);


actualizarReloj();

async function cargarModelos(marca) {
    if (!marca) {
        alert("Por favor, selecciona una marca.");
        return;
    }

    // URL de la API que deseas consultar
    const urlAPI = `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${marca}`;

    // URL del proxy All Origins
    const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(urlAPI)}`;

    try {
        const response = await fetch(proxyURL);
        const data = await response.json();

        console.log("Respuesta de la API:", data);

        if (data.contents) {
            const modelos = JSON.parse(data.contents).Models;  // Procesar la respuesta JSON correctamente

            if (modelos && modelos.length > 0) {
                const tablaBody = document.getElementById("tablaModelos");
                tablaBody.innerHTML = "";  // Limpiar la tabla antes de agregar nuevas filas

                modelos.forEach((modelo, index) => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${modelo.model_name}</td>
                        <td>${modelo.model_year}</td>
                    `;
                    tablaBody.appendChild(fila);
                });
            } else {
                alert("No se encontraron modelos para esta marca.");
            }
        } else {
            alert("No se recibieron datos de la API.");
        }
    } catch (error) {
        console.error("Error obteniendo modelos:", error);
        alert("Ocurrió un error al obtener los modelos.");
    }
}

function actualizarTabla() {
    const marcaSeleccionada = document.getElementById("marcaSelector").value.toLowerCase();
    console.log("Marca seleccionada:", marcaSeleccionada);
    cargarModelos(marcaSeleccionada);
}
//Uso de la api de coches
/*async function cargarVehiculos() {
    try {
        const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json'); // API pública de vehículos
        const data = await response.json(); //Convierte la respuesta en un objeto javascript

        const tablaBody = document.querySelector("#tabla tbody");
        tablaBody.innerHTML = ""; // Limpiar contenido previo

        data.Results.slice(0, 10).forEach((vehiculo, index) => {
            const fila = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${vehiculo.Make_Name}</td>
                    <td>${Math.floor(Math.random() * 20) + 5}%</td>
                </tr>
            `;
            tablaBody.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al cargar los vehículos:", error);
    }
}

// Llamar a la función cuando la página cargue
document.addEventListener("DOMContentLoaded", cargarVehiculos);
*/

