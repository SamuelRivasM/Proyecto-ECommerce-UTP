# language: es
@BDD @HU22 @S13 @FuncionesCocina
Característica: Actualización del stock de productos
  Como personal de cocina
  Quiero actualizar el stock disponible de cada producto
  Para mantener la disponibilidad real del catálogo

  @CP-HU22-01
  Escenario: Actualizar correctamente el stock
    Dado el personal de cocina se encuentra en la pantalla de gestión de productos
    Cuando modifica la cantidad de stock disponible y guarda los cambios
    Entonces el sistema actualiza el stock del producto y muestra un mensaje de confirmación

  @CP-HU22-02
  Escenario: Intentar registrar un stock vacío
    Dado el personal de cocina se encuentra actualizando el stock
    Cuando deja el campo de stock vacío
    Entonces el sistema informa que debe ingresar una cantidad válida

  @CP-HU22-03
  Escenario: Intentar registrar un stock negativo
    Dado el personal de cocina se encuentra actualizando el stock
    Cuando ingresa una cantidad menor a cero
    Entonces el sistema muestra un mensaje indicando que el stock no puede ser negativo

  @CP-HU22-04
  Escenario: Cancelar la actualización del stock
    Dado el personal de cocina se encuentra actualizando el stock de un producto
    Cuando selecciona la opción cancelar
    Entonces el sistema descarta los cambios y mantiene el stock registrado