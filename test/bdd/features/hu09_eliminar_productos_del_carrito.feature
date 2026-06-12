# language: es
Característica: Eliminación de productos no deseados del carrito
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU09 mediante escenarios BDD en Gherkin.

  Escenario: Eliminar un producto
    Dado el cliente tiene productos en el carrito
    Cuando selecciona eliminar en un producto
    Entonces el sistema retira el producto del carrito

  Escenario: Cancelar eliminación
    Dado el sistema solicita confirmación
    Cuando el cliente cancela la acción
    Entonces el producto permanece en el carrito

  Escenario: Eliminar último producto
    Dado el carrito contiene un solo producto
    Cuando el cliente lo elimina
    Entonces el sistema muestra carrito vacío

  Escenario: Eliminar producto inexistente
    Dado el producto ya no existe en el carrito
    Cuando se intenta eliminar nuevamente
    Entonces el sistema mantiene un comportamiento controlado
