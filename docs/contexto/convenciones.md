# Convenciones

- Sigue el estilo de los archivos cercanos. El proceso principal y los preloads usan CommonJS con `'use strict'`, sangría de dos espacios, comillas simples y punto y coma. Los scripts del renderizador se cargan en orden desde `index.html` y actualizan el DOM directamente.
- Usa camelCase para funciones y estado, mayúsculas para constantes, identificadores de servicio en minúsculas y canales IPC con prefijo como `accounts:add`. Centraliza la persistencia en `AccountStore` y las definiciones de servicio en `services.js`.
- Mantén las operaciones privilegiadas en el proceso principal. Expón métodos específicos en `window.hub`, valida allí los IDs de servicio y cuenta, los nombres y las listas de reordenamiento, y mantén Node desactivado en los contenidos web. Usa `textContent` para los nombres de cuenta.
- Actualiza juntos los textos en inglés y español en el `i18n.js` correspondiente. La interfaz estática usa `data-i18n` y `data-i18n-attr`. Consulta [Frontend](frontend.md) para cambios de interfaz.
- Valida manualmente los flujos afectados. `package.json` carece de scripts de pruebas y lint.
- Los commits recientes usan el asunto `[ADD] Add base app`. [PENDING: confirmar convenciones para otros tipos de cambio.]
