# language: es
Característica: Gestión de datos personales del perfil de usuario
  Como parte de Plataforma E-commerce para la Cafetería Universitaria UTP
  Se requiere validar la HU04 mediante escenarios BDD en Gherkin.

  Escenario: Visualizar perfil
    Dado el usuario inició sesión correctamente
    Cuando ingresa a la sección de perfil
    Entonces el sistema muestra sus datos registrados

  Escenario: Editar datos válidos
    Dado el usuario visualiza su perfil
    Cuando modifica datos permitidos y guarda cambios
    Entonces el sistema actualiza la información correctamente

  Escenario: Edición con datos inválidos
    Dado el usuario edita su perfil
    Cuando ingresa datos con formato incorrecto
    Entonces el sistema muestra validaciones y no guarda cambios inválidos

  Escenario: Acceso sin sesión
    Dado un visitante no autenticado intenta entrar al perfil
    Cuando solicita la ruta del perfil
    Entonces el sistema lo redirige al inicio de sesión
