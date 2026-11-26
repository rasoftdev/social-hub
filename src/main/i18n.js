'use strict';

const STRINGS = {
  es: {
    unread: '{n} sin leer',
    'tray.open': 'Abrir Social Hub',
    'tray.quit': 'Salir',
    'tray.hint': 'Social Hub sigue abierto en la bandeja y te avisará de nuevas notificaciones.'
  },
  en: {
    unread: '{n} unread',
    'tray.open': 'Open Social Hub',
    'tray.quit': 'Quit',
    'tray.hint': 'Social Hub is still running in the tray and will keep notifying you.'
  }
};

function mt(lang, key, vars) {
  const s = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.es[key] || key;
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
}

module.exports = { mt };
