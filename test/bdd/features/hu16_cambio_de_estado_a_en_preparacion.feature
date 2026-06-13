# language: es
@BDD @HU16 @S8 @FuncionesCocina
Característica: Cambio de estado a En preparación
  Como personal de cocina
  Quiero actualizar un pedido pendiente a En preparación
  Para informar el avance de la orden

  @CP-HU16-01
  Escenario: Cambio exitoso
    Dado existe un pedido en estado Pendiente
    Cuando cocina selecciona actualizar a En preparación
    Entonces el sistema cambia el estado del pedido

  @CP-HU16-02
  Escenario: Pedido no pendiente
    Dado el pedido ya se encuentra en otro estado
    Cuando cocina intenta marcarlo En preparación
    Entonces el sistema evita una transición inválida

  @CP-HU16-03
  Escenario: Actualización visible para cocina
    Dado el estado fue actualizado
    Cuando cocina revisa la lista
    Entonces el pedido cambia de sección o etiqueta

  @CP-HU16-04
  Escenario: Actualización visible para cliente
    Dado cocina cambia el estado
    Cuando el cliente consulta su pedido
    Entonces el sistema muestra En preparación
