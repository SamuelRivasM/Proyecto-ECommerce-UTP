# language: es
@BDD @HU19 @S12 @FuncionesCocina
Característica: Registro de nuevos productos en el catálogo
  Como personal de cocina
  Quiero agregar nuevos productos al catálogo con imagen y precio
  Para mantener actualizado el menú disponible para los clientes

  @CP-HU19-01
  Escenario: Registrar producto correctamente
    Dado el personal de cocina se encuentra en la pantalla de registro de productos
    Cuando ingresa el nombre del producto, el precio y selecciona una imagen válida
    Entonces el sistema registra el producto y muestra un mensaje de confirmación

  @CP-HU19-02
  Escenario: Intentar registrar un producto con campos obligatorios vacíos
    Dado el personal de cocina se encuentra en la pantalla de registro de productos
    Cuando intenta guardar el producto sin completar la información requerida
    Entonces el sistema informa que debe completar los campos obligatorios

  @CP-HU19-03
  Escenario: Intentar registrar un producto con precio inválido
    Dado el personal de cocina se encuentra en la pantalla de registro de productos
    Cuando ingresa un precio igual o menor a cero
    Entonces el sistema muestra un mensaje indicando que el precio debe ser mayor a cero

  @CP-HU19-04
  Escenario: Intentar registrar un producto sin imagen
    Dado el personal de cocina se encuentra en la pantalla de registro de productos
    Cuando intenta registrar el producto sin seleccionar una imagen
    Entonces el sistema informa que debe agregar una imagen del producto