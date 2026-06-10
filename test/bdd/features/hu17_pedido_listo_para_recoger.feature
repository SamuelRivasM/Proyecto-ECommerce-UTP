# language: es
Característica: Marcar pedido como Listo para recoger
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU17 mediante escenarios BDD en Gherkin.

  Escenario: Marcar pedido listo
    Dado existe un pedido en estado En preparación
    Cuando cocina presiona Listo para recoger
    Entonces el sistema actualiza el estado del pedido

  Escenario: Pedido no preparado
    Dado el pedido aún está Pendiente
    Cuando cocina intenta marcarlo Listo
    Entonces el sistema bloquea la transición si no corresponde

  Escenario: Notificación al cliente
    Dado el pedido pasa a Listo para recoger
    Cuando el cliente revisa su estado
    Entonces el sistema muestra el estado listo y mensaje de recojo

  Escenario: Evitar duplicidad
    Dado el pedido ya fue marcado como listo
    Cuando cocina intenta repetir la acción
    Entonces el sistema mantiene un único estado final controlado
