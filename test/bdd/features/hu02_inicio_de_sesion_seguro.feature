# language: es
@BDD @HU02 @S1 @SeguridadAutenticacin
Característica: Inicio de sesión seguro
  Como usuario registrado
  Quiero iniciar sesión de forma segura
  Para realizar pedidos y proteger mi cuenta

  @CP-HU02-01
  Escenario: Login correcto
    Dado el usuario ya se encuentra registrado
    Cuando ingresa correo y contraseña válidos
    Entonces el sistema permite el acceso y genera una sesión segura

  @CP-HU02-02
  Escenario: Login con contraseña incorrecta
    Dado existe una cuenta registrada
    Cuando el usuario ingresa una contraseña inválida
    Entonces el sistema deniega el acceso y muestra un mensaje de error

  @CP-HU02-03
  Escenario: Login con usuario inexistente
    Dado el usuario no se encuentra registrado
    Cuando intenta iniciar sesión con un correo no registrado
    Entonces el sistema informa que las credenciales son inválidas

  @CP-HU02-04
  Escenario: Login con campos vacíos
    Dado el usuario está en la pantalla de inicio de sesión
    Cuando presiona ingresar sin completar los campos
    Entonces el sistema solicita completar correo y contraseña
