<div align="center">

<img src="src/renderer/assets/logo.svg" alt="Social Hub" width="120">

# Social Hub

**Todas tus redes sociales en un solo lugar.**

Windows · Español / English · Licencia MIT

</div>

---

Social Hub es una aplicación de escritorio hecha con Electron que te permite gestionar varias cuentas de WhatsApp, Facebook, Instagram, TikTok y LinkedIn desde una sola ventana. Cada cuenta tiene su propia sesión aislada, así que puedes mantener varias cuentas del mismo servicio abiertas a la vez sin que se mezclen.

## Índice

- [Qué incluye](#qué-incluye)
- [Servicios compatibles](#servicios-compatibles)
- [Notificaciones](#notificaciones)
- [Ajustes](#ajustes)
- [Privacidad y seguridad](#privacidad-y-seguridad)
- [Ejecutar desde el código](#ejecutar-desde-el-código)
- [Generar el instalador](#generar-el-instalador)
- [Iconos y marca](#iconos-y-marca)
- [Solución de problemas](#solución-de-problemas)
- [Creador y contacto](#creador-y-contacto)
- [Licencia](#licencia)

## Qué incluye

- Varias cuentas por servicio. Los nombres por defecto son "\<Servicio\>", "\<Servicio\> 2"… y pueden tener hasta 50 caracteres.
- Sesión aislada por cada cuenta; al eliminar una cuenta se borran su almacenamiento y su caché.
- Menú contextual propio (clic derecho o botón "…"): Renombrar, Recargar, Silenciar/Activar sonido, Mover arriba/abajo y Eliminar (con confirmación).
- Reordenación de cuentas arrastrando y soltando en la barra lateral.
- Pantalla de **Inicio** con tarjetas de cada servicio, número de cuentas e insignias de no leídos; se pueden expandir para ver sus cuentas. La aplicación siempre arranca en Inicio.
- Página de **Ajustes** con idioma, sonido general y sonido por cuenta.
- Página **Acerca de** con logo, versión, creador, botón "Conoce al creador" y licencia.
- Instancia única: si abres la aplicación por segunda vez, se enfoca la ventana existente.
- Las ventanas emergentes del mismo servicio (por ejemplo, un inicio de sesión) se abren dentro de la aplicación; el resto de enlaces se abren en el navegador del sistema.
- Ventana de 1280x800 (mínimo 800x500) con barra de título oscura personalizada.

## Servicios compatibles

| Servicio | URL | Cámara y micrófono |
| --- | --- | --- |
| WhatsApp | https://web.whatsapp.com | Sí |
| Facebook | https://www.facebook.com | Sí |
| Instagram | https://www.instagram.com | Sí |
| TikTok | https://www.tiktok.com | No |
| LinkedIn | https://www.linkedin.com | No |

## Notificaciones

- Insignias de no leídos por cuenta (barra lateral) y por servicio (tarjetas de Inicio).
- Contador en el icono de la barra de tareas (Windows) y título de la ventana "Social Hub (N)".
- Sonido de aviso, con un margen de 1,5 s entre avisos por cuenta.
- Parpadeo de la ventana cuando no está enfocada.
- Los contadores se detectan a partir del título de la página (por ejemplo, "(3)") o de las notificaciones web del servicio.
- Los no leídos se limpian al abrir la cuenta o al enfocar la ventana.
- Puedes silenciar todo el sonido o solo una cuenta concreta.

> Las notificaciones solo llegan mientras la aplicación está abierta: al cerrar la ventana, la aplicación se cierra. Además, las cuentas que aún no se han abierto en la sesión no se cargan; al iniciar solo se precarga la última cuenta activa.

## Ajustes

| Opción | Descripción |
| --- | --- |
| Idioma | Español / English. Por defecto usa el idioma del sistema; la elección se guarda. |
| Sonido de notificaciones | Interruptor general para silenciar o activar todos los avisos sonoros. |
| Sonido por cuenta | Interruptor individual para cada cuenta. |

Además, la página **Acerca de** muestra la versión, el creador y la licencia.

## Privacidad y seguridad

- Cada cuenta usa una partición aislada (`persist:acc-<id>`), de modo que cookies, sesiones y caché no se comparten entre cuentas.
- Al eliminar una cuenta se borran los datos de su sesión (inicios de sesión, cookies y caché).
- Los datos de la aplicación se guardan localmente en `accounts.json`, dentro de la carpeta de datos de usuario de la app (en Windows, normalmente en `%APPDATA%`).
- `contextIsolation` activado, `sandbox` activado, `nodeIntegration` desactivado y una política CSP estricta.
- Lista de permisos permitidos: notificaciones; cámara y micrófono solo para WhatsApp, Facebook e Instagram.
- Los enlaces externos se abren en el navegador del sistema.
- Se usa un user agent de Chrome de escritorio.

## Ejecutar desde el código

Requiere Node.js 20 o superior.

```bash
npm install
npm start
```

## Generar el instalador

```bash
npm run dist
```

El instalador se genera en `dist\Social_Hub_<versión>.exe` (por ejemplo, `dist\Social_Hub_1.0.0.exe`).

- Instalador NSIS, no de un solo clic: permite elegir la carpeta de instalación.
- No está firmado digitalmente, por lo que SmartScreen puede mostrar un aviso: pulsa "Más información → Ejecutar de todas formas".

## Iconos y marca

- `src/renderer/assets/logo.svg` es la fuente del logo.
- `npm run icons` regenera `build/icon.png`, `build/icon.ico` y `src/assets/icon.png` (requiere las dependencias de desarrollo `sharp` y `png-to-ico`).
- `SocialHub.webp` es la ilustración completa de la marca.

## Solución de problemas

- **`EBUSY` al compilar:** suele deberse a que el antivirus analiza `dist\win-unpacked`. Elimina la carpeta `dist` y vuelve a intentarlo.
- **"Cannot create symbolic link" al extraer winCodeSign:** activa el Modo de desarrollador de Windows o ejecuta la terminal como administrador.
- **Un servicio pide iniciar sesión de nuevo tras eliminar y recrear una cuenta:** es lo esperado, las sesiones son independientes por cuenta.
- **No suena el aviso:** revisa que no esté silenciado en la barra lateral, en Ajustes o en la propia cuenta.

## Creador y contacto

Hecho por **Ricardo Alvarez** (RASOFTDEV).

- 🌐 Sitio web: <https://me.ricardoalvarez.co/>
- ✉️ Contacto: [dev@ricardoalvarez.co](mailto:dev@ricardoalvarez.co)

## Licencia

MIT © 2026 RASOFTDEV. Ver [LICENSE](LICENSE).
