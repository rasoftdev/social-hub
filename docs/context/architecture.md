# Architecture

- Social Hub 1.0.0 is an Electron 45 desktop app packaged for Windows with electron-builder and NSIS. It wraps WhatsApp, Facebook, Instagram, TikTok and LinkedIn websites.
- `src/main/main.js` owns the window, tray, account views, IPC and unread counts. `accounts.js` handles local persistence, `services.js` holds the service catalog and domain rules, and `i18n.js` holds native UI strings.
- `src/renderer/` contains the local HTML, CSS, DOM rendering, icons, translations and chime. `src/preload/ui-preload.js` bridges local UI calls through `window.hub`. `service-preload.js` reports web notification events to main.
- UI action → preload IPC → main validation and state change → persisted metadata in `userData/accounts.json` and updated renderer state. Each account uses a sandboxed `WebContentsView` with its own persistent Chromium partition.
- Web titles and notification events feed badges, sound and tray state. Home opens at startup while account views load in the background. Local pages and overlays hide the service views.
- `scripts/` generates icons from the SVG logo, `build/` holds packaging assets and `dist/` holds build output. The repo has no app backend, database server, frontend framework or automated test suite.
