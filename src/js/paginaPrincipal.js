import { URL } from './config.js';

/* FETCH PARA CONSEGUIR INFORMACION DE LA API */

/**
 * Realiza una solicitud HTTP GET a la URL proporcionada y retorna la respuesta en formato JSON.
 * También registra la respuesta en la consola para fines de depuración.
 * @param {string} url - URL del recurso a obtener.
 * @returns {Promise<Object>} - Promesa que resuelve con el objeto JSON obtenido.
 */
function fetch1(url) {
    return fetch(url)
        .then(res => res.json())
        .then(json => {
            return json;
        });
}


/* DIBUJAR JUEGOS Y SCROLL INFINITO*/

// Lleva un registro de la página actual que se está mostrando en la interfaz.
let paginaActual = 0;

// Define cuántos juegos se mostrarán por página.
const juegosPorPagina = 8;

// Indica si se está realizando actualmente una solicitud para cargar más juegos. Evita realizar múltiples solicitudes simultáneas.
let cargando = false;

// Almacena la categoría actualmente seleccionada para filtrar los juegos, se actualiza cuando el usuario selecciona una categoría diferente
let categoriaSeleccionada = "";

// Indica el orden de clasificación de los juegos. Se alterna al hacer clic en el botón de ordenar.
let ordenlistado = "desc";

if (!localStorage.getItem("Carrito")) {
    localStorage.setItem("Carrito", JSON.stringify([]));
}
/**
* Inicia el proceso de dibujo de juegos en la interfaz.
* Llama a la función `dibujar` con los datos iniciales y configura el scroll infinito
*/
export const eventDibujar = async () => {
    cargarPaginas();
    ordenar()
}

/**
* Muestra una lista de juegos en la interfaz basándose en los datos proporcionados y la página actual.
* Ordena los datos según el precio más barato y los organiza por páginas.
* @param {Array<Object>} data - Lista de juegos obtenidos desde la API.
* @param {number} pagina - Número de página a mostrar.
*/
const dibujar = (data, pagina) => {
    data.sort((a, b) => {
        if (ordenlistado === "asc") {
            return a.cheapestPriceEver.price - b.cheapestPriceEver.price;
        } else {
            return b.cheapestPriceEver.price - a.cheapestPriceEver.price;
        }
    });

    let principio = (pagina - 1) * juegosPorPagina;
    let final = pagina * juegosPorPagina;
    // Obtengo solo los juegos para la página actual.
    let objetos = data.slice(principio, final);

    if (document.getElementById("lista_juegos") !== null) {
        let lista = document.getElementById("lista_juegos");

        if (pagina === 1) {
            lista.innerHTML = "";
        }

        objetos.forEach(e => {
            let div = document.createElement("div");
            let h1 = document.createElement("h1");
            let p = document.createElement("p");
            let img = document.createElement("img");
            let p2 = document.createElement("p");
            let button = document.createElement("button")

            h1.textContent = e.info.title;
            p.textContent = "Precio: " + e.cheapestPriceEver.price + "€";
            img.src = e.info.thumb;
            p2.textContent = "Categoria: " + e.info.category;
            button.textContent = "Añadir"
            button.addEventListener("click", () => { eventCarrito(e); });
            div.className = "juegos__contenedor-div"
            img.height = "10vh"
            img.addEventListener("click", () => { eventVerMasInformacion(e) })
            h1.style.fontSize = "1rem"



            lista.appendChild(div);
            div.appendChild(h1);
            div.appendChild(p);
            div.appendChild(p2);
            div.appendChild(img);
            div.appendChild(button)

        });

        // Indica que la carga ha terminado.
        cargando = false;
        document.getElementById("cargando").style.display = "none";
    }
}

/**
* Se encargar de dibujar los juegos de 8 en 8 mientras haces el scroll
*/
const cargarPaginas = async () => {
    if (cargando) return;
    cargando = true;

    let url = `https://${URL}:3000/games`;
    if (categoriaSeleccionada) {
        url += `?info.category=${categoriaSeleccionada}`;
    }

    let data = await fetch1(url);
    paginaActual++;
    dibujar(data, paginaActual);
}

/* 
* Detecta cuando el usuario hace scroll hasta el final de la página y llama a `cargarPaginas` para cargar más juegos.
*/
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        cargarPaginas();
    }
});

/* LISTAR POR CATEGORIAS */

/**
* Obtiene todas las categorías disponibles desde la API y las muestra en un menú desplegable.
* Configura el evento para filtrar los juegos por categoría seleccionada.
*/
export const eventCategorias = async () => {
    let url = `https://${URL}:3000/games`;
    let categorias = listarCategorias(await fetch1(url));
    insertarCategorias(categorias);
    filtrar();
}

/**
* Extrae y devuelve una lista de categorías únicas de los juegos proporcionados.
* @param {Array<Object>} url - Lista de juegos obtenidos desde la API.
* @returns {Array<string>} - Lista de categorías únicas.
*/

const listarCategorias = (url) => {
    let categorias = []

    url.forEach(e => {

        if (!categorias.includes(e.info.category)) {
            categorias.push(e.info.category)
        }
    })
    return categorias;
}

/**
* Agrega las categorías proporcionadas al menú desplegable en la interfaz.
* @param {Array<string>} lista - Lista de categorías únicas.
*/
const insertarCategorias = (lista) => {
    let lista_html = document.getElementById("lista_categorias")
    lista.forEach(e => {
        let option = document.createElement("option")
        option.textContent = e
        option.id = "seleccion"
        lista_html.appendChild(option)
    })
}

/* 
* Configura el evento para filtrar juegos al seleccionar una categoría del menú desplegable. 
*/
const filtrar = () => {
    let lista_html = document.getElementById("lista_categorias");

    lista_html.addEventListener("change", async (event) => {
        categoriaSeleccionada = event.target.value;
        paginaActual = 1;

        document.getElementById("lista_juegos").innerHTML = "";
        let url = `https://${URL}:3000/games?info.category=${categoriaSeleccionada}`;
        dibujar(await fetch1(url), paginaActual);
    });

}

/* CAMBIAR ASCENDENTE O DESCENDENTE */

/* 
* Configura el botón para alternar entre ordenar los juegos de manera ascendente o descendente por precio.
*/
const ordenar = () => {
    let ordenar_btn = document.getElementById("ordenar_btn");

    ordenar_btn.addEventListener("click", async () => {
        ordenlistado = ordenlistado === "asc" ? "desc" : "asc";
        ordenar_btn.textContent = `Ordenar: ${ordenlistado === "asc" ? "Ascendente" : "Descendente"}`;
        paginaActual = 1;

        document.getElementById("lista_juegos").innerHTML = "";

        let url = `https://${URL}:3000/games?_sort=cheapestPriceEver.price&_order=${ordenlistado}`;
        if (categoriaSeleccionada) { url += `&info.category=${categoriaSeleccionada}`; }
        let data = await fetch1(url);
        dibujar(data, paginaActual);
    });
};


/* CARRITO */

/**
* Añade un juego al carrito.
* @param {Object} datos - Datos del juego a añadir al carrito.
*/
export const eventCarrito = (datos) => {
    let contador = localStorage.getItem("contadorCarrito")
    let tituloCarrito = document.getElementById("ContadorCarrito");
    tituloCarrito.innerHTML = "Carrito (" + contador + ")"

    if (datos !== undefined) {
        añadir_al_carrito.add(datos)
    }
}

/**
* Clase Carrito, maneja las operaciones del carrito de compras.
*/
class Carrito {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
    }
    /**
    * Añade un juego al carrito y actualiza la visualización del carrito.
    * @param {Object} juego - Datos del juego a añadir al carrito.
    */
    add(juego) {
        console.log(juego);

        let contador = localStorage.getItem("contadorCarrito")
        contador++
        localStorage.setItem("contadorCarrito", contador)
        document.getElementById("ContadorCarrito").innerHTML = "Carrito (" + contador + ")"

        let titulo = juego.info.title
        let precio = juego.cheapestPriceEver.price
        let img = juego.info.thumb
        let id_producto = juego.id
        let cantidad = 1

        let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];

        // Verificar si el juego ya existe en el carrito
        let juegoExistente = carrito.find(e => e.titulo === titulo);

        if (juegoExistente) { juegoExistente.cantidad += 1; } else {
            carrito.push({ titulo, precio, img, cantidad, id_producto });
        }


        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("Carrito", JSON.stringify(carrito));
    }
    añadir(juego, div) {

        let contador = localStorage.getItem("contadorCarrito")
        contador++
        localStorage.setItem("contadorCarrito", contador)



        let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
        let buscarJuego

        if (juego.titulo !== undefined) {
            buscarJuego = carrito.find(e => e.titulo === juego.titulo)
        } else {
            buscarJuego = carrito.find(e => e.titulo === juego.info.title)
        }

        console.log(buscarJuego);

        let div_p = div.querySelectorAll("p")[3];
        let div_precio = div.querySelectorAll("p")[1];


        if (buscarJuego.cantidad) {
            buscarJuego.cantidad++;
            if (div_p && div_precio) {
                div_p.innerHTML = "Cant: " + buscarJuego.cantidad;
                div_precio.innerHTML = "Precio: " + (buscarJuego.precio * buscarJuego.cantidad).toFixed(2) + " €";
            }
        } else {
            buscarJuego.cantidad++;
            if (div_p && div_precio) {
                div_p.innerHTML = "";
                div_precio.innerHTML = "";
            }
        }

        localStorage.setItem("Carrito", JSON.stringify(carrito));
    }
    /**
    * Borra un producto del carrito basado en su ID.
    * @param {number} id_producto - ID del producto a eliminar.
    * @param {number} id_producto - ID del producto a eliminar.
    */
    borrar(juego, div) {
        let contador = localStorage.getItem("contadorCarrito")
        contador--
        localStorage.setItem("contadorCarrito", contador)

        let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
        let buscarJuego = carrito.find(e => e.titulo === juego.titulo)
        let div_p = div.querySelectorAll("p")[3];
        let div_precio = div.querySelectorAll("p")[1];

        if (buscarJuego.cantidad > 1) {
            buscarJuego.cantidad--
            div_p.innerHTML = "Cant: " + buscarJuego.cantidad
            div_precio.innerHTML = "Precio: " + (buscarJuego.precio * buscarJuego.cantidad).toFixed(2) + " €"
        } else if (buscarJuego.cantidad == 1) {
            div.remove();
            carrito = carrito.filter(e => e.titulo !== juego.titulo);
        }
        localStorage.setItem("Carrito", JSON.stringify(carrito));
    }
    /**
     * Vacía completamente el carrito.
     */
    vaciar() {
        let carrito = document.getElementById("carrito")
        localStorage.removeItem("Carrito");
        localStorage.setItem("contadorCarrito", 0);
        carrito.innerHTML = ""
    }

}

const añadir_al_carrito = new Carrito();


/**
 * Añade un evento de clic al botón con ID "verCarrito" para redirigir al usuario
 * a la página del carrito (Carrito.html).
 */
export const verCarrito = () => {
    let btn = document.getElementById("verCarrito")

    // Escucha el evento "click" en el botón y redirige a la página "Carrito.html".
    btn.addEventListener("click", () => {
        window.location.href = "Carrito.html";
    })
}

/**
 * Recupera los elementos almacenados en el localStorage bajo la clave "Carrito",
 * limpia el contenedor del carrito en el DOM y lo actualiza con los elementos obtenidos.
 * Si no hay elementos en el carrito, muestra un mensaje indicándolo.
 */
export const pintarCarritoCompleto = () => {
    let carrito = document.getElementById("carrito");
    let section = document.getElementById("section_carrito")
    carrito.innerHTML = "";
    let elementos = JSON.parse(localStorage.getItem("Carrito")) || [];

    if (elementos.length > 0) {
        elementos.forEach(e => {
            let div = document.createElement("div");
            let p = document.createElement("p");
            let p2 = document.createElement("p");
            let p3 = document.createElement("p");
            let p4 = document.createElement("p");
            let img = document.createElement("img");
            let btn_borrar = document.createElement("button")
            let btn_añadir = document.createElement("button")

            btn_borrar.addEventListener("click", () => {
                añadir_al_carrito.borrar(e, div)
            })
            btn_borrar.textContent = "Borrar"

            btn_añadir.addEventListener("click", () => {
                añadir_al_carrito.añadir(e, div)
            })
            btn_añadir.textContent = "Añadir"

            let br = document.createElement("br");

            div.id = "contenedorCarrito"
            p.textContent = e.titulo;
            p2.textContent = "Precio: " + (e.precio * e.cantidad).toFixed(2) + " €";
            p3.textContent = "ID: " + e.id_producto;
            p4.textContent = "Cant: " + e.cantidad

            img.src = e.img;
            img.width = 150;
            img.height = 100;

            carrito.appendChild(div)
            div.appendChild(p);
            div.appendChild(p2);
            div.appendChild(p3);
            div.appendChild(p4)
            div.appendChild(img);
            div.appendChild(br);
            div.appendChild(btn_añadir)
            div.appendChild(btn_borrar)
        });
    } else {
        section.innerHTML = ""
    }
}

export const vaciarCarrito = () => {
    let btn_vaciar = document.getElementById("vaciar")

    btn_vaciar.addEventListener("click", () => {
        añadir_al_carrito.vaciar()
    })
}

/* VER MAS INFORMACION DEL PRODUCTO */

/**
* Guarda la información de un producto seleccionado en el localStorage y redirige
* al usuario a la página de detalles del producto (informacionProducto.html).
* @param {Object} datos - Información del producto seleccionado.
*/
export const eventVerMasInformacion = (datos) => {
    if (datos != undefined) {
        localStorage.setItem("productoseleccionado", JSON.stringify(datos))
        window.location.href = "informacionProducto.html";
    }
}
/**
* Recupera los detalles de un producto seleccionado desde el localStorage y lo
* dibuja en el contenedor especificado en la página.
*/

export const dibujarProductoSeleccionado = () => {
    let infoProduct = JSON.parse(localStorage.getItem("productoseleccionado"));

    let lista = document.getElementById("lista")

    let div = document.createElement("div");
    let h1 = document.createElement("h1");
    let p = document.createElement("p");
    let img = document.createElement("img");
    let p2 = document.createElement("p");
    let button = document.createElement("button")
    let info = document.createElement("p");

    h1.textContent = infoProduct.info.title;
    p.textContent = "Precio: " + infoProduct.cheapestPriceEver.price + "€";
    img.src = infoProduct.info.thumb;
    p2.textContent = "Categoria: " + infoProduct.info.category;
    button.textContent = "Añadir"
    info.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo eveniet tempora accusantium similique cum, illo adipisci nesciunt! Reiciendis, voluptatibus odio, numquam facere eaque cumque at asperiores id saepe a fuga."

    button.addEventListener("click", () => {
        añadir_al_carrito.añadir(infoProduct, div)
        window.location.href = "Carrito.html"
    })

    div.className = "producto-info"
    p.className = "precio"
    p2.className = "categoria"
    button.classList = "boton-añadir"


    lista.appendChild(div);
    div.appendChild(p2);
    div.appendChild(h1);
    div.appendChild(info)
    lista.appendChild(img);
    div.appendChild(p);
    lista.appendChild(button)
}

/* EMAILJS */

export const eventEmail = () => {
    if (document.getElementById("terminar-pedido") !== null) {
        let btn = document.getElementById("terminar-pedido");

        // Inicializa EmailJS con tu Public Key
        emailjs.init("rt09wWs6HtBPV7qQO");

        btn.addEventListener("click", () => {
            // Obtiene los valores del formulario
            let nombre = document.getElementById("nom").value;
            let correo = document.getElementById("correo").value;

            let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
            let resumenCarrito = "";
            let precioTotal = 0

            carrito.forEach(e => {
                let titulo = e.titulo
                let precio = parseInt(e.precio)
                let cantidad = e.cantidad

                resumenCarrito += `- Titulo: ${titulo}\n  -Precio: ${precio * cantidad}€\n -Cantidad: ${cantidad}\n\n`;
                precioTotal += (precio * cantidad)
            })

            // Define los parámetros para el correo
            var parametros = {
                to_name: nombre,
                from_name: 'Tienda de Videojuegos',
                message: `Gracias por tu compra. Aquí tienes los detalles de tu pedido:\n\n${resumenCarrito}\n
                "Precio Total: ${precioTotal}€`,
                correo: correo
            };

            // Envía el correo con EmailJS
            emailjs.send('service_essgrlt', 'template_b5o6vz6', parametros)
                .then(function (response) {
                    alert("¡Pedido realizado con exito!")
                    localStorage.removeItem("Carrito");
                    localStorage.setItem("contadorCarrito", 0);
                    window.location.href = '../views/paginaPrincipal.html';

                }, function (error) {
                    console.error('Error al enviar el correo:', error);
                });
        });
    }
};

/* CERRAR SESION */

/**
* Limpia todos los datos almacenados en el localStorage y redirige al usuario
* a la página de inicio (index.html).
*/
export const cerrarSesion = () => {
    let btn = document.getElementById("cerrarSesion")

    btn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../../index.html"
    })
}