# language: es
@BDD @HU26 @S12 @FuncionesAdmin
Característica: Identificar productos más vendidos
  Como administrador del sistema
  Quiero identificar cuáles son los productos más vendidos
  Para optimizar el inventario y conocer las preferencias de los clientes

  @CP-HU26-01
  Escenario: Visualizar lista de los productos más vendidos
    Dado el administrador se encuentra en el panel de reportes de inventario
    Cuando accede a la sección de productos más vendidos
    Entonces el sistema muestra un ranking de productos ordenados de mayor a menor cantidad vendida

  @CP-HU26-02
  Escenario: Filtrar productos más vendidos por categoría
    Dado el administrador visualiza el ranking de productos más vendidos
    Cuando selecciona una categoría específica
    Entonces el sistema muestra únicamente los productos más vendidos pertenecientes a esa categoría

  @CP-HU26-03
  Escenario: Descargar reporte de productos más vendidos
    Dado el administrador visualiza el ranking de productos
    Cuando selecciona exportar el reporte a formato CSV o PDF
    Entonces el sistema genera y descarga el archivo con los datos del ranking de ventas

  @CP-HU26-04
  Escenario: Visualización de productos con cero ventas
    Dado existen productos nuevos en el catálogo que aún no han sido comprados
    Cuando el administrador revisa el reporte de productos más vendidos
    Entonces el sistema muestra el final de la lista con la cantidad de ventas en cero para esos productos
