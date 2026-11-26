'use strict';

const STRINGS = {
  es: { unread: '{n} sin leer' },
  en: { unread: '{n} unread' }
};

function mt(lang, key, vars) {
  const s = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.es[key] || key;
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
}

module.exports = { mt };
