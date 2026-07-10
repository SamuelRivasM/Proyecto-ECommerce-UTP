# language: es
@BDD @HU21 @S12 @FuncionesCocina
Característica: Eliminación de productos del catálogo
  Como personal de cocina
  Quiero eliminar productos que ya no se ofrecen
  Para mantener actualizado el catálogo disponible

  @CP-HU21-01
  Escenario: Eliminar correctamente un producto
    Dado el personal de cocina se encuentra en la pantalla de gestión de productos
    Cuando selecciona un producto y confirma su eliminación
    Entonces el sistema elimina el producto del catálogo y muestra un mensaje de confirmación

  @CP-HU21-02
  Escenario: Cancelar la eliminación de un producto
    Dado el personal de cocina selecciona un producto para eliminar
    Cuando cancela la operación
    Entonces el sistema conserva el producto en el catálogo

  @CP-HU21-03
  Escenario: Intentar eliminar un producto inexistente
    Dado el producto ya no se encuentra registrado en el catálogo
    Cuando el personal de cocina intenta eliminarlo
    Entonces el sistema informa que el producto no existe

  @CP-HU21-04
  Escenario: Confirmar eliminación del producto
    Dado el personal de cocina selecciona un producto
    Cuando confirma la eliminación
    Entonces el sistema actualiza el catálogo mostrando que el producto fue eliminado