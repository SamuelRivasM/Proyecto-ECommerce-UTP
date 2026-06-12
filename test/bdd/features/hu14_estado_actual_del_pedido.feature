# language: es
Característica: Seguimiento del estado actual de un pedido
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU14 mediante escenarios BDD en Gherkin.

  Escenario: Ver estado pendiente
    Dado el cliente tiene un pedido recién confirmado
    Cuando consulta el pedido
    Entonces el sistema muestra estado Pendiente

  Escenario: Ver estado en preparación
    Dado cocina actualizó el pedido
    Cuando el cliente consulta su estado
    Entonces el sistema muestra En preparación

  Escenario: Ver estado listo
    Dado cocina marcó el pedido como listo
    Cuando el cliente consulta su estado
    Entonces el sistema muestra Listo para recoger

  Escenario: Acceso a pedido ajeno
    Dado un cliente intenta consultar un pedido que no le pertenece
    Cuando solicita el detalle
    Entonces el sistema bloquea el acceso
