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

          <div class="flex-1 min-w-0">
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
