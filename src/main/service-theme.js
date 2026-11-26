'use strict';

// Match the shell palette in renderer/styles.css. Only override site canvas colors.
const canvas = '#050A16';
const panel = '#0A1222';
const gradient = 'radial-gradient(900px 600px at 100% 0%, rgba(30,111,242,.20), transparent 60%), radial-gradient(800px 600px at 0% 100%, rgba(255,122,26,.10), transparent 60%)';
const facebook = `.__fb-dark-mode { --web-wash: ${canvas} !important; --surface-background: ${panel} !important; }`;
const styles = {
  whatsapp: `
    #wa_web_initial_startup {
      background: ${gradient}, ${canvas} !important;
      --splashscreen-primary-title: #F5F7FF !important;
      --splashscreen-secondary-lighter: #95A3C2 !important;
      --splashscreen-startup-content-deemphasized: #95A3C2 !important;
      --splashscreen-startup-icon: #95A3C2 !important;
      --splashscreen-progress-background: #15233D !important;
    }
    .dark { --app-background: ${canvas} !important; --panel-background: ${panel} !important; }
  `,
  facebook,
  messenger: facebook,
  instagram: `._aa4d, .__fb-dark-mode { --ig-primary-background: 5, 10, 22 !important; }`,
  tiktok: `[data-theme="dark"] { --ui-page-flat-1: ${canvas} !important; --color-BGPrimary: ${canvas} !important; }`,
  linkedin: `.theme--dark { --color-background-canvas: ${canvas} !important; }`
};

function applyServiceTheme(view, service, startUrl) {
  view.setBackgroundColor(canvas);
  const contents = view.webContents;
  const origin = new URL(startUrl).origin;
  contents.on('dom-ready', () => {
    if (new URL(contents.getURL()).origin !== origin) return;
    contents.insertCSS(`@media (forced-colors: none) { ${styles[service]} }`, {
      cssOrigin: 'user'
    }).catch(() => {}); // The view may close or navigate while applying its colors.
  });
}

module.exports = { applyServiceTheme };
