# language: es
Característica: Selección de pago por billetera digital, efectivo o tarjeta
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU11 mediante escenarios BDD en Gherkin.

  Escenario: Seleccionar billetera digital
    Dado el cliente está en el resumen de pago
    Cuando elige Billetera Digital
    Entonces el sistema registra el método y muestra instrucciones correspondientes

  Escenario: Seleccionar efectivo
    Dado el cliente está en el resumen de pago
    Cuando elige Efectivo
    Entonces el sistema registra el método de pago en recojo

  Escenario: Seleccionar tarjeta
    Dado el cliente está en el resumen de pago
    Cuando elige Tarjeta
    Entonces el sistema registra el método y habilita el flujo correspondiente

  Escenario: Método no seleccionado
    Dado el cliente intenta continuar sin seleccionar método
    Cuando presiona confirmar
    Entonces el sistema solicita seleccionar una opción
