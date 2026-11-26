<div align="center">

<img src="SocialHub.webp" alt="Social Hub" width="520">

<br>

*All your social networks in one place.*

<br>

![Platform: Windows](https://img.shields.io/badge/platform-Windows-1E6FF2?style=flat-square&logo=windows&logoColor=white)
![Electron 45](https://img.shields.io/badge/Electron-45-1E6FF2?style=flat-square&logo=electron&logoColor=white)
![Version 1.0.0](https://img.shields.io/badge/version-1.0.0-FF7A1A?style=flat-square)
![Languages: ES | EN](https://img.shields.io/badge/lang-ES%20%7C%20EN-FF7A1A?style=flat-square)
![License: MIT](https://img.shields.io/badge/license-MIT-050A16?style=flat-square)

**English** · [Español](README.es.md)

[Features](#features) · [Services](#supported-services) · [Notifications](#notifications) · [Run](#getting-started) · [Build](#build-the-installer) · [Contact](#creator)

</div>

---

Social Hub is a desktop app built with Electron that lets you manage multiple WhatsApp, Facebook, Instagram, Messenger, TikTok and LinkedIn accounts from a single window. Each account has its own isolated session, so you can keep several accounts of the same service open at once without them mixing.

## Features

<table>
  <tr>
    <td align="center" width="50%"><img src="docs/icons/users.svg" width="28" alt=""><br><b>Multiple accounts</b><br>As many accounts per service as you need. Names up to 50 characters.</td>
    <td align="center" width="50%"><img src="docs/icons/lock.svg" width="28" alt=""><br><b>Isolated sessions</b><br>Each account has its own storage; deleting it wipes its data and cache.</td>
  </tr>
  <tr>
    <td align="center" width="50%"><img src="docs/icons/bell.svg" width="28" alt=""><br><b>Unified notifications</b><br>Unread badges, taskbar counter and alert sound in one place.</td>
    <td align="center" width="50%"><img src="docs/icons/tray.svg" width="28" alt=""><br><b>System tray</b><br>Close the window and the app keeps running; click a notification to jump to that account.</td>
  </tr>
  <tr>
    <td align="center" width="50%"><img src="docs/icons/grip.svg" width="28" alt=""><br><b>Context menu and drag &amp; drop</b><br>Rename, reload, mute, move or delete; reorder accounts by dragging.</td>
    <td align="center" width="50%"><img src="docs/icons/languages.svg" width="28" alt=""><br><b>Bilingual</b><br>Spanish and English, following your system language by default.</td>
  </tr>
  <tr>
    <td align="center" width="50%"><img src="docs/icons/shield.svg" width="28" alt=""><br><b>Privacy-first</b><br>Sandboxed, context-isolated renderer with a strict CSP and permission allowlist.</td>
    <td align="center" width="50%"><img src="docs/icons/dashboard.svg" width="28" alt=""><br><b>Home dashboard</b><br>A card per service with account count and unread badges; expand to see accounts.</td>
  </tr>
</table>

Also included: single instance (a second launch focuses the existing window), in-app pop-ups for the same service (for example, a login) while other links open in your browser, and a 1280x800 window (minimum 800x500) with a custom dark title bar. The app always starts on Home.

## Supported services

| Service | URL | Camera / mic |
| --- | --- | :---: |
| <img src="docs/icons/whatsapp.svg" width="20" alt=""> WhatsApp | https://web.whatsapp.com | Yes |
| <img src="docs/icons/facebook.svg" width="20" alt=""> Facebook | https://www.facebook.com | Yes |
| Messenger | https://www.facebook.com/messages/ | — |
| <img src="docs/icons/instagram.svg" width="20" alt=""> Instagram | https://www.instagram.com | Yes |
| <img src="docs/icons/tiktok.svg" width="20" alt=""> TikTok | https://www.tiktok.com | — |
| <img src="docs/icons/linkedin.svg" width="20" alt=""> LinkedIn | https://www.linkedin.com | — |

## Notifications

- Unread badges per account (sidebar) and per service (Home cards).
- Counter on the taskbar icon (Windows) and window title "Social Hub (N)".
- Alert sound, with a 1.5 s gap between alerts per account; mute everything or just one account.
- Window flashing when it is not focused.
- Counters are detected from the page title (for example, "(3)") or from the service's web notifications.
- Unread counts are cleared when you open the account or focus the window.
- Click an OS notification to open that account, when the service supports it.

> [!TIP]
> Closing the window hides Social Hub to the system tray and notifications keep arriving. All accounts are loaded in the background at startup (staggered), so every account can notify you. The tray icon shows a red dot and its tooltip shows the unread count. Use the tray menu (**Open Social Hub** / **Quit**); to fully exit, choose **Quit**.

## Settings

| Option | Description |
| --- | --- |
| Language | Español / English. Uses the system language by default; your choice is saved. |
| Notification sound | General switch to mute or unmute all alert sounds. |
| Sound per account | Individual switch for each account. |

The **About** page shows the logo, version, creator, a "Meet the creator" button and the license.

## Privacy & security

- Each account uses an isolated partition (`persist:acc-<id>`), so cookies, sessions and cache are not shared between accounts.
- Deleting an account wipes its session data (logins, cookies and cache).
- App data is stored locally in `accounts.json`, inside the app's user data folder (on Windows, usually under `%APPDATA%`).
- `contextIsolation` enabled, `sandbox` enabled, `nodeIntegration` disabled and a strict CSP policy.
- Permission allowlist: notifications; camera and microphone only for WhatsApp, Facebook and Instagram.
- External links open in the system browser.
- A desktop Chrome user agent is used.

## Getting started

**Requirements:** Node.js 20 or later.

```bash
# Install dependencies
npm install

# Start the app
npm start
```

## Build the installer

```bash
# Generate the Windows installer
npm run dist
```

| Output | Details |
| --- | --- |
| `dist/Social_Hub_1.0.0.exe` | NSIS installer (`dist\Social_Hub_<version>.exe`), not one-click: lets you choose the install folder. |

> [!NOTE]
> The installer is not digitally signed, so SmartScreen may show a warning: click "More info → Run anyway".

## Icons & branding

- `src/renderer/assets/logo.svg` is the logo source.
- `SocialHub.webp` is the full brand illustration.

```bash
# Regenerate build/icon.png, build/icon.ico and src/assets/icon.png
# (requires the sharp and png-to-ico dev dependencies)
npm run icons
```

## Troubleshooting

<details>
<summary><code>EBUSY</code> when building</summary>

<br>

Usually caused by antivirus scanning `dist\win-unpacked`. Delete the `dist` folder and try again.

</details>

<details>
<summary>"Cannot create symbolic link" when extracting winCodeSign</summary>

<br>

Enable Windows Developer Mode or run the terminal as administrator.

</details>

<details>
<summary>A service asks me to sign in again after deleting and recreating an account</summary>

<br>

This is expected: sessions are independent per account.

</details>

<details>
<summary>The alert sound doesn't play</summary>

<br>

Check that it isn't muted in the sidebar, in Settings or on the account itself.

</details>

---

## Creator

<div align="center">

<img src="src/assets/icon.png" width="88" alt="Social Hub logo"><br>
<strong>Ricardo Alvarez</strong><br>
<sub>Creator · RASOFTDEV</sub>

<p><strong>Social Hub</strong> is crafted and maintained by Ricardo Alvarez.</p>

<p>
<a href="https://me.ricardoalvarez.co/"><img src="docs/icons/globe.svg" width="16" alt=""> Website</a>
&nbsp;&nbsp;·&nbsp;&nbsp;
<a href="mailto:dev@ricardoalvarez.co"><img src="docs/icons/mail.svg" width="16" alt=""> Contact</a>
</p>

</div>

## License

MIT © 2026 RASOFTDEV · [LICENSE](LICENSE)
