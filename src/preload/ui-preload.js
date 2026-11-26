'use strict';
const { contextBridge, ipcRenderer } = require('electron');

// Minimal typed API; the raw ipcRenderer is never exposed.
contextBridge.exposeInMainWorld('hub', {
  getState: () => ipcRenderer.invoke('accounts:list'),
  getServices: () => ipcRenderer.invoke('services:list'),
  addAccount: (service, label) => ipcRenderer.invoke('accounts:add', { service: String(service), label: label == null ? '' : String(label) }),
  selectAccount: (id) => ipcRenderer.invoke('accounts:select', { id: String(id) }),
  renameAccount: (id, label) => ipcRenderer.invoke('accounts:rename', { id: String(id), label: label == null ? '' : String(label) }),
  reloadAccount: (id) => ipcRenderer.invoke('accounts:reload', { id: String(id) }),
  deleteAccount: (id) => ipcRenderer.invoke('accounts:delete', { id: String(id) }),
  setAccountMuted: (id, muted) => ipcRenderer.invoke('accounts:mute', { id: String(id), muted: muted === true }),
  reorderAccounts: (ids) => ipcRenderer.invoke('accounts:reorder', { ids: Array.isArray(ids) ? ids.map(String) : [] }),
  getAppInfo: () => ipcRenderer.invoke('app:info'),
  openProfile: () => ipcRenderer.invoke('about:profile'),
  setPage: (open) => ipcRenderer.invoke('ui:page', { open: open === true }),
  setLang: (lang) => ipcRenderer.invoke('settings:lang', { lang: String(lang) }),
  setMuteAll: (muted) => ipcRenderer.invoke('settings:mute', { muted: muted === true }),
  setOverlay: (open) => ipcRenderer.invoke('ui:overlay', { open: open === true }),
  setSidebarCollapsed: (collapsed) => ipcRenderer.invoke('ui:sidebar', { collapsed: collapsed === true }),
  onState: (cb) => { ipcRenderer.on('state', (_e, s) => cb(s)); },
  onPlaySound: (cb) => { ipcRenderer.on('play-sound', () => cb()); }
});
