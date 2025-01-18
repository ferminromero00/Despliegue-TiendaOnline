describe("Prueba básica de fetch", () => {
  it("debería obtener datos de una API", async () => {
    // Crear una función mock de fetch para simular la respuesta de la API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ key: "value" })
      })
    );

    // Llamar a fetch y esperar la respuesta
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();

    // Verificar que los datos obtenidos sean los esperados
    expect(data.key).toBe("value");

    // Verificar que fetch haya sido llamado con la URL correcta
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/data");
  });
});
