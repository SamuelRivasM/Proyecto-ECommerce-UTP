# language: es
@BDD @HU03 @S2 @SeguridadAutenticacin
Característica: Recuperación de contraseña por correo
  Como usuario registrado
  Quiero recuperar mi contraseña mediante correo electrónico
  Para restablecer el acceso a mi cuenta

  @CP-HU03-01
  Escenario: Solicitud de recuperación válida
    Dado el usuario se encuentra en la opción de recuperar contraseña
    Cuando ingresa un correo registrado en el sistema
    Entonces el sistema envía instrucciones de recuperación al correo

  @CP-HU03-02
  Escenario: Correo no registrado
    Dado el usuario intenta recuperar su contraseña
    Cuando ingresa un correo que no existe en la base de datos
    Entonces el sistema muestra un mensaje controlado sin revelar datos sensibles

  @CP-HU03-03
  Escenario: Formato de correo inválido
    Dado el usuario está en la pantalla de recuperación
    Cuando ingresa un texto sin formato de correo
    Entonces el sistema solicita un correo válido

  @CP-HU03-04
  Escenario: Cambio de contraseña exitoso
    Dado el usuario posee un enlace o código de recuperación válido
    Cuando ingresa una nueva contraseña y la confirma
    Entonces el sistema actualiza la contraseña y permite iniciar sesión
