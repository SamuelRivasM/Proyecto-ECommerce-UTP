# language: es
Característica: Visualización en tiempo real de pedidos pendientes para cocina
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU15 mediante escenarios BDD en Gherkin.

  Escenario: Mostrar pedidos pendientes
    Dado existen pedidos en estado Pendiente
    Cuando el personal de cocina ingresa al panel
    Entonces el sistema muestra la lista de pedidos pendientes

  Escenario: Sin pedidos pendientes
    Dado no existen pedidos pendientes
    Cuando cocina ingresa al panel
    Entonces el sistema muestra mensaje de lista vacía

  Escenario: Actualización en tiempo real
    Dado un cliente confirma un pedido nuevo
    Cuando cocina permanece en el panel
    Entonces el sistema actualiza la lista sin recargar manualmente

  Escenario: Acceso por rol
    Dado un usuario sin rol de cocina intenta entrar
    Cuando solicita el panel de cocina
    Entonces el sistema bloquea el acceso
