# language: es
@BDD @HU01 @S1 @SeguridadAutenticacin
Característica: Registro de usuario con correo institucional UTP
  Como usuario de la cafetería universitaria
  Quiero registrarme con mi correo institucional UTP
  Para acceder al sistema y realizar pedidos

  @CP-HU01-01
  Escenario: Registro exitoso con correo UTP
    Dado el usuario se encuentra en la pantalla de registro
    Cuando ingresa nombre, correo UTP, contraseña válida y confirma el formulario
    Entonces el sistema crea la cuenta y muestra confirmación de registro

  @CP-HU01-02
  Escenario: Registro fallido por correo no institucional
    Dado el usuario se encuentra en la pantalla de registro
    Cuando ingresa un correo que no pertenece al dominio UTP
    Entonces el sistema bloquea el registro y muestra un mensaje de validación

  @CP-HU01-03
  Escenario: Registro fallido por campos obligatorios vacíos
    Dado el usuario se encuentra en la pantalla de registro
    Cuando envía el formulario sin completar los campos requeridos
    Entonces el sistema informa que debe completar la información obligatoria

  @CP-HU01-04
  Escenario: Registro fallido por correo duplicado
    Dado existe una cuenta registrada con el mismo correo UTP
    Cuando el usuario intenta registrarse nuevamente con ese correo
    Entonces el sistema impide duplicar la cuenta y muestra el error correspondiente
