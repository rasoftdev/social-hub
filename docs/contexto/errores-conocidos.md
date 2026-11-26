# Errores conocidos

- Según el README, el instalador carece de firma y Windows SmartScreen puede mostrar una advertencia. El README también recoge errores `EBUSY` cuando el antivirus analiza `dist/win-unpacked` y posibles fallos de permisos de enlaces simbólicos al extraer winCodeSign.
- El empaquetado de Windows referencia `build/icon.ico`, versionado en Git. Usa `npm run icons` para regenerarlo al actualizar el logo.
- Si `accounts.json` es ilegible o inválido, la carga usa valores predeterminados. Un fallo al guardar se registra y el cambio permanece en memoria. Si falla la limpieza de la sesión, se registra el error y continúa la eliminación de la cuenta. Consulta `accounts.js` y `deleteAccount` en `main.js`.
- Recrear una cuenta eliminada genera una partición nueva y exige iniciar sesión otra vez. El sonido de aviso puede silenciarse de forma global o por cuenta.
- El conteo de no leídos depende de los títulos y las API de notificación que intercepta el preload de servicio. El comportamiento al hacer clic en una notificación depende del servicio.
- El README describe ventanas emergentes dentro de la aplicación. `createView` bloquea las ventanas nuevas y pasa una URL admitida del mismo servicio a `loadURL` en la vista de cuenta existente. Las navegaciones y redirecciones del marco principal a otros sitios se bloquean y se abren en el navegador del sistema.
- [PENDING: fallos específicos de servicios comprobados en ejecución.]
