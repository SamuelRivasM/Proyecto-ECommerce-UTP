# language: es
@BDD @HU04 @S2 @SeguridadAutenticacin
Característica: Visualización y edición del perfil
  Como usuario autenticado
  Quiero consultar y actualizar mis datos de perfil
  Para mantener mi información personal correcta

  @CP-HU04-01
  Escenario: Visualizar perfil
    Dado el usuario inició sesión correctamente
    Cuando ingresa a la sección de perfil
    Entonces el sistema muestra sus datos registrados

  @CP-HU04-02
  Escenario: Editar datos válidos
    Dado el usuario visualiza su perfil
    Cuando modifica datos permitidos y guarda cambios
    Entonces el sistema actualiza la información correctamente

  @CP-HU04-03
  Escenario: Edición con datos inválidos
    Dado el usuario edita su perfil
    Cuando ingresa datos con formato incorrecto
    Entonces el sistema muestra validaciones y no guarda cambios inválidos

  @CP-HU04-04
  Escenario: Acceso sin sesión
    Dado un visitante no autenticado intenta entrar al perfil
    Cuando solicita la ruta del perfil
    Entonces el sistema lo redirige al inicio de sesión
