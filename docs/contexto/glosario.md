# Glosario

| Término | Significado en Social Hub |
| --- | --- |
| Servicio | Sitio compatible con ID, URL y permisos de cámara y micrófono en `SERVICES`. |
| Cuenta | Registro local con UUID, ID de servicio, nombre visible y estado de silencio. El inicio de sesión ocurre en el sitio del servicio. |
| Partición | Sesión persistente de Electron llamada `persist:acc-<id>` que guarda los datos de navegación de una cuenta. |
| Vista de cuenta | `WebContentsView` que aloja el sitio del servicio para una cuenta. |
| Inicio | Página local predeterminada con tarjetas de servicios, listas de cuentas e insignias de no leídos. |
| No leídos | Contador en memoria derivado de los títulos y eventos de notificación web del servicio. |
| Bandeja | Icono y menú del área de notificación de Windows para reabrir la aplicación o salir. |
| IPC / preload | Comunicación entre procesos y scripts que median esa comunicación entre el proceso principal y los contenidos web. |
| CSP | Política de seguridad de contenido que restringe la carga de recursos en la interfaz local. |
| NSIS | Formato de instalador para Windows configurado en `package.json`. |
