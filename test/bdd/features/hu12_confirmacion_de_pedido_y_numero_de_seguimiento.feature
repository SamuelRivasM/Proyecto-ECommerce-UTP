# language: es
@BDD @HU12 @S6 @FuncionesCliente
Característica: Confirmación de pedido y número de seguimiento
  Como cliente con carrito y método de pago válidos
  Quiero confirmar mi pedido
  Para recibir una constancia y número de seguimiento

  @CP-HU12-01
  Escenario: Confirmación exitosa
    Dado el cliente tiene carrito válido y método de pago
    Cuando confirma el pedido
    Entonces el sistema registra la orden y genera número de seguimiento

  @CP-HU12-02
  Escenario: Carrito vacío
    Dado el cliente no tiene productos en el carrito
    Cuando intenta confirmar pedido
    Entonces el sistema bloquea la acción

  @CP-HU12-03
  Escenario: Stock insuficiente
    Dado un producto del carrito ya no tiene stock suficiente
    Cuando el cliente confirma el pedido
    Entonces el sistema informa el problema y no registra la orden

  @CP-HU12-04
  Escenario: Pedido confirmado
    Dado la orden fue creada correctamente
    Cuando el cliente visualiza la pantalla de confirmación
    Entonces el sistema muestra número, estado inicial y resumen del pedido
