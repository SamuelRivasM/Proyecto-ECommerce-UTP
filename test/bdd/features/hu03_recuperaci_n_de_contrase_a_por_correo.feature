# language: es
Característica: Recuperar contraseña olvidada mediante correo electrónico
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU03 mediante escenarios BDD en Gherkin.

  Escenario: Solicitud de recuperación válida
    Dado el usuario se encuentra en la opción de recuperar contraseña
    Cuando ingresa un correo registrado en el sistema
    Entonces el sistema envía instrucciones de recuperación al correo

  Escenario: Correo no registrado
    Dado el usuario intenta recuperar su contraseña
    Cuando ingresa un correo que no existe en la base de datos
    Entonces el sistema muestra un mensaje controlado sin revelar datos sensibles

  Escenario: Formato de correo inválido
    Dado el usuario está en la pantalla de recuperación
    Cuando ingresa un texto sin formato de correo
    Entonces el sistema solicita un correo válido

  Escenario: Cambio de contraseña exitoso
    Dado el usuario posee un enlace o código de recuperación válido
    Cuando ingresa una nueva contraseña y la confirma
    Entonces el sistema actualiza la contraseña y permite iniciar sesión
