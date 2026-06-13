# language: es
@BDD @HU11 @S6 @FuncionesCliente
Característica: Selección de método de pago
  Como cliente que confirma un pedido
  Quiero seleccionar billetera digital, efectivo o tarjeta
  Para completar el pago con la opción disponible

  @CP-HU11-01
  Escenario: Seleccionar billetera digital
    Dado el cliente está en el resumen de pago
    Cuando elige Billetera Digital
    Entonces el sistema registra el método y muestra instrucciones correspondientes

  @CP-HU11-02
  Escenario: Seleccionar efectivo
    Dado el cliente está en el resumen de pago
    Cuando elige Efectivo
    Entonces el sistema registra el método de pago en recojo

  @CP-HU11-03
  Escenario: Seleccionar tarjeta
    Dado el cliente está en el resumen de pago
    Cuando elige Tarjeta
    Entonces el sistema registra el método y habilita el flujo correspondiente

  @CP-HU11-04
  Escenario: Método no seleccionado
    Dado el cliente intenta continuar sin seleccionar método
    Cuando presiona confirmar
    Entonces el sistema solicita seleccionar una opción
