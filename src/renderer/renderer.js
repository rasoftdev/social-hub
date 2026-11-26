'use strict';

const $ = (id) => document.getElementById(id);
const listEl = $('accounts');
const modal = $('modal');
const labelInput = $('label-input');
const errorEl = $('modal-error');

let services = [];
let state = { accounts: [], activeId: null, badges: {}, mutedAll: false, pageOpen: false, lang: 'es' };
let currentPage = 'home'; // 'home' | 'settings' | 'about' (only visible while state.pageOpen)
let expandedService = null; // service id whose accounts are listed on Inicio
let popoverService = null; // service id whose "⋯" popover is open
let modalMode = null; // { type: 'add' } | { type: 'rename', id }
let selectedService = null;
let sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';

function applySidebarState(notifyMain = true) {
  const sidebar = $('sidebar');
  const toggle = $('sidebar-toggle');
  document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  sidebar.classList.toggle('collapsed', sidebarCollapsed);
  toggle.setAttribute('aria-expanded', String(!sidebarCollapsed));
  const label = t(sidebarCollapsed ? 'sidebar.expand' : 'sidebar.collapse');
  toggle.title = label;
  toggle.setAttribute('aria-label', label);

  if (notifyMain) window.hub.setSidebarCollapsed(sidebarCollapsed).catch(() => {});
}

function iconEl(service, size) {
  const d = document.createElement('div');
  d.className = 'icon' + (size ? ' ' + size : '');
  d.append(window.ServiceIcons.create(service ? service.id : '', '100%'));
  return d;
}

function serviceOf(acc) {
  return services.find((s) => s.id === acc.service);
}

// Lucide icon font glyph (volume-2 = sound on, volume-x = muted).
function iconGlyph(name) {
  const i = document.createElement('i');
  i.className = 'icon-' + name;
  i.setAttribute('aria-hidden', 'true');
  return i;
}
function speakerIcon(muted) {
  return iconGlyph(muted ? 'volume-x' : 'volume-2');
}

function badgeEl(n) {
  const b = document.createElement('span');
  b.className = 'badge';
  b.textContent = n > 99 ? '99+' : String(n);
  return b;
}

function accountsOf(serviceId) {
  return state.accounts.filter((a) => a.service === serviceId);
}

function unreadOf(serviceId) {
  return accountsOf(serviceId).reduce((sum, a) => sum + (state.badges[a.id] || 0), 0);
}

// ---------- sidebar ----------
let dragId = null;
let justDragged = false;

function isAfter(e, el) {
  const r = el.getBoundingClientRect();
  return e.clientY > r.top + r.height / 2;
}

function clearDropMarks() {
  for (const el of listEl.querySelectorAll('.drop-before, .drop-after')) el.classList.remove('drop-before', 'drop-after');
}

function endDrag() {
  dragId = null;
  clearDropMarks();
  for (const el of listEl.querySelectorAll('.dragging')) el.classList.remove('dragging');
  justDragged = true;
  setTimeout(() => { justDragged = false; }, 0);
}

async function dropOn(targetId, after) {
  const ids = state.accounts.map((a) => a.id).filter((id) => id !== dragId);
  const at = ids.indexOf(targetId) + (after ? 1 : 0);
  ids.splice(at, 0, dragId);
  if (ids.every((id, i) => id === state.accounts[i].id)) return;
  const byId = new Map(state.accounts.map((a) => [a.id, a]));
  setState({ ...state, accounts: ids.map((id) => byId.get(id)) }); // optimistic
  try {
    setState(await window.hub.reorderAccounts(ids));
  } catch {
    setState(await window.hub.getState());
  }
}
function renderSidebar() {
  listEl.textContent = '';
  for (const acc of state.accounts) {
    const svc = serviceOf(acc);
    const li = document.createElement('li');
    li.className = 'acc' + (!state.pageOpen && acc.id === state.activeId ? ' active' : '');
    li.title = acc.label;

    const info = document.createElement('div');
    info.className = 'info';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = acc.label;
    const sub = document.createElement('div');
    sub.className = 'svc';
    sub.textContent = svc ? svc.name : acc.service;
    if (acc.muted) {
      const flag = document.createElement('span');
      flag.className = 'mute-flag';
      flag.title = t('acc.muted');
      flag.append(speakerIcon(true));
      sub.append(flag);
    }
    info.append(name, sub);

    const icon = iconEl(svc);
    const n = state.badges[acc.id] || 0;
    if (n > 0) icon.append(badgeEl(n));
    li.append(icon, info);

    const more = document.createElement('button');
    more.className = 'more';
    more.title = t('acc.options');
    more.append(iconGlyph('ellipsis'));
    more.addEventListener('click', (e) => { e.stopPropagation(); toggleCtxMenu(acc.id, { button: more }); });
    li.append(more);

    li.draggable = true;
    const grip = document.createElement('span');
    grip.className = 'grip';
    grip.append(iconGlyph('grip-vertical'));
    li.prepend(grip);
    li.dataset.id = acc.id;
    li.addEventListener('dragstart', (e) => {
      dragId = acc.id;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', acc.id);
      li.classList.add('dragging');
    });
    li.addEventListener('dragover', (e) => {
      if (!dragId || dragId === acc.id) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      clearDropMarks();
      li.classList.add(isAfter(e, li) ? 'drop-after' : 'drop-before');
    });
    li.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragId && dragId !== acc.id) dropOn(acc.id, isAfter(e, li));
      endDrag();
    });
    li.addEventListener('dragend', endDrag);
    li.addEventListener('click', () => { if (!justDragged) select(acc.id); });
    li.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); openCtxMenu(acc.id, { x: e.clientX, y: e.clientY }); });
    listEl.append(li);
  }
  const ma = $('mute-all');
  const label = state.mutedAll ? t('mute.unmute') : t('mute.mute');
  ma.textContent = '';
  ma.append(speakerIcon(!!state.mutedAll));
  ma.title = label;
  ma.setAttribute('aria-label', label);
  ma.classList.toggle('off', !!state.mutedAll);
  for (const btn of document.querySelectorAll('.nav-item')) {
    btn.classList.toggle('active', state.pageOpen && btn.dataset.page === currentPage);
  }
}

// ---------- account context menu ----------
let ctxMenuEl = null;
let ctxAccId = null;
let ctxPopup = null;

function closeCtxMenu(restoreFocus) {
  if (!ctxMenuEl) return;
  const id = ctxAccId;
  ctxMenuEl.remove();
  const popup = ctxPopup;
  ctxPopup = null;
  if (popup && !popup.closed) popup.close();
  ctxMenuEl = null;
  ctxAccId = null;
  if (restoreFocus) {
    const li = Array.from(listEl.children).find((el) => el.dataset.id === id);
    const btn = li && li.querySelector('.more');
    if (btn) btn.focus();
  }
}

function toggleCtxMenu(id, pos) {
  if (ctxMenuEl && ctxAccId === id) closeCtxMenu(true);
  else openCtxMenu(id, pos);
}

async function moveAccount(id, delta) {
  const ids = state.accounts.map((a) => a.id);
  const i = ids.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  try {
    setState(await window.hub.reorderAccounts(ids));
  } catch {
    setState(await window.hub.getState());
  }
}

function openCtxMenu(id, pos) {
  closeCtxMenu(false);
  const idx = state.accounts.findIndex((a) => a.id === id);
  if (idx < 0) return;
  const acc = state.accounts[idx];
  const last = state.accounts.length - 1;
  const items = [
    { label: t('ctx.rename'), icon: 'pencil', run: () => { closeCtxMenu(false); openModal({ type: 'rename', id }); } },
    { label: t('ctx.reload'), icon: 'rotate-cw', run: () => { closeCtxMenu(true); window.hub.reloadAccount(id).catch(() => {}); } },
    {
      label: acc.muted ? t('ctx.unmute') : t('ctx.mute'),
      icon: acc.muted ? 'volume-2' : 'volume-x',
      run: async () => {
        const cur = state.accounts.find((a) => a.id === id);
        closeCtxMenu(true);
        if (!cur) return;
        try { setState(await window.hub.setAccountMuted(id, !cur.muted)); } catch { /* ignore */ }
      }
    },
    'sep',
    { label: t('ctx.up'), icon: 'arrow-up', disabled: idx === 0, run: () => { closeCtxMenu(true); moveAccount(id, -1); } },
    { label: t('ctx.down'), icon: 'arrow-down', disabled: idx === last, run: () => { closeCtxMenu(true); moveAccount(id, 1); } },
    'sep',
    { label: t('ctx.delete'), icon: 'trash-2', danger: true, run: () => { closeCtxMenu(false); requestDelete(id); } }
  ];

  const menu = document.createElement('div');
  menu.className = 'ctx-menu';
  menu.setAttribute('role', 'menu');
  for (const it of items) {
    if (it === 'sep') {
      const sep = document.createElement('div');
      sep.className = 'ctx-sep';
      sep.setAttribute('role', 'separator');
      menu.append(sep);
      continue;
    }
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ctx-item' + (it.danger ? ' danger' : '');
    b.setAttribute('role', 'menuitem');
    if (it.disabled) b.setAttribute('aria-disabled', 'true');
    const label = document.createElement('span');
    label.textContent = it.label;
    b.append(iconGlyph(it.icon), label);
    if (!it.disabled) b.addEventListener('pointermove', () => b.focus({ preventScroll: true }));
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!it.disabled) it.run();
    });
    menu.append(b);
  }
  document.body.append(menu);
  ctxMenuEl = menu;
  ctxAccId = id;

  const W = menu.offsetWidth;
  const H = menu.offsetHeight;
  const minX = 8;
  const popupNeeded = sidebarCollapsed && !state.pageOpen && state.activeId;
  const rightEdge = sidebarCollapsed ? window.innerWidth : $('sidebar').offsetWidth;
  const maxX = Math.max(minX, rightEdge - 8 - W);
  let left;
  let top;
  if (pos.button) {
    const r = pos.button.getBoundingClientRect();
    left = r.right - W;
    top = r.bottom + 4;
    if (top + H > window.innerHeight - 8) top = r.top - H - 4;
  } else {
    left = pos.x;
    top = pos.y;
  }
  left = Math.min(Math.max(left, minX), maxX);
  top = Math.min(Math.max(top, 8), Math.max(8, window.innerHeight - H - 8));
  if (popupNeeded) {
    // Native service views sit above the shell DOM. Host the same menu in a child window.
    const x = Math.round(window.screenX + left);
    const y = Math.round(window.screenY + top);
    const popup = window.open('about:blank', 'account-menu', `left=${x},top=${y},width=${W},height=${H}`);
    if (!popup) { closeCtxMenu(false); return; }
    ctxPopup = popup;
    const doc = popup.document;
    doc.documentElement.lang = document.documentElement.lang;
    for (const sheet of document.querySelectorAll('link[rel="stylesheet"]')) {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = sheet.href;
      doc.head.append(link);
    }
    doc.body.className = 'account-menu-popup';
    doc.body.append(menu);
    doc.addEventListener('keydown', handleCtxKey);
    popup.addEventListener('pagehide', () => {
      if (ctxPopup === popup) { ctxPopup = null; closeCtxMenu(false); }
    }, { once: true });
    left = 0;
    top = 0;
  }
  menu.style.left = left + 'px';
  menu.style.top = top + 'px';

  const first = menu.querySelector('.ctx-item:not([aria-disabled="true"])');
  if (first) first.focus();
}

document.addEventListener('mousedown', (e) => {
  if (!ctxMenuEl || ctxMenuEl.contains(e.target)) return;
  const moreBtn = e.target.closest && e.target.closest('.more');
  const row = moreBtn && moreBtn.closest('.acc');
  if (row && row.dataset.id === ctxAccId) return; // let the click toggle it closed
  closeCtxMenu(false);
});
function handleCtxKey(e) {
  if (!ctxMenuEl) return;
  const focused = ctxMenuEl.ownerDocument.activeElement;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeCtxMenu(true);
  } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const list = Array.from(ctxMenuEl.querySelectorAll('.ctx-item:not([aria-disabled="true"])'));
    if (!list.length) return;
    const cur = list.indexOf(focused);
    const step = e.key === 'ArrowDown' ? 1 : -1;
    list[(cur + step + list.length) % list.length].focus();
  } else if (e.key === 'Enter' && ctxMenuEl.contains(focused)) {
    e.preventDefault();
    focused.click();
  }
}
document.addEventListener('keydown', handleCtxKey);
window.addEventListener('blur', () => { if (!ctxPopup) closeCtxMenu(false); });
window.addEventListener('resize', () => closeCtxMenu(false));
listEl.addEventListener('scroll', () => closeCtxMenu(false));
$('sidebar').addEventListener('scroll', () => closeCtxMenu(false));

// ---------- Inicio ----------
function accountRow(acc) {
  const svc = serviceOf(acc);
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'card acc-row';
  const info = document.createElement('div');
  info.className = 'info';
  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = acc.label;
  const sub = document.createElement('div');
  sub.className = 'svc';
  sub.textContent = (svc ? svc.name : acc.service) + (acc.muted ? t('acc.mutedSuffix') : '');
  info.append(name, sub);
  row.append(iconEl(svc, 'lg'), info);
  const n = state.badges[acc.id] || 0;
  if (n > 0) row.append(badgeEl(n));
  row.addEventListener('click', () => select(acc.id));
  return row;
}

function onServiceCard(s) {
  const n = accountsOf(s.id).length;
  popoverService = null;
  if (n === 0) {
    expandedService = null;
    openModal({ type: 'add' }, s.id);
  } else if (n === 1) {
    select(accountsOf(s.id)[0].id);
  } else {
    expandedService = expandedService === s.id ? null : s.id;
    renderHome();
  }
}

function buildPopover(s) {
  const pop = document.createElement('div');
  pop.className = 'popover';
  pop.addEventListener('click', (e) => e.stopPropagation());
  const accs = accountsOf(s.id);
  if (!accs.length) {
    const empty = document.createElement('div');
    empty.className = 'pop-empty';
    empty.textContent = t('count.none');
    pop.append(empty);
  }
  for (const acc of accs) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'pop-item';
    const label = document.createElement('span');
    label.textContent = acc.label;
    item.append(label);
    const n = state.badges[acc.id] || 0;
    if (n > 0) item.append(badgeEl(n));
    item.addEventListener('click', () => { popoverService = null; select(acc.id); });
    pop.append(item);
  }
  return pop;
}

function renderHome() {
  const grid = $('service-grid');
  grid.textContent = '';
  for (const s of services) {
    const n = accountsOf(s.id).length;
    const card = document.createElement('div');
    card.className = 'card svc-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    const name = document.createElement('div');
    name.className = 'svc-name';
    name.textContent = s.name;
    const count = document.createElement('div');
    count.className = 'svc-count';
    const dot = document.createElement('span');
    dot.className = 'dot' + (n === 0 ? ' off' : '');
    const txt = document.createElement('span');
    txt.textContent = countText(n);
    count.append(dot, txt);
    card.append(iconEl(s, 'xl'), name, count);

    const unread = unreadOf(s.id);
    if (unread > 0) card.append(badgeEl(unread));

    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'card-more';
    more.title = t('accounts.title');
    more.append(iconGlyph('ellipsis'));
    more.addEventListener('click', (e) => {
      e.stopPropagation();
      popoverService = popoverService === s.id ? null : s.id;
      renderHome();
    });
    card.append(more);
    if (popoverService === s.id) card.append(buildPopover(s));

    card.addEventListener('click', () => onServiceCard(s));
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === card) { e.preventDefault(); onServiceCard(s); }
    });
    grid.append(card);
  }

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'card svc-card add-card';
  const plus = document.createElement('span');
  plus.className = 'add-plus';
  plus.append(iconGlyph('plus'));
  const addTxt = document.createElement('span');
  addTxt.textContent = t('accounts.add');
  add.append(plus, addTxt);
  add.addEventListener('click', () => { popoverService = null; openModal({ type: 'add' }); });
  grid.append(add);

  const detail = $('service-detail');
  detail.textContent = '';
  const svc = services.find((s) => s.id === expandedService);
  const accs = svc ? accountsOf(svc.id) : [];
  if (accs.length > 1) {
    const h = document.createElement('h2');
    h.textContent = svc.name;
    const wrap = document.createElement('div');
    wrap.className = 'detail-list';
    for (const acc of accs) wrap.append(accountRow(acc));
    detail.append(h, wrap);
    detail.classList.remove('hidden');
  } else {
    expandedService = null;
    detail.classList.add('hidden');
  }
}

// ---------- Ajustes ----------
function switchEl(checked, onChange) {
  const label = document.createElement('label');
  label.className = 'switch';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;
  input.addEventListener('change', () => onChange(input.checked));
  const slider = document.createElement('span');
  slider.className = 'slider';
  label.append(input, slider);
  return label;
}

function renderSettings() {
  // Switch ON = sound enabled.
  $('mute-all-switch').checked = !state.mutedAll;
  document.querySelectorAll('#lang-seg .seg-btn').forEach((btn) => {
    const on = btn.dataset.lang === LANG;
    btn.setAttribute('aria-checked', String(on));
    btn.tabIndex = on ? 0 : -1;
  });

  const box = $('settings-accounts');
  box.textContent = '';
  if (!state.accounts.length) {
    const empty = document.createElement('div');
    empty.className = 'row row-sub';
    empty.textContent = t('count.none');
    box.append(empty);
  }
  for (const acc of state.accounts) {
    const svc = serviceOf(acc);
    const row = document.createElement('div');
    row.className = 'row';
    const left = document.createElement('div');
    left.className = 'row-left';
    const info = document.createElement('div');
    info.className = 'info';
    const name = document.createElement('div');
    name.className = 'row-title';
    name.textContent = acc.label;
    const sub = document.createElement('div');
    sub.className = 'row-sub';
    sub.textContent = svc ? svc.name : acc.service;
    info.append(name, sub);
    left.append(iconEl(svc), info);
    row.append(left, switchEl(!acc.muted, async (on) => setState(await window.hub.setAccountMuted(acc.id, !on))));
    box.append(row);
  }
}

// ---------- pages ----------
function renderPages() {
  const open = !!state.pageOpen;
  $('page-home').classList.toggle('hidden', !(open && currentPage === 'home'));
  $('page-settings').classList.toggle('hidden', !(open && currentPage === 'settings'));
  $('page-about').classList.toggle('hidden', !(open && currentPage === 'about'));
  $('content').classList.toggle('hidden', !open);
  if (open && currentPage === 'home') renderHome();
  if (open && currentPage === 'settings') renderSettings();
}

function render() {
  renderSidebar();
  renderPages();
}

function setState(s) {
  if (s) {
    state = s;
    if (state.lang && state.lang !== LANG) {
      setLang(state.lang);
      applyStaticI18n();
      applySidebarState(false);
    }
  }
  render();
}

async function select(id) {
  popoverService = null;
  setState(await window.hub.selectAccount(id));
}

async function showPage(page) {
  currentPage = page;
  popoverService = null;
  setState(await window.hub.setPage(true));
}

for (const btn of document.querySelectorAll('.nav-item')) {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
}
document.addEventListener('click', () => {
  if (popoverService) { popoverService = null; renderHome(); }
});

// ---------- modal ----------
function buildPicker() {
  const picker = $('service-picker');
  picker.textContent = '';
  for (const s of services) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opt' + (s.id === selectedService ? ' sel' : '');
    b.append(iconEl(s, 'lg'), document.createTextNode(s.name));
    b.addEventListener('click', () => { selectedService = s.id; buildPicker(); });
    picker.append(b);
  }
}

function openModal(mode, preselect) {
  modalMode = mode;
  errorEl.textContent = '';
  const isAdd = mode.type === 'add';
  $('modal-title').textContent = isAdd ? t('accounts.add') : t('accounts.rename');
  $('service-field').style.display = isAdd ? 'block' : 'none';
  if (isAdd) {
    selectedService = preselect || (services[0] && services[0].id);
    buildPicker();
    labelInput.value = '';
  } else {
    const acc = state.accounts.find((a) => a.id === mode.id);
    labelInput.value = acc ? acc.label : '';
  }
  modal.classList.remove('hidden');
  window.hub.setOverlay(true);
  labelInput.focus();
  labelInput.select();
}

function closeModal() {
  modal.classList.add('hidden');
  modalMode = null;
  window.hub.setOverlay(false);
}

$('add-btn').addEventListener('click', () => openModal({ type: 'add' }));
$('cancel-btn').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalMode) closeModal(); });

$('modal-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const label = labelInput.value.trim();
  if (label.length > 50) { errorEl.textContent = t('err.nameLength'); return; }
  try {
    if (modalMode.type === 'add') {
      if (!selectedService) { errorEl.textContent = t('err.chooseService'); return; }
      const s = await window.hub.addAccount(selectedService, label);
      closeModal();
      setState(s);
    } else {
      const s = await window.hub.renameAccount(modalMode.id, label);
      closeModal();
      setState(s);
    }
  } catch (err) {
    errorEl.textContent = t('err.save');
  }
});

const chime = new Audio('notify.wav');
window.hub.onState((s) => setState(s));
window.hub.onPlaySound(() => { chime.currentTime = 0; chime.play().catch(() => {}); });
$('mute-all').addEventListener('click', async () => setState(await window.hub.setMuteAll(!state.mutedAll)));
$('mute-all-switch').addEventListener('change', async (e) => setState(await window.hub.setMuteAll(!e.target.checked)));
async function pickLang(btn) {
  if (btn.dataset.lang !== LANG) setState(await window.hub.setLang(btn.dataset.lang));
}
document.querySelectorAll('#lang-seg .seg-btn').forEach((btn) => {
  btn.addEventListener('click', () => pickLang(btn));
});
$('lang-seg').addEventListener('keydown', async (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  e.preventDefault();
  const btns = Array.from(document.querySelectorAll('#lang-seg .seg-btn'));
  const i = btns.findIndex((b) => b.dataset.lang === LANG);
  const next = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
  next.focus();
  await pickLang(next);
});

function confirmDelete(acc) {
  return new Promise((resolve) => {
    const box = $('confirm');
    $('confirm-msg').textContent = t('confirm.delete', { name: acc.label });
    const done = (v) => {
      box.classList.add('hidden');
      window.hub.setOverlay(false);
      $('confirm-ok').onclick = $('confirm-cancel').onclick = null;
      resolve(v);
    };
    $('confirm-ok').onclick = () => done(true);
    $('confirm-cancel').onclick = () => done(false);
    box.classList.remove('hidden');
    window.hub.setOverlay(true);
    $('confirm-cancel').focus();
  });
}

async function requestDelete(id) {
  const acc = state.accounts.find((a) => a.id === id);
  if (acc && (await confirmDelete(acc))) setState(await window.hub.deleteAccount(id));
}

$('about-year').textContent = String(new Date().getFullYear());
$('about-profile').addEventListener('click', () => { window.hub.openProfile(); });
$('sidebar-toggle').addEventListener('click', () => {
  sidebarCollapsed = !sidebarCollapsed;
  localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed));
  applySidebarState();
});
applySidebarState();

(async () => {
  services = await window.hub.getServices();
  setState(await window.hub.getState());
  try {
    $('app-version').textContent = (await window.hub.getAppInfo()).version;
  } catch {
    // version is informational only
  }
})();
