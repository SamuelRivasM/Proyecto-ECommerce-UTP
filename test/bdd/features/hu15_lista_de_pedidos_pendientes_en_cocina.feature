# language: es
@BDD @HU15 @S8 @FuncionesCocina
Característica: Lista de pedidos pendientes en cocina
  Como personal de cocina
  Quiero visualizar los pedidos pendientes en tiempo real
  Para organizar la preparación de las órdenes

  @CP-HU15-01
  Escenario: Mostrar pedidos pendientes
    Dado existen pedidos en estado Pendiente
    Cuando el personal de cocina ingresa al panel
    Entonces el sistema muestra la lista de pedidos pendientes

  @CP-HU15-02
  Escenario: Sin pedidos pendientes
    Dado no existen pedidos pendientes
    Cuando cocina ingresa al panel
    Entonces el sistema muestra mensaje de lista vacía

  @CP-HU15-03
  Escenario: Actualización en tiempo real
    Dado un cliente confirma un pedido nuevo
    Cuando cocina permanece en el panel
    Entonces el sistema actualiza la lista sin recargar manualmente

  @CP-HU15-04
  Escenario: Acceso por rol
    Dado un usuario sin rol de cocina intenta entrar
    Cuando solicita el panel de cocina
    Entonces el sistema bloquea el acceso
