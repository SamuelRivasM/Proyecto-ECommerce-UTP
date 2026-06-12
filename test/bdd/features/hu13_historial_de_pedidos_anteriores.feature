# language: es
Característica: Consulta del historial de pedidos del cliente
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU13 mediante escenarios BDD en Gherkin.

  Escenario: Mostrar historial con pedidos
    Dado el cliente tiene pedidos anteriores
    Cuando ingresa a Mis Pedidos
    Entonces el sistema lista sus pedidos realizados

  Escenario: Historial vacío
    Dado el cliente no tiene pedidos registrados
    Cuando ingresa a Mis Pedidos
    Entonces el sistema muestra mensaje sin pedidos

  Escenario: Ver resumen de pedido
    Dado existe un pedido en el historial
    Cuando el cliente revisa el registro
    Entonces el sistema muestra fecha, estado, método de pago y total

  Escenario: Orden cronológico
    Dado existen varios pedidos
    Cuando el cliente ingresa al historial
    Entonces el sistema presenta pedidos ordenados por fecha
