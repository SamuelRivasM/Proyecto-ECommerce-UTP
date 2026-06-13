# language: es
@BDD @HU14 @S7 @FuncionesCliente
Característica: Estado actual del pedido
  Como cliente con un pedido registrado
  Quiero consultar el estado actual de mi pedido
  Para saber si está pendiente, en preparación o listo

  @CP-HU14-01
  Escenario: Ver estado pendiente
    Dado el cliente tiene un pedido recién confirmado
    Cuando consulta el pedido
    Entonces el sistema muestra estado Pendiente

  @CP-HU14-02
  Escenario: Ver estado en preparación
    Dado cocina actualizó el pedido
    Cuando el cliente consulta su estado
    Entonces el sistema muestra En preparación

  @CP-HU14-03
  Escenario: Ver estado listo
    Dado cocina marcó el pedido como listo
    Cuando el cliente consulta su estado
    Entonces el sistema muestra Listo para recoger

  @CP-HU14-04
  Escenario: Acceso a pedido ajeno
    Dado un cliente intenta consultar un pedido que no le pertenece
    Cuando solicita el detalle
    Entonces el sistema bloquea el acceso
