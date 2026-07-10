# language: es
@BDD @HU24 @S12 @FuncionesAdmin
Característica: Cambiar rol de un usuario
  Como administrador del sistema
  Quiero cambiar el rol de un usuario registrado
  Para otorgarle permisos de cocina, administración o cliente según corresponda

  @CP-HU24-01
  Escenario: Cambiar rol de cliente a cocina exitosamente
    Dado el administrador se encuentra en la lista de usuarios
    Cuando selecciona un usuario con rol "cliente" y cambia su rol a "cocina"
    Entonces el sistema actualiza el rol del usuario en la base de datos y muestra un mensaje de éxito

  @CP-HU24-02
  Escenario: Cancelar el cambio de rol
    Dado el administrador ha seleccionado cambiar el rol de un usuario
    Cuando cancela la confirmación del cambio
    Entonces el sistema mantiene el rol original del usuario sin realizar modificaciones

  @CP-HU24-03
  Escenario: Asignar rol de administrador a otro usuario
    Dado el administrador se encuentra en la lista de usuarios
    Cuando cambia el rol de un usuario a "administrador" y confirma la acción
    Entonces el sistema otorga los permisos correspondientes y actualiza el rol en la lista

  @CP-HU24-04
  Escenario: Intentar cambiar el rol al propio usuario activo
    Dado el administrador está gestionando los roles de usuario
    Cuando intenta cambiar su propio rol de administrador a cliente
    Entonces el sistema bloquea la acción y muestra una advertencia de seguridad para evitar pérdida de acceso
