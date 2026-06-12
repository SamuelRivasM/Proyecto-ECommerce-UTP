# language: es
Característica: Visualizar detalle completo de cada orden
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU18 mediante escenarios BDD en Gherkin.

  Escenario: Abrir detalle de orden
    Dado cocina visualiza una orden en la lista
    Cuando selecciona ver detalle
    Entonces el sistema muestra la información completa de la orden

  Escenario: Ver productos del pedido
    Dado la orden contiene varios productos
    Cuando cocina abre el detalle
    Entonces el sistema muestra productos, cantidades y subtotales

  Escenario: Ver datos de pago y total
    Dado la orden fue confirmada por el cliente
    Cuando cocina revisa el detalle
    Entonces el sistema muestra método de pago y total a pagar

  Escenario: Cerrar detalle
    Dado el detalle de la orden está abierto
    Cuando cocina cierra la ventana o modal
    Entonces el sistema retorna a la lista de pedidos
