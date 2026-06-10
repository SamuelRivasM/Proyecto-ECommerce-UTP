# language: es
Característica: Agregar productos disponibles al carrito de compras
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU07 mediante escenarios BDD en Gherkin.

  Escenario: Agregar producto disponible
    Dado el cliente visualiza un producto con stock
    Cuando presiona agregar al carrito
    Entonces el sistema agrega el producto y actualiza el carrito

  Escenario: Agregar producto repetido
    Dado el producto ya existe en el carrito
    Cuando el cliente vuelve a agregarlo
    Entonces el sistema incrementa la cantidad o notifica la actualización

  Escenario: Agregar sin stock
    Dado el producto no tiene disponibilidad
    Cuando el cliente intenta agregarlo
    Entonces el sistema impide la acción y muestra el mensaje correspondiente

  Escenario: Agregar sin sesión
    Dado un visitante intenta agregar productos
    Cuando presiona agregar al carrito
    Entonces el sistema solicita iniciar sesión
