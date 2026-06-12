# language: es
Característica: Buscador de productos específicos por nombre
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU06 mediante escenarios BDD en Gherkin.

  Escenario: Búsqueda exacta
    Dado existe un producto con el nombre ingresado
    Cuando el cliente escribe el nombre completo
    Entonces el sistema muestra el producto coincidente

  Escenario: Búsqueda parcial
    Dado existen productos con coincidencias parciales
    Cuando el cliente escribe parte del nombre
    Entonces el sistema lista resultados relacionados

  Escenario: Sin coincidencias
    Dado no existe ningún producto relacionado
    Cuando el cliente realiza la búsqueda
    Entonces el sistema muestra un mensaje de no encontrado

  Escenario: Búsqueda vacía
    Dado el cliente limpia el campo de búsqueda
    Cuando el sistema actualiza el listado
    Entonces se muestra nuevamente el catálogo general
