# language: es
@BDD @HU07 @S4 @FuncionesCliente
Característica: Agregar productos al carrito
  Como cliente autenticado
  Quiero agregar productos disponibles al carrito
  Para preparar mi pedido antes de pagarlo

  @CP-HU07-01
  Escenario: Agregar producto disponible
    Dado el cliente visualiza un producto con stock
    Cuando presiona agregar al carrito
    Entonces el sistema agrega el producto y actualiza el carrito

  @CP-HU07-02
  Escenario: Agregar producto repetido
    Dado el producto ya existe en el carrito
    Cuando el cliente vuelve a agregarlo
    Entonces el sistema incrementa la cantidad o notifica la actualización

  @CP-HU07-03
  Escenario: Agregar sin stock
    Dado el producto no tiene disponibilidad
    Cuando el cliente intenta agregarlo
    Entonces el sistema impide la acción y muestra el mensaje correspondiente

  @CP-HU07-04
  Escenario: Agregar sin sesión
    Dado un visitante intenta agregar productos
    Cuando presiona agregar al carrito
    Entonces el sistema solicita iniciar sesión
