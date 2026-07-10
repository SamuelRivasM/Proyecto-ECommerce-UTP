# language: es
@BDD @HU23 @S12 @FuncionesAdmin
Característica: Lista de todos los usuarios registrados
  Como administrador del sistema
  Quiero ver la lista completa de todos los usuarios registrados
  Para gestionar las cuentas y roles del personal de la cafetería

  @CP-HU23-01
  Escenario: Visualización de lista de usuarios
    Dado el administrador ha iniciado sesión
    Cuando accede a la sección de administración de usuarios
    Entonces el sistema muestra la lista de todos los usuarios registrados con su nombre, correo y rol

  @CP-HU23-02
  Escenario: Búsqueda de un usuario por correo
    Dado el administrador se encuentra en la lista de usuarios
    Cuando busca el correo de un usuario específico en la barra de búsqueda
    Entonces el sistema muestra únicamente los usuarios que coincidan con ese correo

  @CP-HU23-03
  Escenario: Filtrar usuarios por rol
    Dado el administrador se encuentra en la lista de usuarios
    Cuando selecciona filtrar por el rol "cocina"
    Entonces el sistema muestra solo a los usuarios que tengan asignado el rol de cocina

  @CP-HU23-04
  Escenario: Lista vacía de usuarios
    Dado no existen usuarios registrados en la base de datos
    Cuando el administrador ingresa a la lista de usuarios
    Entonces el sistema muestra un mensaje indicando que no hay usuarios registrados
