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
    if (data[id]) return false;
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
    void popup.querySelector('div').offsetWidth;
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
            ? '<span class="text-xs text-success-500 font-medium">✓ 已解鎖</span>'
            : '<span class="text-xs text-gray-400">🔒 未解鎖</span>'
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
