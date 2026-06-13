# language: es
@BDD @HU18 @S9 @FuncionesCocina
Característica: Detalle completo de la orden
  Como personal de cocina
  Quiero consultar el detalle completo de una orden
  Para preparar correctamente productos y cantidades

  @CP-HU18-01
  Escenario: Abrir detalle de orden
    Dado cocina visualiza una orden en la lista
    Cuando selecciona ver detalle
    Entonces el sistema muestra la información completa de la orden

  @CP-HU18-02
  Escenario: Ver productos del pedido
    Dado la orden contiene varios productos
    Cuando cocina abre el detalle
    Entonces el sistema muestra productos, cantidades y subtotales

  @CP-HU18-03
  Escenario: Ver datos de pago y total
    Dado la orden fue confirmada por el cliente
    Cuando cocina revisa el detalle
    Entonces el sistema muestra método de pago y total a pagar

  @CP-HU18-04
  Escenario: Cerrar detalle
    Dado el detalle de la orden está abierto
    Cuando cocina cierra la ventana o modal
    Entonces el sistema retorna a la lista de pedidos
