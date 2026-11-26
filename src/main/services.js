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

module.exports = { SERVICES, isValidService, isSameService };
