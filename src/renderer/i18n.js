'use strict';

const I18N = {
  es: {
    'nav.home': 'Inicio',
    'nav.settings': 'Ajustes',
    'nav.about': 'Acerca de',
    'accounts.title': 'Cuentas',
    'accounts.add': 'Agregar cuenta',
    'sidebar.collapse': 'Colapsar panel',
    'sidebar.expand': 'Expandir panel',
    'accounts.rename': 'Renombrar cuenta',
    'accounts.delete': 'Eliminar cuenta',
    'hero.titleStart': 'Todas tus redes en',
    'hero.titleAccent': 'un solo lugar',
    'hero.sub': 'Gestiona múltiples cuentas de WhatsApp, Facebook, Messenger, Instagram, TikTok, LinkedIn y más, desde una sola aplicación.',
    'settings.title': 'Ajustes',
    'settings.sub': 'Notificaciones y datos de la aplicación.',
    'settings.langTitle': 'Idioma',
    'settings.langSub': 'Idioma de la interfaz.',
    'settings.soundTitle': 'Sonido de notificaciones',
    'settings.soundSub': 'Desactívalo para silenciar todas las cuentas.',
    'settings.perAccount': 'Sonido por cuenta',
    'about.title': 'Acerca de',
    'about.sub': 'Información de la aplicación.',
    'about.version': 'Versión',
    'about.tag': 'Todas tus redes sociales en un solo lugar.',
    'about.createdBy': 'Creado por',
    'about.meet': 'Conoce al creador',
    'about.license': 'Licencia MIT ·',
    'modal.service': 'Servicio',
    'modal.name': 'Nombre',
    'modal.namePlaceholder': 'Opcional (ej. Trabajo)',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'err.nameLength': 'El nombre debe tener entre 1 y 50 caracteres.',
    'err.chooseService': 'Elige un servicio.',
    'err.save': 'No se pudo guardar.',
    'confirm.delete': '¿Eliminar "{name}"? Se borrarán sus datos de sesión (inicios de sesión, cookies y caché).',
    'acc.muted': 'Silenciada',
    'acc.mutedSuffix': ' · silenciada',
    'acc.options': 'Opciones',
    'mute.mute': 'Silenciar notificaciones',
    'mute.unmute': 'Activar sonido',
    'ctx.rename': 'Renombrar',
    'ctx.reload': 'Recargar',
    'ctx.mute': 'Silenciar sonido',
    'ctx.unmute': 'Activar sonido',
    'ctx.up': 'Mover arriba',
    'ctx.down': 'Mover abajo',
    'ctx.delete': 'Eliminar',
    'count.none': 'Sin cuentas',
    'count.one': '1 cuenta',
    'count.many': '{n} cuentas'
  },
  en: {
    'nav.home': 'Home',
    'nav.settings': 'Settings',
    'nav.about': 'About',
    'accounts.title': 'Accounts',
    'accounts.add': 'Add account',
    'sidebar.collapse': 'Collapse panel',
    'sidebar.expand': 'Expand panel',
    'accounts.rename': 'Rename account',
    'accounts.delete': 'Delete account',
    'hero.titleStart': 'All your networks in',
    'hero.titleAccent': 'one place',
    'hero.sub': 'Manage multiple WhatsApp, Facebook, Messenger, Instagram, TikTok, LinkedIn accounts and more, from a single app.',
    'settings.title': 'Settings',
    'settings.sub': 'Notifications and app data.',
    'settings.langTitle': 'Language',
    'settings.langSub': 'Interface language.',
    'settings.soundTitle': 'Notification sound',
    'settings.soundSub': 'Turn it off to mute all accounts.',
    'settings.perAccount': 'Sound per account',
    'about.title': 'About',
    'about.sub': 'App information.',
    'about.version': 'Version',
    'about.tag': 'All your social networks in one place.',
    'about.createdBy': 'Created by',
    'about.meet': 'Meet the creator',
    'about.license': 'MIT License ·',
    'modal.service': 'Service',
    'modal.name': 'Name',
    'modal.namePlaceholder': 'Optional (e.g. Work)',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'err.nameLength': 'The name must be between 1 and 50 characters.',
    'err.chooseService': 'Choose a service.',
    'err.save': 'Could not save.',
    'confirm.delete': 'Delete "{name}"? Its session data (logins, cookies and cache) will be erased.',
    'acc.muted': 'Muted',
    'acc.mutedSuffix': ' · muted',
    'acc.options': 'Options',
    'mute.mute': 'Mute notifications',
    'mute.unmute': 'Unmute',
    'ctx.rename': 'Rename',
    'ctx.reload': 'Reload',
    'ctx.mute': 'Mute sound',
    'ctx.unmute': 'Unmute',
    'ctx.up': 'Move up',
    'ctx.down': 'Move down',
    'ctx.delete': 'Delete',
    'count.none': 'No accounts',
    'count.one': '1 account',
    'count.many': '{n} accounts'
  }
};

let LANG = 'es';

function t(key, vars) {
  const s = (I18N[LANG] && I18N[LANG][key]) || I18N.es[key] || key;
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m));
}

function setLang(l) {
  LANG = l === 'en' ? 'en' : 'es';
}

function countText(n) {
  return n === 0 ? t('count.none') : n === 1 ? t('count.one') : t('count.many', { n });
}

function applyStaticI18n() {
  document.documentElement.lang = LANG;
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-i18n-attr]')) {
    for (const pair of el.dataset.i18nAttr.split(';')) {
      const i = pair.indexOf(':');
      if (i > 0) el.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim()));
    }
  }
}
