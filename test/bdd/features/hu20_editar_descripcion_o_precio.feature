# language: es
@BDD @HU20 @S10 @FuncionesCocina
Característica: Edición de productos del catálogo
  Como personal de cocina
  Quiero editar la descripción o precio de productos existentes
  Para mantener actualizada la información del catálogo

  @CP-HU20-01
  Escenario: Editar correctamente un producto
    Dado el personal de cocina se encuentra en la pantalla de gestión de productos
    Cuando selecciona un producto, modifica su descripción o precio y guarda los cambios
    Entonces el sistema actualiza la información del producto y muestra un mensaje de confirmación

  @CP-HU20-02
  Escenario: Intentar guardar cambios con campos obligatorios vacíos
    Dado el personal de cocina se encuentra editando un producto
    Cuando elimina la información obligatoria y guarda los cambios
    Entonces el sistema informa que debe completar los campos obligatorios

  @CP-HU20-03
  Escenario: Intentar actualizar un producto con precio inválido
    Dado el personal de cocina se encuentra editando un producto
    Cuando ingresa un precio igual o menor a cero
    Entonces el sistema muestra un mensaje indicando que el precio debe ser mayor a cero

  @CP-HU20-04
  Escenario: Cancelar la edición del producto
    Dado el personal de cocina se encuentra editando un producto
    Cuando selecciona la opción cancelar
    Entonces el sistema descarta los cambios y mantiene la información original