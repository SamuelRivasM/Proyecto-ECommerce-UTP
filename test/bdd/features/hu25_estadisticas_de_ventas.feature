# language: es
@BDD @HU25 @S12 @FuncionesAdmin
Característica: Estadísticas de ventas diarias y mensuales
  Como administrador del sistema
  Quiero ver las estadísticas de ventas diarias y mensuales
  Para analizar los ingresos y el rendimiento comercial de la cafetería

  @CP-HU25-01
  Escenario: Visualización de ventas del día actual
    Dado el administrador se encuentra en el panel de estadísticas y reportes
    Cuando consulta el resumen de ventas diarias
    Entonces el sistema muestra el monto acumulado de ventas y la cantidad de pedidos procesados en el día

  @CP-HU25-02
  Escenario: Visualización de ventas mensuales
    Dado el administrador se encuentra en el panel de estadísticas y reportes
    Cuando selecciona visualizar el reporte de ventas del mes en curso
    Entonces el sistema muestra el gráfico o resumen mensual con los ingresos correspondientes

  @CP-HU25-03
  Escenario: Filtrar estadísticas por rango de fechas
    Dado el administrador se encuentra en el panel de estadísticas
    Cuando ingresa un rango de fechas personalizado para las ventas
    Entonces el sistema muestra los reportes financieros correspondientes a dicho periodo

  @CP-HU25-04
  Escenario: Reporte sin ventas registradas en el periodo
    Dado no se han realizado ventas en el rango de fechas seleccionado
    Cuando el administrador solicita el reporte de ventas
    Entonces el sistema muestra estadísticas e ingresos en cero con una notificación informativa
