// Importa las funciones de manejo de eventos desde el archivo 'login.js'.
import {
    eventDibujar,
    eventCategorias, eventCarrito,
    eventVerMasInformacion,
    dibujarProductoSeleccionado,
    cerrarSesion,
    verCarrito,
    pintarCarritoCompleto,
    vaciarCarrito,
    eventEmail
} from './paginaPrincipal.js';

/**
 * Función principal que inicializa los eventos de la aplicación.
 */
const main = () => {
    // Obtiene la ruta del archivo actual
    let path = window.location.pathname;

    // Verifica si la ruta incluye 'paginaPrincipal.html'
    if (path.includes('paginaPrincipal.html')) {

        eventDibujar();
        eventCategorias();
        eventCarrito();
        eventVerMasInformacion();
        verCarrito();
        cerrarSesion();

    } else if (path.includes('informacionProducto.html')) {

        dibujarProductoSeleccionado();

    } else if (path.includes('Carrito.html')) {

        pintarCarritoCompleto();
        vaciarCarrito();
        eventEmail();
        cerrarSesion();
        
    }
}

// Ejecuta la función main cuando el contenido del documento ha sido completamente cargado
document.addEventListener("DOMContentLoaded", main);