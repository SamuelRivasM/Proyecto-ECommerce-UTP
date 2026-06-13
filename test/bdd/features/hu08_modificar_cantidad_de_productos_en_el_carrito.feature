# language: es
@BDD @HU08 @S4 @FuncionesCliente
Característica: Modificar cantidad de productos en el carrito
  Como cliente con productos en el carrito
  Quiero modificar la cantidad de cada producto
  Para ajustar mi pedido según lo que necesito

  @CP-HU08-01
  Escenario: Incrementar cantidad
    Dado el carrito contiene un producto
    Cuando el cliente aumenta la cantidad
    Entonces el sistema actualiza cantidad y subtotal

  @CP-HU08-02
  Escenario: Disminuir cantidad
    Dado el carrito contiene un producto con cantidad mayor a uno
    Cuando el cliente disminuye la cantidad
    Entonces el sistema actualiza cantidad y subtotal

  @CP-HU08-03
  Escenario: Cantidad superior al stock
    Dado el cliente intenta superar el stock disponible
    Cuando aumenta la cantidad más allá del límite
    Entonces el sistema bloquea la actualización

  @CP-HU08-04
  Escenario: Cantidad mínima inválida
    Dado el cliente intenta colocar cero o negativo
    Cuando modifica la cantidad a un valor inválido
    Entonces el sistema corrige o rechaza el valor
