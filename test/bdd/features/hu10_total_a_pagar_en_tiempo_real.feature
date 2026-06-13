# language: es
@BDD @HU10 @S5 @FuncionesCliente
Característica: Total a pagar en tiempo real
  Como cliente con productos en el carrito
  Quiero visualizar el total actualizado automáticamente
  Para conocer el importe real de mi pedido

  @CP-HU10-01
  Escenario: Calcular total inicial
    Dado el cliente agrega productos al carrito
    Cuando visualiza el carrito
    Entonces el sistema muestra subtotal y total correcto

  @CP-HU10-02
  Escenario: Actualizar total al cambiar cantidad
    Dado existen productos en el carrito
    Cuando el cliente modifica cantidades
    Entonces el total se recalcula en tiempo real

  @CP-HU10-03
  Escenario: Actualizar total al eliminar
    Dado el carrito contiene varios productos
    Cuando el cliente elimina un producto
    Entonces el total disminuye correctamente

  @CP-HU10-04
  Escenario: Carrito vacío
    Dado no existen productos en el carrito
    Cuando el cliente visualiza el resumen
    Entonces el sistema muestra total igual a cero o mensaje de carrito vacío
