# Arquitectura

- Social Hub 1.0.0 es una aplicación de escritorio con Electron 45, empaquetada para Windows con electron-builder y NSIS. Integra los sitios web de WhatsApp, Facebook, Instagram, TikTok y LinkedIn.
- `src/main/main.js` controla la ventana, la bandeja, las vistas de cuenta, IPC y los no leídos. `accounts.js` gestiona la persistencia local, `services.js` contiene el catálogo y las reglas de dominio, e `i18n.js` contiene los textos de la interfaz nativa.
- `src/renderer/` contiene el HTML y CSS locales, el renderizado del DOM, los iconos, las traducciones y el sonido. `src/preload/ui-preload.js` conecta la interfaz local mediante `window.hub`. `service-preload.js` informa al proceso principal de las notificaciones web.
- Acción de interfaz → IPC del preload → validación y cambio de estado en el proceso principal → metadatos en `userData/accounts.json` y estado actualizado en el renderizador. Cada cuenta tiene un `WebContentsView` con sandbox y su propia partición persistente de Chromium.
- Los títulos y las notificaciones web alimentan insignias, sonido y bandeja. La aplicación abre en Inicio mientras carga las cuentas en segundo plano. Las páginas locales y las capas superpuestas ocultan las vistas de servicio.
- `scripts/` genera iconos desde el logo SVG, `build/` contiene recursos de empaquetado y `dist/` contiene la salida de compilación. El repositorio carece de backend propio, servidor de base de datos, framework frontend y suite automatizada.
