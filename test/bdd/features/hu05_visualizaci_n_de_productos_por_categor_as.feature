# language: es
Característica: Catálogo de productos organizado por categorías
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU05 mediante escenarios BDD en Gherkin.

  Escenario: Listar categorías disponibles
    Dado el cliente ingresa al catálogo
    Cuando el sistema carga el menú principal
    Entonces se muestran categorías como bebidas, snacks o menú

  Escenario: Filtrar por categoría
    Dado existen productos asociados a una categoría
    Cuando el cliente selecciona una categoría específica
    Entonces el sistema muestra solo los productos correspondientes

  Escenario: Categoría sin productos
    Dado la categoría seleccionada no tiene productos activos
    Cuando el cliente la selecciona
    Entonces el sistema muestra un mensaje de lista vacía

  Escenario: Información visible del producto
    Dado el catálogo carga productos disponibles
    Cuando el cliente visualiza la tarjeta del producto
    Entonces el sistema muestra nombre, imagen, precio y disponibilidad
