# language: es
Característica: Actualización de cantidades dentro del carrito
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU08 mediante escenarios BDD en Gherkin.

  Escenario: Incrementar cantidad
    Dado el carrito contiene un producto
    Cuando el cliente aumenta la cantidad
    Entonces el sistema actualiza cantidad y subtotal

  Escenario: Disminuir cantidad
    Dado el carrito contiene un producto con cantidad mayor a uno
    Cuando el cliente disminuye la cantidad
    Entonces el sistema actualiza cantidad y subtotal

  Escenario: Cantidad superior al stock
    Dado el cliente intenta superar el stock disponible
    Cuando aumenta la cantidad más allá del límite
    Entonces el sistema bloquea la actualización

  Escenario: Cantidad mínima inválida
    Dado el cliente intenta colocar cero o negativo
    Cuando modifica la cantidad a un valor inválido
    Entonces el sistema corrige o rechaza el valor
