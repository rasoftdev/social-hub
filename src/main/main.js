'use strict';
const path = require('path');
const { pathToFileURL } = require('url');
const { app, BrowserWindow, WebContentsView, ipcMain, session, shell, nativeTheme, nativeImage, Tray, Menu } = require('electron');
const { SERVICES, isValidService, isSameService } = require('./services');
const { AccountStore, cleanLabel } = require('./accounts');
const { mt } = require('./i18n');
const { applyServiceTheme } = require('./service-theme');

const SIDEBAR_WIDTH = 220; // keep in sync with #sidebar width in styles.css
const SIDEBAR_COLLAPSED_WIDTH = 72; // keep in sync with collapsed sidebar styles
const TITLEBAR_HEIGHT = 36; // keep in sync with #titlebar height in styles.css
const CHROME_MAJOR = process.versions.chrome.split('.')[0];
// Plain desktop Chrome UA: no "Electron/x" and no app name.
const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_MAJOR}.0.0.0 Safari/537.36`;

let win = null;
let store = null;
let overlayOpen = false;
let pageOpen = true; // Inicio / Ajustes page shown: all account views hidden
let sidebarCollapsed = false;
const views = new Map(); // accountId -> WebContentsView
const titleCounts = {}; // accountId -> count parsed from page title
const notifCounts = {}; // accountId -> notifications since last viewed
const lastSound = {}; // accountId -> timestamp of last sound
const wcToAcc = new Map(); // webContents.id -> accountId
const SOUND_DEBOUNCE_MS = 1500;

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

let quitting = false;
let tray = null;
let trayHintShown = false;
let trayHasUnread = null;
let trayLang = null;
const trayImages = {};
app.on('before-quit', () => { quitting = true; });

// ---------- helpers ----------
const partitionOf = (id) => `persist:acc-${id}`;
const isHttpUrl = (u) => {
  try {
    const p = new URL(u).protocol;
    return p === 'http:' || p === 'https:';
  } catch {
    return false;
  }
};

function openExternalSafe(url) {
  if (isHttpUrl(url)) shell.openExternal(url);
}

// Displayed count: title count when available, otherwise notifications since last view.
function displayCount(id) {
  return titleCounts[id] > 0 ? titleCounts[id] : notifCounts[id] || 0;
}

function totalCount() {
  return store.accounts.reduce((sum, a) => sum + displayCount(a.id), 0);
}

let systemLang = 'es';

function effectiveLang() {
  return store.lang || systemLang;
}

function publicState() {
  const badges = {};
  for (const a of store.accounts) badges[a.id] = displayCount(a.id);
  return { accounts: store.accounts, activeId: store.activeId, badges, mutedAll: store.mutedAll, pageOpen, lang: effectiveLang() };
}

function pushState() {
  if (win && !win.isDestroyed()) win.webContents.send('state', publicState());
  updateTaskbarBadge();
}

// Supports "(3) WhatsApp", "(1) Facebook", "Inbox (2)", "(99+) X" and no number (0).
function parseTitleCount(title) {
  const t = String(title || '');
  const m = /^\s*[(\[](\d{1,5})\+?[)\]]/.exec(t) || /[(\[](\d{1,5})\+?[)\]]\s*$/.exec(t);
  return m ? parseInt(m[1], 10) : 0;
}

function playSound(id) {
  const acc = store.get(id);
  if (!acc || store.mutedAll || acc.muted) return;
  const now = Date.now();
  if (now - (lastSound[id] || 0) < SOUND_DEBOUNCE_MS) return;
  lastSound[id] = now;
  if (win && !win.isDestroyed()) win.webContents.send('play-sound');
}

function flashIfUnfocused() {
  if (win && !win.isDestroyed() && win.isVisible() && !win.isFocused()) win.flashFrame(true);
}

function setTitleCount(id, n) {
  const before = displayCount(id);
  const prevTitle = titleCounts[id] || 0;
  titleCounts[id] = n;
  if (prevTitle > 0 && n === 0) notifCounts[id] = 0; // messages were read
  const after = displayCount(id);
  if (after > before) {
    playSound(id);
    flashIfUnfocused();
  }
  if (after !== before || prevTitle !== n) pushState();
}

function onPageNotification(id) {
  const viewing = id === store.activeId && win && win.isFocused() && !overlayOpen && !pageOpen;
  if (!viewing) notifCounts[id] = (notifCounts[id] || 0) + 1;
  playSound(id);
  flashIfUnfocused();
  pushState();
}

function markViewed(id) {
  if (notifCounts[id]) {
    notifCounts[id] = 0;
    pushState();
  }
}

// ---------- taskbar badge ----------
// 3x5 pixel digits, drawn into a raw BGRA buffer (no fonts/canvas needed).
const DIGITS = {
  '+': '000010111010000',
  0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111',
  4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001001001001',
  8: '111101111101111', 9: '111101111001111'
};

function makeBadgeImage(count) {
  const size = 32;
  const buf = Buffer.alloc(size * size * 4);
  const c = (size - 1) / 2;
  const put = (x, y, r, g, b) => {
    const i = (y * size + x) * 4;
    buf[i] = b; buf[i + 1] = g; buf[i + 2] = r; buf[i + 3] = 255;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((x - c) ** 2 + (y - c) ** 2 <= 15.5 ** 2) put(x, y, 229, 57, 53);
    }
  }
  const text = count > 99 ? '99+' : String(count);
  const scale = text.length > 2 ? 2 : text.length > 1 ? 3 : 4;
  const w = text.length * 3 * scale + (text.length - 1) * scale;
  const h = 5 * scale;
  let ox = Math.round((size - w) / 2);
  const oy = Math.round((size - h) / 2);
  for (const ch of text) {
    const g = DIGITS[ch];
    for (let r = 0; r < 5; r++) {
      for (let col = 0; col < 3; col++) {
        if (g[r * 3 + col] !== '1') continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) put(ox + col * scale + dx, oy + r * scale + dy, 255, 255, 255);
        }
      }
    }
    ox += 4 * scale;
  }
  return nativeImage.createFromBuffer(buf, { width: size, height: size, scaleFactor: 2 });
}

function updateTaskbarBadge() {
  const total = totalCount();
  try {
    if (win && !win.isDestroyed()) win.setTitle(total > 0 ? `Social Hub (${total})` : 'Social Hub');
    if (process.platform === 'win32') {
      if (win && !win.isDestroyed()) {
        win.setOverlayIcon(total > 0 ? makeBadgeImage(total) : null, total > 0 ? mt(effectiveLang(), 'unread', { n: total }) : '');
      }
    } else {
      app.setBadgeCount(total);
    }
  } catch (e) {
    console.error('badge error:', e);
  }
  updateTray();
}

// ---------- tray ----------
// Draws a red dot (dark ring) in the top-right corner of a BGRA bitmap.
function paintDot(buf, size) {
  const r = size * 0.22;
  const ring = Math.max(1, Math.round(size / 16));
  const ri = r - ring;
  const cx = size - r - 0.5;
  const cy = r + 0.5;
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const over = (i, rr, g, b, a) => {
    if (a <= 0) return;
    const da = buf[i + 3] / 255;
    const oa = a + da * (1 - a);
    buf[i] = Math.round((b * a + buf[i] * da * (1 - a)) / oa);
    buf[i + 1] = Math.round((g * a + buf[i + 1] * da * (1 - a)) / oa);
    buf[i + 2] = Math.round((rr * a + buf[i + 2] * da * (1 - a)) / oa);
    buf[i + 3] = Math.round(oa * 255);
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      const i = (y * size + x) * 4;
      over(i, 0x05, 0x0A, 0x16, clamp(r + 0.5 - d));
      over(i, 0xEF, 0x44, 0x44, clamp(ri + 0.5 - d));
    }
  }
}

function buildTrayImage(unread) {
  const base = nativeImage.createFromPath(path.join(__dirname, '..', 'assets', 'icon.png'));
  const make = (size) => {
    const img = base.resize({ width: size, height: size, quality: 'best' });
    if (!unread) return img;
    const buf = Buffer.from(img.toBitmap());
    paintDot(buf, size);
    return nativeImage.createFromBitmap(buf, { width: size, height: size });
  };
  const img = make(16);
  img.addRepresentation({ scaleFactor: 2, width: 32, height: 32, buffer: make(32).toPNG() });
  return img;
}

function trayImage(unread) {
  const key = unread ? 'unread' : 'base';
  if (!trayImages[key]) trayImages[key] = buildTrayImage(unread);
  return trayImages[key];
}

function showWindow() {
  if (!win || win.isDestroyed()) {
    createWindow();
    return;
  }
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function createTray() {
  tray = new Tray(trayImage(false));
  trayHasUnread = false;
  tray.on('click', showWindow);
  tray.on('double-click', showWindow);
  updateTray();
}

function updateTray() {
  if (!tray || tray.isDestroyed()) return;
  try {
    const lang = effectiveLang();
    const total = totalCount();
    const unread = total > 0;
    if (unread !== trayHasUnread) {
      tray.setImage(trayImage(unread));
      trayHasUnread = unread;
    }
    tray.setToolTip(unread ? 'Social Hub — ' + mt(lang, 'unread', { n: total }) : 'Social Hub');
    if (lang !== trayLang) {
      trayLang = lang;
      tray.setContextMenu(Menu.buildFromTemplate([
        { label: mt(lang, 'tray.open'), click: showWindow },
        { type: 'separator' },
        { label: mt(lang, 'tray.quit'), click: () => { quitting = true; app.quit(); } }
      ]));
    }
  } catch (e) {
    console.error('tray error:', e);
  }
}

function maybeShowTrayHint() {
  if (trayHintShown || !tray || tray.isDestroyed()) return;
  trayHintShown = true;
  try {
    tray.displayBalloon({ iconType: 'info', title: 'Social Hub', content: mt(effectiveLang(), 'tray.hint') });
  } catch { /* Windows only */ }
}

// ---------- sessions ----------
const configured = new Set();

function configureSession(account) {
  const partition = partitionOf(account.id);
  const ses = session.fromPartition(partition);
  if (configured.has(partition)) return ses;
  configured.add(partition);

  ses.setUserAgent(USER_AGENT);
  const allowMedia = SERVICES[account.service].media;

  // Only notifications (all services) and media (whatsapp/facebook/instagram) are allowed.
  const allowed = (permission) => {
    if (permission === 'notifications') return true;
    if (permission === 'media') return allowMedia;
    return false;
  };
  ses.setPermissionRequestHandler((_wc, permission, callback) => callback(allowed(permission)));
  ses.setPermissionCheckHandler((_wc, permission) => allowed(permission));
  return ses;
}

// ---------- account views ----------
function layoutViews() {
  if (!win || win.isDestroyed()) return;
  const [w, h] = win.getContentSize();
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  for (const view of views.values()) {
    view.setBounds({
      x: sidebarWidth,
      y: TITLEBAR_HEIGHT,
      width: Math.max(0, w - sidebarWidth),
      height: Math.max(0, h - TITLEBAR_HEIGHT)
    });
  }
}

function createView(account) {
  configureSession(account);
  const view = new WebContentsView({
    webPreferences: {
      partition: partitionOf(account.id),
      preload: path.join(__dirname, '..', 'preload', 'service-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  const wc = view.webContents;
  wc.setUserAgent(USER_AGENT);
  applyServiceTheme(view, account.service, SERVICES[account.service].url);

  wc.setWindowOpenHandler(({ url }) => {
    if (isSameService(account.service, url)) {
      wc.loadURL(url).catch(() => {});
    } else {
      openExternalSafe(url);
    }
    return { action: 'deny' };
  });

  wcToAcc.set(wc.id, account.id);
  wc.on('page-title-updated', (_e, title) => setTitleCount(account.id, parseTitleCount(title)));

  win.contentView.addChildView(view);
  views.set(account.id, view);
  layoutViews();
  wc.loadURL(SERVICES[account.service].url, { userAgent: USER_AGENT }).catch(() => {});
  return view;
}

function showActive() {
  for (const [id, view] of views) {
    view.setVisible(!overlayOpen && !pageOpen && id === store.activeId);
  }
}

function selectAccount(id) {
  const account = store.get(id);
  if (!account) return;
  pageOpen = false;
  store.setActive(id);
  markViewed(id);
  if (!views.has(id)) createView(account);
  showActive();
  if (!overlayOpen && !pageOpen) views.get(id).webContents.focus();
}

async function deleteAccount(id) {
  const view = views.get(id);
  if (view) {
    wcToAcc.delete(view.webContents.id);
    win.contentView.removeChildView(view);
    view.webContents.close();
    views.delete(id);
  }
  const partition = partitionOf(id);
  const ses = session.fromPartition(partition);
  try {
    await ses.clearStorageData();
    await ses.clearCache();
  } catch (e) {
    console.error('clearStorageData failed:', e);
  }
  configured.delete(partition);
  delete titleCounts[id];
  delete notifCounts[id];
  delete lastSound[id];
  store.remove(id);
  if (pageOpen) {
    // Inicio/Ajustes open: stay on it (views stay hidden via showActive below)
  } else if (store.activeId) selectAccount(store.activeId);
  else pageOpen = true; // no accounts left: show Inicio
  showActive();
  pushState();
}

// ---------- IPC ----------
function validId(p) {
  return p && typeof p === 'object' && store.has(p.id) ? p.id : null;
}

// Empty/missing label -> default "<Service>", "<Service> 2", ... (lowest free number among that service's labels).
// A non-empty label must pass cleanLabel (trim, max length) or the call throws.
function resolveLabel(service, raw, excludeId) {
  if (raw !== undefined && raw !== null && typeof raw !== 'string') throw new Error('Nombre no válido');
  if (typeof raw === 'string' && raw.trim()) {
    const label = cleanLabel(raw);
    if (!label) throw new Error('Nombre no válido');
    return label;
  }
  const base = SERVICES[service].name;
  const used = new Set(store.accounts.filter((a) => a.service === service && a.id !== excludeId).map((a) => a.label));
  if (!used.has(base)) return base;
  for (let n = 2; ; n++) {
    if (!used.has(`${base} ${n}`)) return `${base} ${n}`;
  }
}

function registerIpc() {
  ipcMain.handle('services:list', () =>
    Object.entries(SERVICES).map(([id, s]) => ({ id, name: s.name, color: s.color, letter: s.letter }))
  );
  ipcMain.handle('accounts:list', () => publicState());

  ipcMain.handle('accounts:add', (_e, p) => {
    if (!p || typeof p !== 'object' || !isValidService(p.service)) throw new Error('Servicio no válido');
    const label = resolveLabel(p.service, p.label);
    const acc = store.add(p.service, label);
    selectAccount(acc.id);
    return publicState();
  });

  ipcMain.handle('accounts:select', (_e, p) => {
    const id = validId(p);
    if (!id) throw new Error('Cuenta no válida');
    selectAccount(id);
    return publicState();
  });

  ipcMain.handle('accounts:rename', (_e, p) => {
    const id = validId(p);
    if (!id) throw new Error('Datos no válidos');
    const label = resolveLabel(store.get(id).service, p.label, id);
    store.rename(id, label);
    return publicState();
  });

  ipcMain.handle('accounts:reload', (_e, p) => {
    const id = validId(p);
    if (!id) throw new Error('Cuenta no válida');
    const view = views.get(id);
    if (view) view.webContents.reload();
    else selectAccount(id);
    return true;
  });

  ipcMain.handle('accounts:delete', async (_e, p) => {
    const id = validId(p);
    if (!id) throw new Error('Cuenta no válida');
    // Confirmation is shown by the in-app UI before this call.
    await deleteAccount(id);
    return publicState();
  });

  ipcMain.handle('accounts:reorder', (_e, p) => {
    const ids = p && p.ids;
    if (!Array.isArray(ids) || ids.length !== store.accounts.length || !ids.every((i) => typeof i === 'string')) {
      throw new Error('Datos no válidos');
    }
    const set = new Set(ids);
    if (set.size !== ids.length || !ids.every((i) => store.has(i))) throw new Error('Datos no válidos');
    store.reorder(ids);
    pushState();
    return publicState();
  });

  ipcMain.handle('accounts:mute', (_e, p) => {
    const id = validId(p);
    if (!id || typeof p.muted !== 'boolean') throw new Error('Datos no válidos');
    store.setMuted(id, p.muted);
    pushState();
    return publicState();
  });

  ipcMain.handle('app:info', () => ({ version: app.getVersion() }));

  // Fixed URL: the renderer never chooses what gets opened.
  const PROFILE_URL = 'https://me.ricardoalvarez.co';
  ipcMain.handle('about:profile', () => { shell.openExternal(PROFILE_URL); return true; });

  ipcMain.handle('settings:lang', (_e, p) => {
    if (!p || typeof p !== 'object' || !['es', 'en'].includes(p.lang)) throw new Error('Datos no válidos');
    store.setLang(p.lang);
    pushState();
    return publicState();
  });

  ipcMain.handle('settings:mute', (_e, p) => {
    if (!p || typeof p !== 'object' || typeof p.muted !== 'boolean') throw new Error('Datos no válidos');
    store.setMutedAll(p.muted);
    pushState();
    return publicState();
  });

  // Send-only channel from service preloads. The account is derived from the sender, never from the payload.
  ipcMain.on('svc:notification', (event) => {
    const id = wcToAcc.get(event.sender.id);
    if (id && store.has(id)) onPageNotification(id);
  });

  ipcMain.on('svc:notification-click', (event) => {
    const id = wcToAcc.get(event.sender.id);
    if (!id || !store.has(id)) return;
    showWindow();
    selectAccount(id);
  });

  // The UI hides all account views while the Inicio / Ajustes pages are shown.
  ipcMain.handle('ui:page', (_e, p) => {
    if (!p || typeof p !== 'object' || typeof p.open !== 'boolean') throw new Error('Datos no válidos');
    pageOpen = p.open;
    if (!pageOpen && store.activeId) {
      if (!views.has(store.activeId)) createView(store.get(store.activeId));
      showActive();
      if (!overlayOpen) views.get(store.activeId).webContents.focus();
    } else {
      showActive();
    }
    pushState();
    return publicState();
  });

  // The UI hides the active view while a modal form is open.
  ipcMain.handle('ui:overlay', (_e, p) => {
    overlayOpen = !!(p && p.open === true);
    showActive();
    return true;
  });

  ipcMain.handle('ui:sidebar', (_e, p) => {
    if (!p || typeof p !== 'object' || typeof p.collapsed !== 'boolean') throw new Error('Datos no válidos');
    sidebarCollapsed = p.collapsed;
    layoutViews();
    return true;
  });
}

// ---------- window ----------
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 500,
    backgroundColor: '#050A16',
    title: 'Social Hub',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#050A16', symbolColor: '#C9D6F2', height: TITLEBAR_HEIGHT },
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'ui-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false // keep the UI renderer alive while hidden so the chime plays
    }
  });
  win.setMenuBarVisibility(false);

  const indexFile = path.join(__dirname, '..', 'renderer', 'index.html');
  const indexUrl = pathToFileURL(indexFile).href;
  win.webContents.on('will-navigate', (e, url) => {
    if (url !== indexUrl) e.preventDefault();
  });
  win.webContents.setWindowOpenHandler(({ url, frameName }) => {
    if (frameName === 'account-menu' && url === 'about:blank') {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          parent: win, frame: false, transparent: true, resizable: false,
          skipTaskbar: true, minimizable: false, maximizable: false,
          webPreferences: { sandbox: true, nodeIntegration: false, contextIsolation: true }
        }
      };
    }
    openExternalSafe(url);
    return { action: 'deny' };
  });

  win.webContents.on('did-create-window', (popup, details) => {
    if (details.frameName !== 'account-menu') return;
    popup.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    popup.webContents.on('will-navigate', event => event.preventDefault());
    popup.once('blur', () => popup.close());
  });

  win.on('page-title-updated', (e) => e.preventDefault()); // keep "Social Hub (N)" title
  win.on('focus', () => {
    win.flashFrame(false);
    if (store.activeId) markViewed(store.activeId);
  });
  win.on('resize', layoutViews);
  win.on('maximize', layoutViews);
  win.on('unmaximize', layoutViews);
  win.on('enter-full-screen', layoutViews);
  win.on('leave-full-screen', layoutViews);
  win.on('close', (e) => {
    if (!quitting) {
      e.preventDefault();
      win.hide();
      maybeShowTrayHint();
    }
  });
  win.on('closed', () => {
    win = null;
    views.clear();
  });

  win.loadFile(indexFile);
  win.webContents.once('did-finish-load', () => {
    pageOpen = true; // always start on Inicio
    // preload all accounts hidden so their badges keep updating: active first, rest staggered
    const queue = [];
    if (store.activeId) queue.push(store.activeId);
    for (const a of store.accounts) if (!queue.includes(a.id)) queue.push(a.id);
    const next = () => {
      if (!win || win.isDestroyed()) return;
      const id = queue.shift();
      if (id === undefined) return;
      const account = store.get(id);
      if (account && !views.has(id)) {
        createView(account);
        showActive();
      }
      if (queue.length) setTimeout(next, 1200);
    };
    next();
    showActive();
    pushState();
  });
}

app.whenReady().then(() => {
  if (!gotLock) return;
  systemLang = (app.getPreferredSystemLanguages()[0] || app.getLocale() || '').toLowerCase().startsWith('es') ? 'es' : 'en';
  nativeTheme.themeSource = 'dark';
  store = new AccountStore();
  registerIpc();
  createWindow();
  createTray();
  app.on('second-instance', showWindow);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => app.quit());
