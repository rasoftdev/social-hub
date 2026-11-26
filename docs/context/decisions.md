# Decisions

| Implementation | Rationale visible in the repo | Alternative excluded by the implementation |
| --- | --- | --- |
| Persistent Chromium partition per account | Keeps logins, cookies and cache separate for multiple accounts on one service. | Shared browser session. |
| Sandboxed local shell and separate service views | The local shell uses a narrow IPC bridge and a strict CSP. Service preload reports notification events without exposing an account API. | Raw Electron IPC exposed to the UI or a privileged API for remote pages. |
| Single instance, close to tray, staggered startup | Keeps accounts able to notify in the background. Views start 1200 ms apart while Home remains visible. | Independent app instances, quitting on window close, or loading only the selected account. |
| Same-service HTTPS popup targets in the existing view | Keeps flows such as sign-in in that account. Other safe HTTP(S) URLs from popup handling go to the system browser. | Creating a separate Electron window for every popup. |
| Windows NSIS with `oneClick: false` | Lets the user select the installation directory. | One-click install. |

[PENDING: historical rationale for choosing Electron and NSIS over other stacks.]
