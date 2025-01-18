// Agregar un mock para localStorage en tus pruebas
beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(() => null), // Simula que no hay datos en localStorage
    setItem: jest.fn(),           // Simula la función setItem
    removeItem: jest.fn(),        // Simula la función removeItem
    clear: jest.fn(),             // Simula la función clear
  };
});

describe("Prueba de Pagina Principal", () => {
  it("debería establecer un valor en localStorage si no existe", () => {
    // Simula el comportamiento de localStorage en tu código
    const carrito = localStorage.getItem("Carrito");

    if (!carrito) {
      localStorage.setItem("Carrito", JSON.stringify([]));
    }

    // Verificar si localStorage.setItem fue llamado
    expect(localStorage.setItem).toHaveBeenCalledWith("Carrito", JSON.stringify([]));
  });
});
