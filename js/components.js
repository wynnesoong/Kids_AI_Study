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
        <div class="mt-12 flex flex-wrap justify-center gap-4">
          <a href="#/setup" class="px-6 py-3 bg-primary-500/10 text-primary-500 rounded-xl font-medium hover:bg-primary-500/20 transition-colors">
            📋 課前準備
          </a>
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

  renderSetupPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-12 page-enter">
        <a href="#/" class="text-gray-400 hover:text-primary-500 transition-colors text-sm">← 返回首頁</a>
        <h2 class="text-3xl font-bold mt-4 mb-2">📋 課前準備</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8">上課前請確認以下項目都已準備好</p>

        <div class="p-4 rounded-xl border-l-4 bg-warning-400/10 border-warning-400/30 text-yellow-700 dark:text-yellow-300 mb-8">
          <p class="font-bold mb-1">⚠️ 帳號年齡限制</p>
          <p class="text-sm">Claude、ChatGPT、GitHub 的服務條款都要求使用者年滿 13 歲。由於孩子分別是 10 歲和 12 歲，所有帳號應由家長代為建立或在家長監督下以家長身份建立。</p>
        </div>

        <div class="space-y-4">
          ${[
            '每人一台電腦（Mac 或 Windows）',
            '穩定的網路連線',
            '註冊好 Claude 帳號（claude.ai）— 建議 Claude Pro 方案',
            '註冊好 ChatGPT 帳號（用於模組 2 的 LLM 比較）',
            '安裝 Claude Desktop App（從 claude.ai 官網下載）',
            '安裝 Claude Code 並完成認證設定（API Key 或 OAuth）',
            '預備一些測試用的檔案（照片、文字檔等）',
            'GitHub 帳號（可在模組 4 課堂上現場註冊）',
            '確認 Cowork 和 Dispatch 功能可用'
          ].map((item, i) => `
            <label class="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 transition-colors">
              <input type="checkbox" class="mt-1 w-5 h-5 rounded accent-primary-500"
                onchange="localStorage.setItem('setup_${i}', this.checked)"
                ${localStorage.getItem('setup_' + i) === 'true' ? 'checked' : ''}>
              <span>${item}</span>
            </label>
          `).join('')}
        </div>

        <div class="mt-8 p-4 rounded-xl bg-primary-500/5 border border-primary-500/20 text-sm text-gray-600 dark:text-gray-400">
          <p class="font-bold text-primary-500 mb-1">💡 提醒</p>
          <p>AI 產品的介面和功能經常更新，課前一天請先跑一遍所有操作步驟，確認 UI 沒有大幅變動。</p>
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
