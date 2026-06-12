# language: es
Característica: Registro de usuario con correo institucional UTP
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU01 mediante escenarios BDD en Gherkin.

  Escenario: Registro exitoso con correo UTP
    Dado el usuario se encuentra en la pantalla de registro
    Cuando ingresa nombre, correo UTP, contraseña válida y confirma el formulario
    Entonces el sistema crea la cuenta y muestra confirmación de registro

  Escenario: Registro fallido por correo no institucional
    Dado el usuario se encuentra en la pantalla de registro
    Cuando ingresa un correo que no pertenece al dominio UTP
    Entonces el sistema bloquea el registro y muestra un mensaje de validación

  Escenario: Registro fallido por campos obligatorios vacíos
    Dado el usuario se encuentra en la pantalla de registro
    Cuando envía el formulario sin completar los campos requeridos
    Entonces el sistema informa que debe completar la información obligatoria

  Escenario: Registro fallido por correo duplicado
    Dado existe una cuenta registrada con el mismo correo UTP
    Cuando el usuario intenta registrarse nuevamente con ese correo
    Entonces el sistema impide duplicar la cuenta y muestra el error correspondiente
