# Workflow

1. Use Node.js 20+ as specified in the README. Run `npm install` then `npm start`.
2. Locate the owning process or renderer component. For UI changes, use [Frontend](frontend.md) and keep English and Spanish strings in sync.
3. Check the affected behavior in the running app. For account changes, exercise add, rename, reorder, switch and delete as relevant. For notifications, check badges, mute, focus and close to tray. For UI changes, check both languages and the minimum window size.
4. When branding changes or packaging icons need regeneration, run `npm run icons` from the repo root. The source is `src/renderer/assets/logo.svg`. The script writes `build/icon.png`, `build/icon.ico` and `src/assets/icon.png`.
5. For a Windows package, run `npm run dist`. Check `dist/Social_Hub_<version>.exe` and the install-directory prompt. The README describes the installer as unsigned.

[PENDING: release publishing, signing and CI procedures.]
