# language: es
@BDD @HU09 @S5 @FuncionesCliente
Característica: Eliminar productos del carrito
  Como cliente con productos en el carrito
  Quiero eliminar productos que ya no deseo
  Para mantener actualizado el contenido de mi compra

  @CP-HU09-01
  Escenario: Eliminar un producto
    Dado el cliente tiene productos en el carrito
    Cuando selecciona eliminar en un producto
    Entonces el sistema retira el producto del carrito

  @CP-HU09-02
  Escenario: Cancelar eliminación
    Dado el sistema solicita confirmación
    Cuando el cliente cancela la acción
    Entonces el producto permanece en el carrito

  @CP-HU09-03
  Escenario: Eliminar último producto
    Dado el carrito contiene un solo producto
    Cuando el cliente lo elimina
    Entonces el sistema muestra carrito vacío

  @CP-HU09-04
  Escenario: Eliminar producto inexistente
    Dado el producto ya no existe en el carrito
    Cuando se intenta eliminar nuevamente
    Entonces el sistema mantiene un comportamiento controlado
