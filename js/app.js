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
