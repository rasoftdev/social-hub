<div align="center">

<img src="SocialHub.webp" alt="Social Hub" width="520">

<br>

*Todas tus redes sociales en un solo lugar.*

<br>

![Platform: Windows](https://img.shields.io/badge/platform-Windows-1E6FF2?style=flat-square&logo=windows&logoColor=white)
![Electron 45](https://img.shields.io/badge/Electron-45-1E6FF2?style=flat-square&logo=electron&logoColor=white)
![Version 1.0.0](https://img.shields.io/badge/version-1.0.0-FF7A1A?style=flat-square)
![Languages: ES | EN](https://img.shields.io/badge/lang-ES%20%7C%20EN-FF7A1A?style=flat-square)
![License: MIT](https://img.shields.io/badge/license-MIT-050A16?style=flat-square)

[English](README.md) · **Español**

[Características](#características) · [Servicios](#servicios-compatibles) · [Notificaciones](#notificaciones) · [Ejecutar](#primeros-pasos) · [Instalador](#generar-el-instalador) · [Contacto](#creador)

</div>

---

Social Hub es una aplicación de escritorio hecha con Electron que te permite gestionar varias cuentas de WhatsApp, Facebook, Instagram, Messenger, TikTok y LinkedIn desde una sola ventana. Cada cuenta tiene su propia sesión aislada, así que puedes mantener varias cuentas del mismo servicio abiertas a la vez sin que se mezclen.

## Características

<table>
  <tr>
    <td align="center" width="50%"><img src="docs/icons/users.svg" width="28" alt=""><br><b>Varias cuentas</b><br>Tantas cuentas por servicio como necesites. Nombres de hasta 50 caracteres.</td>
    <td align="center" width="50%"><img src="docs/icons/lock.svg" width="28" alt=""><br><b>Sesiones aisladas</b><br>Cada cuenta tiene su propio almacenamiento; al eliminarla se borran sus datos y su caché.</td>
  </tr>
  <tr>
    <td align="center" width="50%"><img src="docs/icons/bell.svg" width="28" alt=""><br><b>Notificaciones unificadas</b><br>Insignias de no leídos, contador en la barra de tareas y sonido de aviso en un solo lugar.</td>
    <td align="center" width="50%"><img src="docs/icons/tray.svg" width="28" alt=""><br><b>Bandeja del sistema</b><br>Cierra la ventana y la aplicación sigue activa; haz clic en una notificación para ir a esa cuenta.</td>
  </tr>
  <tr>
    <td align="center" width="50%"><img src="docs/icons/grip.svg" width="28" alt=""><br><b>Menú contextual y arrastrar y soltar</b><br>Renombra, recarga, silencia, mueve o elimina; reordena cuentas arrastrando.</td>
    <td align="center" width="50%"><img src="docs/icons/languages.svg" width="28" alt=""><br><b>Bilingüe</b><br>Español e inglés, según el idioma del sistema por defecto.</td>
  </tr>
  <tr>
    <td align="center" width="50%"><img src="docs/icons/shield.svg" width="28" alt=""><br><b>Privacidad ante todo</b><br>Renderizador aislado y con sandbox, CSP estricta y lista de permisos permitidos.</td>
    <td align="center" width="50%"><img src="docs/icons/dashboard.svg" width="28" alt=""><br><b>Panel de Inicio</b><br>Una tarjeta por servicio con número de cuentas e insignias de no leídos; expándela para ver las cuentas.</td>
  </tr>
</table>

También incluye: instancia única (abrir la aplicación por segunda vez enfoca la ventana existente), ventanas emergentes del mismo servicio dentro de la aplicación (por ejemplo, un inicio de sesión) mientras el resto de enlaces se abren en tu navegador, y una ventana de 1280x800 (mínimo 800x500) con barra de título oscura personalizada. La aplicación siempre arranca en Inicio.

## Servicios compatibles

| Servicio | URL | Cámara / micrófono |
| --- | --- | :---: |
| <img src="docs/icons/whatsapp.svg" width="20" alt=""> WhatsApp | https://web.whatsapp.com | Sí |
| <img src="docs/icons/facebook.svg" width="20" alt=""> Facebook | https://www.facebook.com | Sí |
| Messenger | https://www.facebook.com/messages/ | — |
| <img src="docs/icons/instagram.svg" width="20" alt=""> Instagram | https://www.instagram.com | Sí |
| <img src="docs/icons/tiktok.svg" width="20" alt=""> TikTok | https://www.tiktok.com | — |
| <img src="docs/icons/linkedin.svg" width="20" alt=""> LinkedIn | https://www.linkedin.com | — |

## Notificaciones

- Insignias de no leídos por cuenta (barra lateral) y por servicio (tarjetas de Inicio).
- Contador en el icono de la barra de tareas (Windows) y título de la ventana "Social Hub (N)".
- Sonido de aviso, con un margen de 1,5 s entre avisos por cuenta; silencia todo o solo una cuenta concreta.
- Parpadeo de la ventana cuando no está enfocada.
- Los contadores se detectan a partir del título de la página (por ejemplo, "(3)") o de las notificaciones web del servicio.
- Los no leídos se limpian al abrir la cuenta o al enfocar la ventana.
- Haz clic en una notificación del sistema para abrir esa cuenta, cuando el servicio lo permita.

> [!TIP]
> Al cerrar la ventana, Social Hub se oculta en la bandeja del sistema y las notificaciones siguen llegando. Todas las cuentas se cargan en segundo plano al iniciar (de forma escalonada), así que cualquier cuenta puede avisarte. El icono de la bandeja muestra un punto rojo y su descripción emergente indica el número de no leídos. Usa el menú de la bandeja (**Abrir Social Hub** / **Salir**); para cerrar por completo, elige **Salir**.

## Ajustes

| Opción | Descripción |
| --- | --- |
| Idioma | Español / English. Por defecto usa el idioma del sistema; la elección se guarda. |
| Sonido de notificaciones | Interruptor general para silenciar o activar todos los avisos sonoros. |
| Sonido por cuenta | Interruptor individual para cada cuenta. |

La página **Acerca de** muestra el logo, la versión, el creador, un botón "Conoce al creador" y la licencia.

## Privacidad y seguridad

- Cada cuenta usa una partición aislada (`persist:acc-<id>`), de modo que cookies, sesiones y caché no se comparten entre cuentas.
- Al eliminar una cuenta se borran los datos de su sesión (inicios de sesión, cookies y caché).
- Los datos de la aplicación se guardan localmente en `accounts.json`, dentro de la carpeta de datos de usuario de la app (en Windows, normalmente en `%APPDATA%`).
- `contextIsolation` activado, `sandbox` activado, `nodeIntegration` desactivado y una política CSP estricta.
- Lista de permisos permitidos: notificaciones; cámara y micrófono solo para WhatsApp, Facebook e Instagram.
- Los enlaces externos se abren en el navegador del sistema.
- Se usa un user agent de Chrome de escritorio.

## Primeros pasos

**Requisitos:** Node.js 20 o superior.

```bash
# Instalar dependencias
npm install

# Iniciar la aplicación
npm start
```

## Generar el instalador

```bash
# Generar el instalador de Windows
npm run dist
```

| Resultado | Detalles |
| --- | --- |
| `dist/Social_Hub_1.0.0.exe` | Instalador NSIS (`dist\Social_Hub_<versión>.exe`), no de un solo clic: permite elegir la carpeta de instalación. |

> [!NOTE]
> El instalador no está firmado digitalmente, por lo que SmartScreen puede mostrar un aviso: pulsa "Más información → Ejecutar de todas formas".

## Iconos y marca

- `src/renderer/assets/logo.svg` es la fuente del logo.
- `SocialHub.webp` es la ilustración completa de la marca.

```bash
# Regenera build/icon.png, build/icon.ico y src/assets/icon.png
# (requiere las dependencias de desarrollo sharp y png-to-ico)
npm run icons
```

## Solución de problemas

<details>
<summary><code>EBUSY</code> al compilar</summary>

<br>

Suele deberse a que el antivirus analiza `dist\win-unpacked`. Elimina la carpeta `dist` y vuelve a intentarlo.

</details>

<details>
<summary>"Cannot create symbolic link" al extraer winCodeSign</summary>

<br>

Activa el Modo de desarrollador de Windows o ejecuta la terminal como administrador.

</details>

<details>
<summary>Un servicio pide iniciar sesión de nuevo tras eliminar y recrear una cuenta</summary>

<br>

Es lo esperado: las sesiones son independientes por cuenta.

</details>

<details>
<summary>No suena el aviso</summary>

<br>

Revisa que no esté silenciado en la barra lateral, en Ajustes o en la propia cuenta.

</details>

---

## Creador

<div align="center">

<img src="src/assets/icon.png" width="88" alt="Logo de Social Hub"><br>
<strong>Ricardo Alvarez</strong><br>
<sub>Creador · RASOFTDEV</sub>

<p><strong>Social Hub</strong> es creado y mantenido por Ricardo Alvarez.</p>

<p>
<a href="https://me.ricardoalvarez.co/"><img src="docs/icons/globe.svg" width="16" alt=""> Sitio web</a>
&nbsp;&nbsp;·&nbsp;&nbsp;
<a href="mailto:dev@ricardoalvarez.co"><img src="docs/icons/mail.svg" width="16" alt=""> Contacto</a>
</p>

</div>

## Licencia

MIT © 2026 RASOFTDEV · [LICENSE](LICENSE)
