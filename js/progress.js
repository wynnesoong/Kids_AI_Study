// js/progress.js — 進度追蹤 + localStorage

const Progress = {
  STORAGE_KEY: 'kids_ai_study_progress',

  MODULES: {
    1: { title: 'AI 大發現', sections: ['1.1','1.2','1.3','1.4','1.5','1.6','1.7'], icon: '🧠', time: '40 min' },
    2: { title: 'LLM 擂台賽', sections: ['2.1','2.2','2.3','2.4','2.5','2.6'], icon: '⚔️', time: '40 min' },
    3: { title: 'Claude 全產品探索', sections: ['3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9'], icon: '🔧', time: '60 min' },
    4: { title: 'Claude 數據 & 文件魔法', sections: ['4.1','4.2','4.3','4.4'], icon: '📊', time: '50 min' },
    5: { title: 'Claude AI 創意工作室', sections: ['5.1','5.2','5.3','5.4'], icon: '🎨', time: '50 min' },
    6: { title: 'Claude AI 學習夥伴', sections: ['6.1','6.2','6.3','6.4'], icon: '📚', time: '50 min' },
    7: { title: 'Gemini 生圖教學', sections: ['7.1','7.2','7.3','7.4'], icon: '🖼️', time: '40 min' },
    8: { title: 'GitHub + Claude Code', sections: ['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.8'], icon: '🚀', time: '70 min' },
    9: { title: '我的 AI 作品', sections: ['9.1','9.2','9.3','9.4','9.5','9.6','9.7','9.8','9.9'], icon: '🏆', time: '50 min' },
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
