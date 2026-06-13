# language: es
@BDD @HU17 @S9 @FuncionesCocina
Característica: Pedido listo para recoger
  Como personal de cocina
  Quiero marcar un pedido preparado como Listo para recoger
  Para avisar al cliente que puede recogerlo

  @CP-HU17-01
  Escenario: Marcar pedido listo
    Dado existe un pedido en estado En preparación
    Cuando cocina presiona Listo para recoger
    Entonces el sistema actualiza el estado del pedido

  @CP-HU17-02
  Escenario: Pedido no preparado
    Dado el pedido aún está Pendiente
    Cuando cocina intenta marcarlo Listo
    Entonces el sistema bloquea la transición si no corresponde

  @CP-HU17-03
  Escenario: Notificación al cliente
    Dado el pedido pasa a Listo para recoger
    Cuando el cliente revisa su estado
    Entonces el sistema muestra el estado listo y mensaje de recojo

  @CP-HU17-04
  Escenario: Evitar duplicidad
    Dado el pedido ya fue marcado como listo
    Cuando cocina intenta repetir la acción
    Entonces el sistema mantiene un único estado final controlado
