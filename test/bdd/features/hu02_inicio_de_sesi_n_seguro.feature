# language: es
Característica: Autenticación segura de usuario
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU02 mediante escenarios BDD en Gherkin.

  Escenario: Login correcto
    Dado el usuario ya se encuentra registrado
    Cuando ingresa correo y contraseña válidos
    Entonces el sistema permite el acceso y genera una sesión segura

  Escenario: Login con contraseña incorrecta
    Dado existe una cuenta registrada
    Cuando el usuario ingresa una contraseña inválida
    Entonces el sistema deniega el acceso y muestra un mensaje de error

  Escenario: Login con usuario inexistente
    Dado el usuario no se encuentra registrado
    Cuando intenta iniciar sesión con un correo no registrado
    Entonces el sistema informa que las credenciales son inválidas

  Escenario: Login con campos vacíos
    Dado el usuario está en la pantalla de inicio de sesión
    Cuando presiona ingresar sin completar los campos
    Entonces el sistema solicita completar correo y contraseña
