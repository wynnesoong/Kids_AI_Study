# Kids AI Study 互動式教學網站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個精美互動 + 遊戲化的兒童 AI 教學網站，包含 5 個模組的完整課程內容，部署到 GitHub Pages。

**Architecture:** 純前端 SPA（Single Page Application），使用 Tailwind CSS CDN 做樣式、Vanilla JS 管理狀態和互動。所有課程內容以 JSON 資料驅動，UI 元件化但不用框架。localStorage 存儲學習進度和成就。

**Tech Stack:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript, localStorage, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-03-27-kids-ai-curriculum-design.md`

---

## File Structure

```
Kids_AI_Study/
├── index.html                  # 首頁：進度地圖 + 整體導航
├── css/
│   └── custom.css              # Tailwind 以外的自訂樣式（動畫、遊戲化效果）
├── js/
│   ├── app.js                  # 主程式：路由、初始化、主題切換
│   ├── progress.js             # 進度追蹤 + localStorage 管理
│   ├── achievements.js         # 成就徽章系統
│   ├── modules.js              # 模組頁面渲染邏輯
│   └── components.js           # 共用 UI 元件（側邊欄、進度條、提示框等）
├── data/
│   ├── module1.json            # 模組 1 課程內容
│   ├── module2.json            # 模組 2 課程內容
│   ├── module3.json            # 模組 3 課程內容
│   ├── module4.json            # 模組 4 課程內容
│   ├── module5.json            # 模組 5 課程內容
│   └── achievements.json       # 成就定義
├── assets/
│   ├── icons/                  # SVG 圖示（模組圖標、成就徽章等）
│   └── images/                 # 圖片資源
└── docs/                       # （已存在）設計文件
```

**各檔案職責：**
- `index.html` — 唯一的 HTML 檔，所有內容透過 JS 動態渲染（SPA）
- `css/custom.css` — 動畫 keyframes、成就彈出效果、進度地圖連接線等 Tailwind 不方便做的樣式
- `js/app.js` — SPA 路由（hash-based）、深色/亮色主題切換、全域初始化
- `js/progress.js` — 讀寫 localStorage、計算模組完成度、管理章節 checkbox 狀態
- `js/achievements.js` — 成就解鎖判定、徽章通知動畫、成就牆渲染
- `js/modules.js` — 根據 JSON 資料渲染課程內容頁面（標題、段落、步驟清單、提示框等）
- `js/components.js` — 可重用的 UI 元件函式（renderSidebar、renderProgressBar、renderAlert 等）
- `data/*.json` — 課程內容純資料，與渲染邏輯分離，方便日後修改課程內容

---

## Task 1: 專案骨架 + HTML + Tailwind + 主題切換

**Files:**
- Create: `index.html`
- Create: `css/custom.css`
- Create: `js/app.js`

- [ ] **Step 1: 建立 index.html 基礎結構**

```html
<!DOCTYPE html>
<html lang="zh-Hant" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kids AI Study — AI 探索學院</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1' },
            accent: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
            success: { 400: '#4ade80', 500: '#22c55e' },
            warning: { 400: '#facc15', 500: '#eab308' }
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="css/custom.css">
</head>
<body class="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
  <!-- Top Navigation -->
  <nav id="top-nav" class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🤖</span>
        <h1 class="text-lg font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">AI 探索學院</h1>
      </div>
      <div class="flex items-center gap-4">
        <div id="global-progress" class="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div id="global-progress-bar" class="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500" style="width: 0%"></div>
          </div>
          <span id="global-progress-text">0%</span>
        </div>
        <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span id="theme-icon">🌙</span>
        </button>
        <button id="achievements-btn" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          🏆
          <span id="achievements-count" class="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hidden">0</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Main Content Area -->
  <main id="app" class="pt-16 min-h-screen">
    <!-- Content rendered by JS -->
  </main>

  <!-- Achievement Popup -->
  <div id="achievement-popup" class="fixed bottom-6 right-6 z-50 hidden">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-accent-500/30 p-4 flex items-center gap-3 animate-slide-up">
      <span id="achievement-popup-icon" class="text-4xl"></span>
      <div>
        <p class="text-xs text-accent-500 font-semibold uppercase tracking-wide">成就解鎖！</p>
        <p id="achievement-popup-title" class="font-bold"></p>
        <p id="achievement-popup-desc" class="text-sm text-gray-500 dark:text-gray-400"></p>
      </div>
    </div>
  </div>

  <script src="js/progress.js"></script>
  <script src="js/achievements.js"></script>
  <script src="js/components.js"></script>
  <script src="js/modules.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 建立 css/custom.css 動畫和自訂樣式**

```css
/* 成就彈出動畫 */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}

/* 進度地圖連接線 */
.module-connector {
  position: relative;
}
.module-connector::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -2rem;
  width: 2px;
  height: 2rem;
  background: linear-gradient(to bottom, rgb(14, 165, 233), rgb(139, 92, 246));
  opacity: 0.3;
}
.module-connector.completed::after {
  opacity: 1;
}

/* 模組卡片 hover 效果 */
.module-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -12px rgba(14, 165, 233, 0.3);
}

/* 章節完成打勾動畫 */
@keyframes check-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
.check-animated {
  animation: check-bounce 0.3s ease-out;
}

/* Checkbox peer-checked: show checkmark SVG inside sibling div */
input.section-check:checked + div > svg {
  display: block !important;
}

/* 成就徽章發光效果 */
.badge-glow {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
}

/* 打字機效果 */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.typing-cursor::after {
  content: '|';
  animation: blink-cursor 0.8s infinite;
  color: rgb(14, 165, 233);
}

/* 頁面轉場 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-enter {
  animation: fade-in 0.3s ease-out;
}

/* 進度環 */
.progress-ring-circle {
  transition: stroke-dashoffset 0.5s ease;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgb(156, 163, 175); border-radius: 4px; }
.dark ::-webkit-scrollbar-thumb { background: rgb(75, 85, 99); }
```

- [ ] **Step 3: 建立 js/app.js 路由和主題切換**

```javascript
// js/app.js — SPA 路由 + 主題切換 + 初始化

const App = {
  async init() {
    await Achievements.init();
    this.setupTheme();
    this.setupRouter();
    this.setupNavListeners();
    window.addEventListener('hashchange', () => this.route());
    this.route();
  },

  setupTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);
    this.updateThemeIcon(isDark);

    document.getElementById('theme-toggle').addEventListener('click', () => {
      const nowDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', nowDark ? 'dark' : 'light');
      this.updateThemeIcon(nowDark);
    });
  },

  updateThemeIcon(isDark) {
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
  },

  setupNavListeners() {
    document.getElementById('achievements-btn').addEventListener('click', () => {
      window.location.hash = '#/achievements';
    });
  },

  setupRouter() {
    this.routes = {
      '':           () => this.renderHome(),
      '/':          () => this.renderHome(),
      '/module/1':  () => ModuleRenderer.render(1),
      '/module/2':  () => ModuleRenderer.render(2),
      '/module/3':  () => ModuleRenderer.render(3),
      '/module/4':  () => ModuleRenderer.render(4),
      '/module/5':  () => ModuleRenderer.render(5),
      '/achievements': () => Achievements.renderWall(),
      '/setup':        () => Components.renderSetupPage(),
    };
  },

  route() {
    const hash = window.location.hash.replace('#', '') || '/';
    const app = document.getElementById('app');
    const handler = this.routes[hash];

    if (handler) {
      app.innerHTML = '';
      handler();
    } else {
      app.innerHTML = Components.renderNotFound();
    }

    // Update global progress bar
    this.updateGlobalProgress();
    window.scrollTo(0, 0);
  },

  renderHome() {
    const app = document.getElementById('app');
    app.innerHTML = Components.renderHomePage();
  },

  updateGlobalProgress() {
    const pct = Progress.getOverallPercentage();
    const bar = document.getElementById('global-progress-bar');
    const text = document.getElementById('global-progress-text');
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = pct + '%';

    const count = Achievements.getUnlockedCount();
    const badge = document.getElementById('achievements-count');
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
```

- [ ] **Step 4: 在瀏覽器中打開 index.html，確認骨架渲染正常**

用瀏覽器打開 `index.html`，應該看到：
- 頂部導航列（標題 + 進度條 + 主題切換按鈕 + 成就按鈕）
- 點擊月亮/太陽圖示可以切換深色/亮色模式
- 主內容區空白（尚未建立 components）
- Console 無報錯

- [ ] **Step 5: Commit**

```bash
git add index.html css/custom.css js/app.js
git commit -m "feat: 專案骨架 + HTML + Tailwind + 主題切換"
```

---

## Task 2: 進度追蹤系統 + localStorage

**Files:**
- Create: `js/progress.js`

- [ ] **Step 1: 實作 Progress 模組**

```javascript
// js/progress.js — 進度追蹤 + localStorage

const Progress = {
  STORAGE_KEY: 'kids_ai_study_progress',

  // 5 個模組，每個模組有若干 section
  MODULES: {
    1: { title: 'AI 大發現', sections: ['1.1','1.2','1.3','1.4','1.5','1.6','1.7'], icon: '🧠', time: '40 min' },
    2: { title: 'LLM 擂台賽', sections: ['2.1','2.2','2.3','2.4','2.5','2.6'], icon: '⚔️', time: '40 min' },
    3: { title: 'Claude 全產品探索', sections: ['3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9'], icon: '🔧', time: '60 min' },
    4: { title: 'GitHub + Claude Code', sections: ['4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8'], icon: '🚀', time: '70 min' },
    5: { title: '我的 AI 作品', sections: ['5.1','5.2','5.3','5.4','5.5','5.6','5.7','5.8','5.9'], icon: '🎨', time: '50 min' },
  },

  _load() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  },

  _save(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  toggleSection(moduleId, sectionId) {
    const data = this._load();
    const key = `${moduleId}.${sectionId}`;
    data[key] = !data[key];
    this._save(data);

    // Check achievements after each toggle
    Achievements.checkAll();
    App.updateGlobalProgress();

    return data[key];
  },

  isSectionComplete(moduleId, sectionId) {
    const data = this._load();
    return !!data[`${moduleId}.${sectionId}`];
  },

  getModulePercentage(moduleId) {
    const mod = this.MODULES[moduleId];
    if (!mod) return 0;
    const data = this._load();
    const done = mod.sections.filter(s => data[`${moduleId}.${s}`]).length;
    return Math.round((done / mod.sections.length) * 100);
  },

  isModuleComplete(moduleId) {
    return this.getModulePercentage(moduleId) === 100;
  },

  getOverallPercentage() {
    const allSections = Object.entries(this.MODULES).flatMap(
      ([id, mod]) => mod.sections.map(s => `${id}.${s}`)
    );
    const data = this._load();
    const done = allSections.filter(k => data[k]).length;
    return Math.round((done / allSections.length) * 100);
  },

  getCompletedModuleCount() {
    return Object.keys(this.MODULES).filter(id => this.isModuleComplete(id)).length;
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(Achievements.STORAGE_KEY);
    App.route();
  }
};
```

- [ ] **Step 2: 在 Console 測試 Progress API**

打開瀏覽器 Console 執行：
```javascript
Progress.toggleSection(1, '1.1');  // 應回傳 true
Progress.isSectionComplete(1, '1.1');  // true
Progress.getModulePercentage(1);  // ~14
Progress.toggleSection(1, '1.1');  // 應回傳 false（取消）
```

- [ ] **Step 3: Commit**

```bash
git add js/progress.js
git commit -m "feat: 進度追蹤系統 + localStorage"
```

---

## Task 3: 成就徽章系統

**Files:**
- Create: `data/achievements.json`
- Create: `js/achievements.js`

- [ ] **Step 1: 建立 achievements.json**

```json
[
  {
    "id": "first_step",
    "icon": "👣",
    "title": "踏出第一步",
    "description": "完成第一個章節",
    "condition": { "type": "any_section" }
  },
  {
    "id": "module1_done",
    "icon": "🧠",
    "title": "AI 啟蒙者",
    "description": "完成模組 1：AI 大發現",
    "condition": { "type": "module_complete", "moduleId": 1 }
  },
  {
    "id": "module2_done",
    "icon": "⚔️",
    "title": "LLM 鑑賞家",
    "description": "完成模組 2：LLM 擂台賽",
    "condition": { "type": "module_complete", "moduleId": 2 }
  },
  {
    "id": "module3_done",
    "icon": "🔧",
    "title": "Claude 達人",
    "description": "完成模組 3：Claude 全產品探索",
    "condition": { "type": "module_complete", "moduleId": 3 }
  },
  {
    "id": "module4_done",
    "icon": "🚀",
    "title": "Git 冒險家",
    "description": "完成模組 4：GitHub + Claude Code",
    "condition": { "type": "module_complete", "moduleId": 4 }
  },
  {
    "id": "module5_done",
    "icon": "🎨",
    "title": "AI 創作者",
    "description": "完成模組 5：我的 AI 作品",
    "condition": { "type": "module_complete", "moduleId": 5 }
  },
  {
    "id": "half_way",
    "icon": "🏔️",
    "title": "半途不廢",
    "description": "完成 50% 的課程進度",
    "condition": { "type": "overall_percentage", "value": 50 }
  },
  {
    "id": "all_done",
    "icon": "👑",
    "title": "AI 探索大師",
    "description": "完成全部課程！",
    "condition": { "type": "overall_percentage", "value": 100 }
  },
  {
    "id": "three_modules",
    "icon": "🔥",
    "title": "三連勝",
    "description": "完成任意 3 個模組",
    "condition": { "type": "modules_completed_count", "value": 3 }
  },
  {
    "id": "night_owl",
    "icon": "🦉",
    "title": "夜貓子學霸",
    "description": "在深色模式下完成一個章節",
    "condition": { "type": "dark_mode_section" }
  }
]
```

- [ ] **Step 2: 實作 achievements.js**

```javascript
// js/achievements.js — 成就系統

const Achievements = {
  STORAGE_KEY: 'kids_ai_study_achievements',
  definitions: [],

  async init() {
    try {
      const resp = await fetch('data/achievements.json');
      this.definitions = await resp.json();
    } catch (e) {
      console.warn('Failed to load achievements:', e);
      this.definitions = [];
    }
  },

  _load() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  },

  _save(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  isUnlocked(id) {
    return !!this._load()[id];
  },

  getUnlockedCount() {
    return Object.keys(this._load()).length;
  },

  unlock(id) {
    const data = this._load();
    if (data[id]) return false; // already unlocked
    data[id] = Date.now();
    this._save(data);
    this.showPopup(id);
    return true;
  },

  checkAll() {
    const progressData = Progress._load();
    const anyDone = Object.values(progressData).some(v => v);

    for (const def of this.definitions) {
      if (this.isUnlocked(def.id)) continue;

      const { type, moduleId, value } = def.condition;

      switch (type) {
        case 'any_section':
          if (anyDone) this.unlock(def.id);
          break;
        case 'module_complete':
          if (Progress.isModuleComplete(moduleId)) this.unlock(def.id);
          break;
        case 'overall_percentage':
          if (Progress.getOverallPercentage() >= value) this.unlock(def.id);
          break;
        case 'modules_completed_count':
          if (Progress.getCompletedModuleCount() >= value) this.unlock(def.id);
          break;
        case 'dark_mode_section':
          if (anyDone && document.documentElement.classList.contains('dark')) this.unlock(def.id);
          break;
      }
    }
  },

  showPopup(id) {
    const def = this.definitions.find(d => d.id === id);
    if (!def) return;

    const popup = document.getElementById('achievement-popup');
    document.getElementById('achievement-popup-icon').textContent = def.icon;
    document.getElementById('achievement-popup-title').textContent = def.title;
    document.getElementById('achievement-popup-desc').textContent = def.description;

    popup.classList.remove('hidden');
    popup.querySelector('div').classList.remove('animate-slide-up');
    void popup.querySelector('div').offsetWidth; // trigger reflow
    popup.querySelector('div').classList.add('animate-slide-up');

    setTimeout(() => popup.classList.add('hidden'), 3500);
  },

  renderWall() {
    const app = document.getElementById('app');
    const unlocked = this._load();

    const badges = this.definitions.map(def => {
      const isUnlocked = !!unlocked[def.id];
      return `
        <div class="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all duration-300
          ${isUnlocked
            ? 'bg-white dark:bg-gray-800 border-accent-500/30 badge-glow'
            : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50'
          }">
          <span class="text-5xl ${isUnlocked ? '' : 'grayscale'}">${def.icon}</span>
          <p class="font-bold text-sm text-center">${def.title}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center">${def.description}</p>
          ${isUnlocked
            ? `<span class="text-xs text-success-500 font-medium">✓ 已解鎖</span>`
            : `<span class="text-xs text-gray-400">🔒 未解鎖</span>`
          }
        </div>`;
    }).join('');

    app.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-12 page-enter">
        <div class="flex items-center gap-3 mb-8">
          <a href="#/" class="text-gray-400 hover:text-primary-500 transition-colors">← 返回</a>
        </div>
        <h2 class="text-3xl font-bold mb-2">🏆 成就牆</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          已解鎖 ${this.getUnlockedCount()} / ${this.definitions.length} 個成就
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          ${badges}
        </div>
      </div>`;
  }
};
```

- [ ] **Step 3: 在 app.js init() 中加入 achievements 初始化**

在 `App.init()` 開頭加入：
```javascript
await Achievements.init();
```
並將 `init()` 改為 `async init()`，`DOMContentLoaded` 事件不受影響。

- [ ] **Step 4: 驗證成就系統**

在 Console 執行：
```javascript
Progress.toggleSection(1, '1.1');
// 應觸發「踏出第一步」成就彈出通知
Achievements.getUnlockedCount(); // 至少 1
```

- [ ] **Step 5: Commit**

```bash
git add data/achievements.json js/achievements.js js/app.js
git commit -m "feat: 成就徽章系統 + 彈出通知"
```

---

## Task 4: 共用 UI 元件 + 首頁進度地圖

**Files:**
- Create: `js/components.js`

- [ ] **Step 1: 實作 Components 模組**

```javascript
// js/components.js — 共用 UI 元件

const Components = {
  renderHomePage() {
    const modules = Object.entries(Progress.MODULES);

    const moduleCards = modules.map(([id, mod], index) => {
      const pct = Progress.getModulePercentage(id);
      const isComplete = pct === 100;
      const isLast = index === modules.length - 1;

      return `
        <div class="module-connector ${isComplete ? 'completed' : ''} ${isLast ? 'last' : ''}">
          <a href="#/module/${id}"
             class="module-card block p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
               ${isComplete
                 ? 'bg-success-500/10 border-success-500/30 dark:bg-success-500/5'
                 : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-400'
               }">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="text-3xl">${mod.icon}</span>
                <div>
                  <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">模組 ${id}</p>
                  <h3 class="text-lg font-bold">${mod.title}</h3>
                </div>
              </div>
              <span class="text-sm text-gray-400">${mod.time}</span>
            </div>
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500
                ${isComplete ? 'bg-success-500' : 'bg-gradient-to-r from-primary-500 to-accent-500'}"
                style="width: ${pct}%"></div>
            </div>
            <div class="flex justify-between mt-2 text-xs text-gray-400">
              <span>${pct}% 完成</span>
              ${isComplete ? '<span class="text-success-500 font-medium">✓ 已完成</span>' : ''}
            </div>
          </a>
        </div>`;
    }).join('');

    const overall = Progress.getOverallPercentage();

    return `
      <div class="max-w-3xl mx-auto px-4 py-12 page-enter">
        <!-- Hero -->
        <div class="text-center mb-12">
          <h2 class="text-4xl sm:text-5xl font-extrabold mb-4">
            <span class="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent">
              AI 探索學院
            </span>
          </h2>
          <p class="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            5 個模組，帶你從零開始認識 AI、動手操作、做出自己的作品
          </p>
          <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
            <span>整體進度</span>
            <div class="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500" style="width: ${overall}%"></div>
            </div>
            <span class="font-bold">${overall}%</span>
          </div>
        </div>

        <!-- Module Map -->
        <div class="flex flex-col gap-6">
          ${moduleCards}
        </div>

        <!-- Quick Actions -->
        <div class="mt-12 flex justify-center gap-4">
          <a href="#/achievements" class="px-6 py-3 bg-accent-500/10 text-accent-500 rounded-xl font-medium hover:bg-accent-500/20 transition-colors">
            🏆 成就牆
          </a>
          <button onclick="if(confirm('確定要重置所有進度嗎？')) Progress.reset()"
            class="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            🔄 重置進度
          </button>
        </div>
      </div>`;
  },

  renderNotFound() {
    return `
      <div class="max-w-xl mx-auto px-4 py-24 text-center page-enter">
        <span class="text-6xl">🤷</span>
        <h2 class="text-2xl font-bold mt-4">找不到頁面</h2>
        <a href="#/" class="mt-4 inline-block text-primary-500 hover:underline">← 回首頁</a>
      </div>`;
  },

  renderProgressRing(percentage, size = 48) {
    const radius = (size - 4) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return `
      <svg width="${size}" height="${size}" class="transform -rotate-90">
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="currentColor" class="text-gray-200 dark:text-gray-700" stroke-width="3"/>
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="url(#grad)" stroke-width="3"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"
          class="progress-ring-circle"/>
        <defs>
          <linearGradient id="grad"><stop stop-color="#0ea5e9"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient>
        </defs>
      </svg>`;
  }
};
```

- [ ] **Step 2: 驗證首頁渲染**

打開瀏覽器，應該看到：
- 大標題「AI 探索學院」帶漸層色
- 5 個模組卡片縱向排列，各有 icon、標題、時間、進度條
- 整體進度顯示 0%
- 底部有成就牆和重置進度按鈕
- 深色/亮色切換正常

- [ ] **Step 3: Commit**

```bash
git add js/components.js
git commit -m "feat: 共用 UI 元件 + 首頁進度地圖"
```

---

## Task 5: 模組頁面渲染器

**Files:**
- Create: `js/modules.js`

- [ ] **Step 1: 實作 ModuleRenderer**

```javascript
// js/modules.js — 模組頁面渲染

const ModuleRenderer = {
  async render(moduleId) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="flex justify-center py-24"><span class="text-4xl animate-pulse">⏳</span></div>';

    try {
      const resp = await fetch(`data/module${moduleId}.json`);
      const data = await resp.json();
      app.innerHTML = this.renderModule(data);
      this.bindCheckboxes(moduleId);
    } catch (e) {
      app.innerHTML = Components.renderNotFound();
    }
  },

  renderModule(data) {
    const pct = Progress.getModulePercentage(data.id);

    const sectionsHtml = data.sections.map(section => {
      const isComplete = Progress.isSectionComplete(data.id, section.id);
      const contentHtml = section.content.map(block => this.renderBlock(block)).join('');
      const sectionType = section.type === 'learn' ? '📖 學' : '🎮 玩';

      return `
        <div id="section-${section.id}" class="mb-8 scroll-mt-20">
          <div class="flex items-start gap-4 p-6 rounded-2xl border-2 transition-all duration-300
            ${isComplete
              ? 'bg-success-500/5 border-success-500/20'
              : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }">
            <label class="flex-shrink-0 mt-1 cursor-pointer">
              <input type="checkbox" data-module="${data.id}" data-section="${section.id}"
                ${isComplete ? 'checked' : ''}
                class="sr-only section-check">
              <div class="w-7 h-7 rounded-lg border-2 border-gray-300 dark:border-gray-600
                flex items-center justify-center transition-all duration-200
                ${isComplete ? 'bg-green-500 border-green-500' : ''}">
                <svg class="w-4 h-4 text-white ${isComplete ? '' : 'hidden'} check-animated" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </label>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-xs font-medium px-2 py-1 rounded-full
                  ${section.type === 'learn'
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'bg-accent-500/10 text-accent-500'
                  }">${sectionType}</span>
                <h3 class="text-lg font-bold">${section.id} ${section.title}</h3>
              </div>
              <div class="prose prose-sm dark:prose-invert max-w-none space-y-4">
                ${contentHtml}
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    // Sidebar: section list
    const sidebarItems = data.sections.map(s => {
      const done = Progress.isSectionComplete(data.id, s.id);
      return `
        <a href="#section-${s.id}" onclick="document.getElementById('section-${s.id}').scrollIntoView({behavior:'smooth'}); return false;"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
          ${done ? 'text-success-500' : 'text-gray-500 dark:text-gray-400'}">
          <span class="text-xs">${done ? '✓' : '○'}</span>
          <span>${s.id} ${s.title}</span>
        </a>`;
    }).join('');

    return `
      <div class="max-w-7xl mx-auto px-4 py-8 page-enter">
        <div class="flex gap-8">
          <!-- Sidebar (desktop) -->
          <aside class="hidden lg:block w-64 flex-shrink-0">
            <div class="sticky top-24 space-y-1">
              <a href="#/" class="flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors mb-4 text-sm">← 返回首頁</a>
              <div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">章節目錄</div>
              ${sidebarItems}
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-400 mb-1">模組進度</div>
                <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                </div>
                <div class="text-xs text-gray-400 mt-1">${pct}%</div>
              </div>
            </div>
          </aside>

          <!-- Main content -->
          <div class="flex-1 min-w-0">
            <!-- Module header -->
            <div class="mb-8">
              <a href="#/" class="lg:hidden flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors mb-4 text-sm">← 返回首頁</a>
              <div class="flex items-center gap-4">
                <span class="text-5xl">${data.icon}</span>
                <div>
                  <p class="text-sm font-medium text-gray-400 uppercase tracking-wide">模組 ${data.id} · ${data.time}</p>
                  <h2 class="text-3xl font-bold">${data.title}</h2>
                  <p class="text-gray-500 dark:text-gray-400 mt-1">${data.subtitle}</p>
                </div>
              </div>
            </div>

            ${sectionsHtml}

            <!-- Module navigation -->
            <div class="flex justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              ${data.id > 1
                ? `<a href="#/module/${data.id - 1}" class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">← 上一個模組</a>`
                : '<div></div>'
              }
              ${data.id < 5
                ? `<a href="#/module/${data.id + 1}" class="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors">下一個模組 →</a>`
                : `<a href="#/" class="px-4 py-2 rounded-lg bg-success-500 text-white hover:bg-success-400 transition-colors">🎉 回到首頁</a>`
              }
            </div>
          </div>
        </div>
      </div>`;
  },

  renderBlock(block) {
    switch (block.type) {
      case 'paragraph':
        return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed">${block.text}</p>`;

      case 'highlight':
        const variants = {
          info: 'bg-primary-500/10 border-primary-500/30 text-primary-700 dark:text-primary-300',
          warning: 'bg-warning-400/10 border-warning-400/30 text-yellow-700 dark:text-yellow-300',
          success: 'bg-success-500/10 border-success-500/30 text-green-700 dark:text-green-300',
          tip: 'bg-accent-500/10 border-accent-500/30 text-purple-700 dark:text-purple-300',
        };
        return `<div class="p-4 rounded-xl border-l-4 ${variants[block.variant] || variants.info}">${block.text}</div>`;

      case 'comparison':
        return `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <h4 class="font-bold text-sm mb-2 text-red-500">${block.left.title}</h4>
              <ul class="space-y-1 text-sm">${block.left.items.map(i => `<li>• ${i}</li>`).join('')}</ul>
            </div>
            <div class="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
              <h4 class="font-bold text-sm mb-2 text-green-500">${block.right.title}</h4>
              <ul class="space-y-1 text-sm">${block.right.items.map(i => `<li>• ${i}</li>`).join('')}</ul>
            </div>
          </div>`;

      case 'steps':
        const steps = block.items.map((item, i) => `
          <div class="flex gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center text-sm font-bold">${i + 1}</div>
            <div class="flex-1 pt-1">
              <p class="text-gray-700 dark:text-gray-300">${item}</p>
            </div>
          </div>`).join('');
        return `<div class="space-y-3">${steps}</div>`;

      case 'table':
        const headers = block.headers.map(h => `<th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">${h}</th>`).join('');
        const rows = block.rows.map(row =>
          `<tr class="border-t border-gray-200 dark:border-gray-700">${row.map(cell => `<td class="px-4 py-3 text-sm">${cell}</td>`).join('')}</tr>`
        ).join('');
        return `
          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table class="w-full"><thead class="bg-gray-50 dark:bg-gray-800/50"><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>
          </div>`;

      case 'keypoint':
        return `
          <div class="flex items-start gap-3 p-4 rounded-xl bg-accent-500/5 border border-accent-500/20">
            <span class="text-xl flex-shrink-0">💡</span>
            <div>
              <p class="font-bold text-sm text-accent-600 dark:text-accent-400">${block.title}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${block.text}</p>
            </div>
          </div>`;

      default:
        return `<p>${JSON.stringify(block)}</p>`;
    }
  },

  bindCheckboxes(moduleId) {
    document.querySelectorAll('input[data-module]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const mid = parseInt(e.target.dataset.module);
        const sid = e.target.dataset.section;
        const isNowComplete = Progress.toggleSection(mid, sid);

        // Update section card style
        const card = e.target.closest('[id^="section-"]');
        if (card) {
          const inner = card.querySelector(':scope > div');
          if (isNowComplete) {
            inner.classList.add('bg-success-500/5', 'border-success-500/20');
            inner.classList.remove('bg-white', 'dark:bg-gray-800/50', 'border-gray-200', 'dark:border-gray-700');
          } else {
            inner.classList.remove('bg-success-500/5', 'border-success-500/20');
            inner.classList.add('bg-white', 'dark:bg-gray-800/50', 'border-gray-200', 'dark:border-gray-700');
          }
        }

        // Re-render sidebar progress (simple approach)
        const pctEl = document.querySelector('aside .text-xs.text-gray-400.mt-1');
        const barEl = document.querySelector('aside .h-full');
        if (pctEl && barEl) {
          const pct = Progress.getModulePercentage(mid);
          pctEl.textContent = pct + '%';
          barEl.style.width = pct + '%';
        }
      });
    });
  }
};
```

- [ ] **Step 2: 建立一個簡易測試用的 module1.json（最小化版本）**

先建一個只有 2 個 section 的測試版 module1.json，確認渲染器正常運作：

```json
{
  "id": 1,
  "title": "AI 大發現",
  "subtitle": "建立對 AI 的正確認知，體驗 AI 的真正實力",
  "icon": "🧠",
  "time": "40 分鐘",
  "sections": [
    {
      "id": "1.1",
      "title": "AI 的本質",
      "type": "learn",
      "content": [
        { "type": "paragraph", "text": "AI 是一種「從大量資料中找出規律」的程式。" },
        { "type": "highlight", "text": "重點：傳統程式 = 人寫規則；AI = 從資料學規則", "variant": "info" }
      ]
    },
    {
      "id": "1.2",
      "title": "大語言模型怎麼運作",
      "type": "learn",
      "content": [
        { "type": "paragraph", "text": "LLM 的核心能力就是預測下一個字。" },
        { "type": "keypoint", "title": "什麼是 Token？", "text": "AI 把文字切成小碎片（Token），中文大約一個字是一個 Token。" }
      ]
    }
  ]
}
```

- [ ] **Step 3: 驗證模組頁面**

點擊首頁的模組 1 卡片，應該看到：
- 模組標題 + 圖示 + 時間
- 左側目錄列（桌面版）
- 每個 section 有 checkbox，可以打勾
- 打勾後背景變綠、進度更新、可能觸發成就
- 底部有模組導航（上一個/下一個）

- [ ] **Step 4: Commit**

```bash
git add js/modules.js data/module1.json
git commit -m "feat: 模組頁面渲染器 + 測試資料"
```

---

## Task 6: 完整課程內容填入（5 個 JSON）

> 這是整個計畫中工作量最大的 Task。每個 JSON 需根據 spec 完整轉換所有教學內容。

**JSON 結構參考**（所有模組共用）：
```json
{
  "id": 1,
  "title": "模組標題",
  "subtitle": "模組描述",
  "icon": "🧠",
  "time": "40 分鐘",
  "sections": [
    {
      "id": "1.1",
      "title": "章節標題",
      "type": "learn 或 play",
      "content": [
        { "type": "paragraph", "text": "一般文字段落" },
        { "type": "highlight", "text": "重點提示", "variant": "info/warning/success/tip" },
        { "type": "comparison", "left": { "title": "...", "items": [] }, "right": { "title": "...", "items": [] } },
        { "type": "steps", "items": ["步驟 1", "步驟 2"] },
        { "type": "table", "headers": ["欄1","欄2"], "rows": [["值1","值2"]] },
        { "type": "keypoint", "title": "要點標題", "text": "要點內容" }
      ]
    }
  ]
}
```

**Files:**
- Modify: `data/module1.json` — 擴充為完整內容
- Create: `data/module2.json`
- Create: `data/module3.json`
- Create: `data/module4.json`
- Create: `data/module5.json`

- [ ] **Step 1: 完整填入 module1.json**

根據 spec 的模組 1（section 1.1 ~ 1.7）完整填入所有內容。
- 1.1~1.4 使用 `paragraph`、`highlight`、`comparison`（傳統程式 vs AI）、`keypoint`
- 1.5~1.7 使用 `steps`（操作步驟）+ `keypoint`（關鍵學習）

- [ ] **Step 2: 完整填入 module2.json**

根據 spec 的模組 2（section 2.1 ~ 2.6）完整填入。
- 2.2 五大陣營介紹：每個陣營用 `highlight` 框（variant 區分），或一個大 `table` 彙整
- 2.5~2.6 用 `steps` + `table`（評分表模板）

- [ ] **Step 3: 完整填入 module3.json**

根據 spec 的模組 3（section 3.1 ~ 3.9）完整填入。
- 3.1 產品比較表：用 `table` block
- 3.4~3.9 每個產品體驗：用 `steps`（操作步驟要非常詳細，包含 UI 導引）+ `keypoint`

- [ ] **Step 4: 完整填入 module4.json**

根據 spec 的模組 4（section 4.1 ~ 4.8）完整填入。4.4 的核心概念和 4.8 的 Branch 專題要特別詳細。

- [ ] **Step 5: 完整填入 module5.json**

根據 spec 的模組 5（section 5.1 ~ 5.9）完整填入。5.1 的四個專案選項要清楚呈現。

- [ ] **Step 6: 驗證所有模組頁面**

逐一打開 5 個模組頁面，確認：
- 所有 section 都有渲染
- 內容完整、格式正確
- checkbox 打勾功能正常
- 模組間導航正常

- [ ] **Step 7: Commit**

```bash
git add data/module*.json
git commit -m "feat: 填入 5 個模組的完整課程內容"
```

---

## Task 7: 前置準備頁面 + 連接線修復 + 響應式 + 最終打磨

**Files:**
- Modify: `css/custom.css` — 修復連接線在最後一個元素的問題
- Modify: `js/components.js` — 加入前置準備頁面（`renderSetupPage`）+ 響應式調整
- Modify: `index.html` — 加 favicon、meta description

- [ ] **Step 0: 在 components.js 加入前置準備頁面**

新增 `renderSetupPage()` 方法，根據 spec 的「前置準備清單」渲染一個帶 checkbox 的頁面，包含帳號年齡限制提醒、所有準備項目。首頁也加入一個「課前準備」的連結。

- [ ] **Step 1: 修復最後一個模組卡片的連接線**

在 `custom.css` 加入：
```css
.module-connector.last::after {
  display: none;
}
```

- [ ] **Step 2: 加入 meta 和 favicon**

在 `index.html` 的 `<head>` 加入：
```html
<meta name="description" content="兒童 AI 教學互動課程 — 5 個模組帶你認識 AI、LLM、Claude、GitHub">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">
```

- [ ] **Step 3: 響應式測試**

在不同寬度下測試：
- 手機（375px）：側邊欄隱藏，內容全寬
- 平板（768px）：正常顯示
- 桌面（1280px）：側邊欄 + 主內容

- [ ] **Step 4: Commit**

```bash
git add css/custom.css js/components.js index.html
git commit -m "polish: 響應式修復 + meta + favicon"
```

---

## Task 8: GitHub Pages 部署

**Files:** 無新增

- [ ] **Step 1: 建立 GitHub Repository**

```bash
cd /Users/wynnesoong/Desktop/Kids_AI_Study
gh repo create Kids_AI_Study --public --source=. --remote=origin
```

- [ ] **Step 2: Push 到 GitHub**

```bash
git push -u origin main
```

- [ ] **Step 3: 啟用 GitHub Pages**

```bash
gh api repos/{owner}/{repo}/pages -X POST -f source='{"branch":"main","path":"/"}' || echo "Pages may already be enabled"
```

或手動：GitHub Repo → Settings → Pages → Source: main branch → Save

- [ ] **Step 4: 驗證部署**

等待 1-3 分鐘，打開 `https://[username].github.io/Kids_AI_Study/` 確認網站正常運作。

- [ ] **Step 5: Commit（如果有任何部署修復）**

```bash
git add -A
git commit -m "deploy: GitHub Pages 部署"
git push
```
