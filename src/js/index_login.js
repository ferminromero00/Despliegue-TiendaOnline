// Importa las funciones de manejo de eventos desde el archivo 'login.js'.
import { eventLogin, eventRegistrar, eventBorrar } from './login.js';

/**
* Función principal que inicializa los eventos de la aplicación.
*/
const main = () => {
    
    eventLogin();
    eventRegistrar();
    eventBorrar();
}
document.addEventListener("DOMContentLoaded", main);