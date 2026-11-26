'use strict';
// Preload for service views. It exposes NO API to the page. It only wraps
// window.Notification / showNotification in the main world so each shown
// notification also triggers a send-only message with a fixed channel name.
// Main identifies the account by event.sender, never by page-supplied data.
const { contextBridge, ipcRenderer } = require('electron');

const notify = () => { ipcRenderer.send('svc:notification'); };
const notifyClick = () => { ipcRenderer.send('svc:notification-click'); };

try {
  contextBridge.executeInMainWorld({
    func: (notifyFn, clickFn) => {
      const safe = () => { try { notifyFn(); } catch { /* ignore */ } };
      if (typeof window.Notification === 'function') {
        window.Notification = new Proxy(window.Notification, {
          construct(target, args, newTarget) {
            safe();
            const n = Reflect.construct(target, args, newTarget);
            try {
              n.addEventListener('click', () => { try { clickFn(); } catch { /* ignore */ } });
            } catch { /* ignore */ }
            return n;
          }
        });
      }
      const SWR = window.ServiceWorkerRegistration;
      if (SWR && SWR.prototype && typeof SWR.prototype.showNotification === 'function') {
        SWR.prototype.showNotification = new Proxy(SWR.prototype.showNotification, {
          apply(target, thisArg, args) {
            safe();
            return Reflect.apply(target, thisArg, args);
          }
        });
      }
    },
    args: [notify, notifyClick]
  });
} catch (e) {
  // Never break the page if wrapping fails.
}
