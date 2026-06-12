# language: es
Característica: Cálculo dinámico del total a pagar
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU10 mediante escenarios BDD en Gherkin.

  Escenario: Calcular total inicial
    Dado el cliente agrega productos al carrito
    Cuando visualiza el carrito
    Entonces el sistema muestra subtotal y total correcto

  Escenario: Actualizar total al cambiar cantidad
    Dado existen productos en el carrito
    Cuando el cliente modifica cantidades
    Entonces el total se recalcula en tiempo real

  Escenario: Actualizar total al eliminar
    Dado el carrito contiene varios productos
    Cuando el cliente elimina un producto
    Entonces el total disminuye correctamente

  Escenario: Carrito vacío
    Dado no existen productos en el carrito
    Cuando el cliente visualiza el resumen
    Entonces el sistema muestra total igual a cero o mensaje de carrito vacío
