# language: es
Característica: Confirmar pedido y generar número de seguimiento
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU12 mediante escenarios BDD en Gherkin.

  Escenario: Confirmación exitosa
    Dado el cliente tiene carrito válido y método de pago
    Cuando confirma el pedido
    Entonces el sistema registra la orden y genera número de seguimiento

  Escenario: Carrito vacío
    Dado el cliente no tiene productos en el carrito
    Cuando intenta confirmar pedido
    Entonces el sistema bloquea la acción

  Escenario: Stock insuficiente
    Dado un producto del carrito ya no tiene stock suficiente
    Cuando el cliente confirma el pedido
    Entonces el sistema informa el problema y no registra la orden

  Escenario: Pedido confirmado
    Dado la orden fue creada correctamente
    Cuando el cliente visualiza la pantalla de confirmación
    Entonces el sistema muestra número, estado inicial y resumen del pedido
