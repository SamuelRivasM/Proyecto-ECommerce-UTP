# language: es
@BDD @HU06 @S3 @FuncionesCliente
Característica: Búsqueda de productos por nombre
  Como cliente
  Quiero buscar productos por su nombre
  Para localizar rápidamente un producto específico

  @CP-HU06-01
  Escenario: Búsqueda exacta
    Dado existe un producto con el nombre ingresado
    Cuando el cliente escribe el nombre completo
    Entonces el sistema muestra el producto coincidente

  @CP-HU06-02
  Escenario: Búsqueda parcial
    Dado existen productos con coincidencias parciales
    Cuando el cliente escribe parte del nombre
    Entonces el sistema lista resultados relacionados

  @CP-HU06-03
  Escenario: Sin coincidencias
    Dado no existe ningún producto relacionado
    Cuando el cliente realiza la búsqueda
    Entonces el sistema muestra un mensaje de no encontrado

  @CP-HU06-04
  Escenario: Búsqueda vacía
    Dado el cliente limpia el campo de búsqueda
    Cuando el sistema actualiza el listado
    Entonces se muestra nuevamente el catálogo general
