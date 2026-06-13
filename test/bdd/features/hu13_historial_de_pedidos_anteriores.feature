# language: es
@BDD @HU13 @S7 @FuncionesCliente
Característica: Historial de pedidos anteriores
  Como cliente autenticado
  Quiero consultar mis pedidos anteriores
  Para revisar fechas, estados, pagos y totales

  @CP-HU13-01
  Escenario: Mostrar historial con pedidos
    Dado el cliente tiene pedidos anteriores
    Cuando ingresa a Mis Pedidos
    Entonces el sistema lista sus pedidos realizados

  @CP-HU13-02
  Escenario: Historial vacío
    Dado el cliente no tiene pedidos registrados
    Cuando ingresa a Mis Pedidos
    Entonces el sistema muestra mensaje sin pedidos

  @CP-HU13-03
  Escenario: Ver resumen de pedido
    Dado existe un pedido en el historial
    Cuando el cliente revisa el registro
    Entonces el sistema muestra fecha, estado, método de pago y total

  @CP-HU13-04
  Escenario: Orden cronológico
    Dado existen varios pedidos
    Cuando el cliente ingresa al historial
    Entonces el sistema presenta pedidos ordenados por fecha
