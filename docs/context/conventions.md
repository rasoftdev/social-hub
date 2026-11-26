# Conventions

- Match the files around the change. Main and preload use CommonJS with `'use strict'`, two-space indentation, single quotes and semicolons. Renderer scripts load in order from `index.html` and update the DOM directly.
- Use camelCase for functions and state, uppercase for constants, lower-case IDs for services, and namespaced IPC channels such as `accounts:add`. Keep persistence in `AccountStore` and service definitions in `services.js`.
- Keep privileged operations in main. Expose narrow methods through `window.hub`, validate service IDs, account IDs, labels and reorder lists in main, and keep Node disabled in web contents. Use `textContent` for account labels.
- Update English and Spanish strings together in the appropriate `i18n.js`. Static UI uses `data-i18n` and `data-i18n-attr`. Follow [Frontend](frontend.md) for UI changes.
- Validate affected flows manually. There is no test or lint script in `package.json`.
- Recent commits use the subject `[ADD] Add base app`. [PENDING: confirm conventions for other change types.]
