# language: es
@BDD @HU05 @S3 @FuncionesCliente
Característica: Productos organizados por categorías
  Como cliente
  Quiero visualizar productos organizados por categorías
  Para encontrar con facilidad los productos disponibles

  @CP-HU05-01
  Escenario: Listar categorías disponibles
    Dado el cliente ingresa al catálogo
    Cuando el sistema carga el menú principal
    Entonces se muestran categorías como bebidas, snacks o menú

  @CP-HU05-02
  Escenario: Filtrar por categoría
    Dado existen productos asociados a una categoría
    Cuando el cliente selecciona una categoría específica
    Entonces el sistema muestra solo los productos correspondientes

  @CP-HU05-03
  Escenario: Categoría sin productos
    Dado la categoría seleccionada no tiene productos activos
    Cuando el cliente la selecciona
    Entonces el sistema muestra un mensaje de lista vacía

  @CP-HU05-04
  Escenario: Información visible del producto
    Dado el catálogo carga productos disponibles
    Cuando el cliente visualiza la tarjeta del producto
    Entonces el sistema muestra nombre, imagen, precio y disponibilidad
