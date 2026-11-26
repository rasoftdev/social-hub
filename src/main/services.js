'use strict';

// Service definitions. Letters/colors are used instead of official logos.
const SERVICES = {
  whatsapp: { name: 'WhatsApp', url: 'https://web.whatsapp.com', color: '#25d366', letter: 'W', media: true },
  facebook: { name: 'Facebook', url: 'https://www.facebook.com', color: '#1877f2', letter: 'F', media: true },
  instagram: { name: 'Instagram', url: 'https://www.instagram.com', color: '#e1306c', letter: 'I', media: true },
  tiktok: { name: 'TikTok', url: 'https://www.tiktok.com', color: '#fe2c55', letter: 'T', media: false },
  linkedin: { name: 'LinkedIn', url: 'https://www.linkedin.com', color: '#0a66c2', letter: 'L', media: false }
};

function isValidService(id) {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(SERVICES, id);
}

// Hostnames considered "same service" (for popups such as login dialogs).
const SERVICE_DOMAINS = {
  whatsapp: ['whatsapp.com', 'whatsapp.net'],
  facebook: ['facebook.com', 'fbcdn.net'],
  instagram: ['instagram.com', 'facebook.com'],
  tiktok: ['tiktok.com'],
  linkedin: ['linkedin.com']
};

function isSameService(service, url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    return (SERVICE_DOMAINS[service] || []).some((d) => u.hostname === d || u.hostname.endsWith('.' + d));
  } catch {
    return false;
  }
}

// Sign-in hosts (https only) that must stay in the account partition.
const AUTH_DOMAINS = ['accounts.google.com', 'appleid.apple.com', 'login.microsoftonline.com', 'login.live.com'];

// Link shims match a service domain but lead to external sites.
const SHIM_HOSTS = ['l.facebook.com', 'lm.facebook.com', 'l.instagram.com'];
const SHIM_PATH_PREFIX_LINKEDIN = '/redir/';

const hostMatches = (host, d) => host === d || host.endsWith('.' + d);

function isLinkShim(url) {
  try {
    const u = new URL(url);
    if (SHIM_HOSTS.includes(u.hostname)) return true;
    return hostMatches(u.hostname, 'linkedin.com') && u.pathname.startsWith(SHIM_PATH_PREFIX_LINKEDIN);
  } catch {
    return false;
  }
}

// Returns the external target wrapped by a link shim, or null.
function unwrapShim(url) {
  try {
    const u = new URL(url);
    if (!isLinkShim(url)) return null;
    return u.searchParams.get(SHIM_HOSTS.includes(u.hostname) ? 'u' : 'url');
  } catch {
    return null;
  }
}

function isAuthUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && AUTH_DOMAINS.some((d) => hostMatches(u.hostname, d));
  } catch {
    return false;
  }
}

// True when the URL should load inside the account view.
function isInViewAllowed(service, url) {
  if (isAuthUrl(url)) return true;
  return isSameService(service, url) && !isLinkShim(url);
}

module.exports = { SERVICES, isValidService, isSameService, isInViewAllowed, unwrapShim };
