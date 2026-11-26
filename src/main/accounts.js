'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { app } = require('electron');
const { isValidService } = require('./services');

const MAX_LABEL = 50;

function cleanLabel(label) {
  if (typeof label !== 'string') return null;
  const l = label.trim();
  if (!l || l.length > MAX_LABEL) return null;
  return l;
}

class AccountStore {
  constructor() {
    this.file = path.join(app.getPath('userData'), 'accounts.json');
    this.accounts = [];
    this.activeId = null;
    this.mutedAll = false;
    this.lang = null;
    this.load();
  }

  load() {
    try {
      const data = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      if (Array.isArray(data.accounts)) {
        this.accounts = data.accounts
          .filter((a) => a && typeof a.id === 'string' && isValidService(a.service) && cleanLabel(a.label))
          .map((a) => ({ id: a.id, service: a.service, label: cleanLabel(a.label), muted: a.muted === true }));
      }
      this.mutedAll = data.mutedAll === true;
      this.lang = data.lang === 'es' || data.lang === 'en' ? data.lang : null;
      if (this.has(data.activeId)) this.activeId = data.activeId;
    } catch {
      // first run or corrupt file: start empty
    }
  }

  save() {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFileSync(this.file, JSON.stringify({ accounts: this.accounts, activeId: this.activeId, mutedAll: this.mutedAll, lang: this.lang }, null, 2));
    } catch (e) {
      console.error('Could not save accounts:', e);
    }
  }

  has(id) {
    return typeof id === 'string' && this.accounts.some((a) => a.id === id);
  }

  get(id) {
    return this.accounts.find((a) => a.id === id);
  }

  add(service, label) {
    const acc = { id: crypto.randomUUID(), service, label, muted: false };
    this.accounts.push(acc);
    this.save();
    return acc;
  }

  rename(id, label) {
    const a = this.get(id);
    if (a) { a.label = label; this.save(); }
  }

  setMuted(id, muted) {
    const a = this.get(id);
    if (a) { a.muted = muted === true; this.save(); }
  }

  setMutedAll(muted) {
    this.mutedAll = muted === true;
    this.save();
  }

  setLang(lang) {
    this.lang = lang === 'es' || lang === 'en' ? lang : null;
    this.save();
  }

  remove(id) {
    this.accounts = this.accounts.filter((a) => a.id !== id);
    if (this.activeId === id) this.activeId = this.accounts.length ? this.accounts[0].id : null;
    this.save();
  }

  // ids must be exactly the current set of account ids (validated by the caller).
  reorder(ids) {
    const byId = new Map(this.accounts.map((a) => [a.id, a]));
    this.accounts = ids.map((id) => byId.get(id));
    this.save();
  }

  setActive(id) {
    this.activeId = id;
    this.save();
  }
}

module.exports = { AccountStore, cleanLabel, MAX_LABEL };
