# Known issues

- The installer is unsigned according to the README, so Windows SmartScreen may warn. The README also records `EBUSY` during packaging when antivirus scans `dist/win-unpacked` and possible symlink permission failures when extracting winCodeSign.
- The Windows build references the tracked `build/icon.ico`. Use `npm run icons` to regenerate it when updating the logo.
- An unreadable or invalid `accounts.json` falls back to defaults on load. Save failures are logged while the in-memory change remains. Session cleanup failures are logged and account removal continues. See `accounts.js` and `deleteAccount` in `main.js`.
- Recreating a deleted account generates a new partition and requires sign-in again. Alert audio can be muted globally or per account.
- Unread tracking depends on service titles and the notification APIs wrapped by the service preload. Notification click behavior depends on the service.
- The README describes in-app popups. `createView` actually denies new windows and sends an allowed same-service popup URL to `loadURL` in the existing account view. Main-frame navigations and redirects to other sites are blocked and opened in the system browser.
- [PENDING: known service-specific failures verified at runtime.]
