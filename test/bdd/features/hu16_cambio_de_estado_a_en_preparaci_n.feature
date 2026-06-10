# language: es
Característica: Actualizar estado de pedido a En preparación desde cocina
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU16 mediante escenarios BDD en Gherkin.

  Escenario: Cambio exitoso
    Dado existe un pedido en estado Pendiente
    Cuando cocina selecciona actualizar a En preparación
    Entonces el sistema cambia el estado del pedido

  Escenario: Pedido no pendiente
    Dado el pedido ya se encuentra en otro estado
    Cuando cocina intenta marcarlo En preparación
    Entonces el sistema evita una transición inválida

  Escenario: Actualización visible para cocina
    Dado el estado fue actualizado
    Cuando cocina revisa la lista
    Entonces el pedido cambia de sección o etiqueta

  Escenario: Actualización visible para cliente
    Dado cocina cambia el estado
    Cuando el cliente consulta su pedido
    Entonces el sistema muestra En preparación
