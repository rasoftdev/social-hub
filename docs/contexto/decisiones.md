# Decisiones

| Implementación | Motivo visible en el repositorio | Alternativa excluida por la implementación |
| --- | --- | --- |
| Partición persistente de Chromium por cuenta | Separa los inicios de sesión, las cookies y la caché de varias cuentas del mismo servicio. | Sesión de navegador compartida. |
| Interfaz local con sandbox y vistas de servicio separadas | La interfaz local usa un puente IPC acotado y una CSP estricta. El preload de servicio informa de las notificaciones sin exponer una API de cuentas. | IPC de Electron sin encapsular en la interfaz o una API privilegiada para páginas remotas. |
| Instancia única, cierre a bandeja y arranque escalonado | Permite que las cuentas notifiquen en segundo plano. Las vistas arrancan con 1200 ms de separación mientras Inicio permanece visible. | Instancias independientes, salir al cerrar la ventana o cargar únicamente la cuenta seleccionada. |
| Destinos HTTPS de emergentes y navegación del mismo servicio o de inicio de sesión en la vista existente | Mantiene flujos como el inicio de sesión en esa cuenta (dominios del servicio y accesos de Google, Apple y Microsoft). Otras URL HTTP(S), incluidos acortadores como `l.facebook.com`, se abren en el navegador del sistema. | Crear una ventana de Electron por cada emergente. |
| NSIS para Windows con `oneClick: false` | Permite elegir el directorio de instalación. | Instalación con un clic. |

[PENDING: motivo histórico de la elección de Electron y NSIS frente a otras opciones.]
