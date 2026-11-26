# Glossary

| Term | Meaning in Social Hub |
| --- | --- |
| Service | Supported website with an ID, URL and camera and microphone permissions in `SERVICES`. |
| Account | Local record with UUID, service ID, display label and mute flag. Signing in happens on the service website. |
| Partition | Persistent Electron session named `persist:acc-<id>` that stores account browsing data. |
| Account view | `WebContentsView` hosting the service website for one account. |
| Home | Default local page with service cards, account lists and unread badges. |
| Unread | In-memory count derived from service page titles and web notification events. |
| Tray | Windows notification area icon and menu used to reopen or quit the app. |
| IPC / preload | Inter-process communication and the scripts that mediate it between main and web contents. |
| CSP | Content Security Policy that restricts resource loading in the local shell. |
| NSIS | Windows installer target configured in `package.json`. |
