# Graph Report - social-hub  (2026-11-25)

## Corpus Check
- 30 files · ~15,433 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .css 2, .woff 1)

## Summary
- 251 nodes · 409 edges · 21 communities (12 shown, 9 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f77ca95`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.js
- renderer.js
- package.json
- AccountStore
- accounts.js
- README.md
- build
- renderer/i18n.js
- icons.js
- AGENTS.md
- CLAUDE.md
- architecture.md
- decisions.md
- glossary.md
- arquitectura.md
- decisiones.md
- glosario.md
- updateTray
- createView
- registerIpc
- setTitleCount

## God Nodes (most connected - your core abstractions)
1. `AccountStore` - 17 edges
2. `createView()` - 14 edges
3. `renderSidebar()` - 14 edges
4. `registerIpc()` - 13 edges
5. `renderHome()` - 13 edges
6. `setState()` - 11 edges
7. `openCtxMenu()` - 10 edges
8. `pushState()` - 9 edges
9. `createWindow()` - 9 edges
10. `updateTray()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Known issues` --references--> `deleteAccount()`  [INFERRED]
  docs/context/known-issues.md → src/main/main.js
- `Errores conocidos` --references--> `deleteAccount()`  [INFERRED]
  docs/contexto/errores-conocidos.md → src/main/main.js
- `Conventions` --references--> `AccountStore`  [INFERRED]
  docs/context/conventions.md → src/main/accounts.js
- `Convenciones` --references--> `AccountStore`  [INFERRED]
  docs/contexto/convenciones.md → src/main/accounts.js
- `Known issues` --references--> `createView()`  [INFERRED]
  docs/context/known-issues.md → src/main/main.js

## Import Cycles
- None detected.

## Communities (21 total, 9 thin omitted)

### Community 0 - "main.js"
Cohesion: 0.10
Nodes (17): { app, BrowserWindow, WebContentsView, ipcMain, session, shell, nativeTheme, nativeImage, Tray, Menu }, buildTrayImage(), configured, DIGITS, gotLock, lastSound, notifCounts, paintDot() (+9 more)

### Community 1 - "renderer.js"
Cohesion: 0.12
Nodes (41): accountRow(), accountsOf(), applySidebarState(), badgeEl(), buildPicker(), buildPopover(), chime, clearDropMarks() (+33 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (25): author, email, name, url, description, devDependencies, electron@^45.5.0, electron-builder@^26.18.0 (+17 more)

### Community 3 - "AccountStore"
Cohesion: 0.11
Nodes (8): Conventions, Frontend, Workflow, Convenciones, Flujo de trabajo, Frontend, AccountStore, isValidService()

### Community 4 - "accounts.js"
Cohesion: 0.10
Nodes (16): png-to-ico@^3.0.2, png-to-ico, fs, ICO_SIZES, main(), path, render(), root (+8 more)

### Community 5 - "README.md"
Cohesion: 0.08
Nodes (22): Build the installer, Creator, Ajustes, Características, Creador, Generar el instalador, Iconos y marca, Licencia (+14 more)

### Community 6 - "build"
Cohesion: 0.13
Nodes (15): build, appId, copyright, files, nsis, productName, win, allowToChangeInstallationDirectory (+7 more)

### Community 7 - "renderer/i18n.js"
Cohesion: 0.47
Nodes (4): applyStaticI18n(), countText(), I18N, t()

### Community 17 - "updateTray"
Cohesion: 0.22
Nodes (13): mt(), STRINGS, createTray(), displayCount(), effectiveLang(), makeBadgeImage(), maybeShowTrayHint(), publicState() (+5 more)

### Community 18 - "createView"
Cohesion: 0.17
Nodes (10): Known issues, Errores conocidos, configureSession(), createView(), isHttpUrl(), openExternalSafe(), parseTitleCount(), partitionOf() (+2 more)

### Community 19 - "registerIpc"
Cohesion: 0.44
Nodes (9): createWindow(), deleteAccount(), layoutViews(), markViewed(), pushState(), registerIpc(), selectAccount(), showActive() (+1 more)

### Community 20 - "setTitleCount"
Cohesion: 0.67
Nodes (4): flashIfUnfocused(), onPageNotification(), playSound(), setTitleCount()

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `electron` connect `package.json` to `main.js`, `accounts.js`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AccountStore` (e.g. with `Conventions` and `Convenciones`) actually correct?**
  _`AccountStore` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `main.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09881422924901186 - nodes in this community are weakly interconnected._
- **Why does `AccountStore` connect `AccountStore` to `main.js`, `accounts.js`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createView()` (e.g. with `Known issues` and `Errores conocidos`) actually correct?**
  _`createView()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `renderer.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11627906976744186 - nodes in this community are weakly interconnected._
- **Why does `build` connect `build` to `package.json`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._