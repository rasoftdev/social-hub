# Flujo de trabajo

1. Usa Node.js 20+ según el README. Ejecuta `npm install` y luego `npm start`.
2. Localiza el proceso o componente responsable. Para cambios de interfaz, consulta [Frontend](frontend.md) y sincroniza los textos en inglés y español.
3. Comprueba el comportamiento afectado en la aplicación. Para cambios en cuentas, prueba agregar, renombrar, reordenar, cambiar de cuenta y eliminar según corresponda. Para notificaciones, comprueba insignias, silencio, foco y cierre a bandeja. Para cambios visuales, comprueba ambos idiomas y el tamaño mínimo de ventana.
4. Cuando cambie la marca o haya que regenerar los iconos de empaquetado, ejecuta `npm run icons` desde la raíz. La fuente es `src/renderer/assets/logo.svg`. El script escribe `build/icon.png`, `build/icon.ico` y `src/assets/icon.png`.
5. Para generar el paquete de Windows, ejecuta `npm run dist`. Comprueba `dist/Social_Hub_<versión>.exe` y el selector de directorio de instalación. El README indica que el instalador se distribuye sin firma.

[PENDING: procedimientos de publicación, firma e integración continua.]
