/**
 * Quad Find — Single Item Detail Modal Component
 */

import { appStore } from '../state.js';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../data.js';
import { findMatchesForItem } from '../aiMatcher.js';

export function openItemDetailModal(itemId) {
  const item = appStore.getItemById(itemId);
  if (!item) return;

  const loc = CAMPUS_LOCATIONS.find(l => l.id === item.locationId);
  const cat = CATEGORIES.find(c => c.id === item.category);
  const isResolved = item.status === 'resolved';
  const matches = !isResolved ? findMatchesForItem(item, appStore.getItems(), 50) : [];

  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  let typeBadge = '';
  if (isResolved) {
    typeBadge = `<span class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase"><i class="fas fa-check-circle mr-1"></i> Resolved & Reunited</span>`;
  } else if (item.type === 'lost') {
    typeBadge = `<span class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs uppercase"><i class="fas fa-search mr-1"></i> Lost Report</span>`;
  } else {
    typeBadge = `<span class="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs uppercase"><i class="fas fa-hand-holding-heart mr-1"></i> Found Item</span>`;
  }

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        <!-- Top Image & Close Button -->
        <div class="relative w-full aspect-video bg-slate-950 max-h-72 overflow-hidden">
          <img src="${item.photo}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'" />
          <div class="absolute top-4 left-4 flex items-center gap-2">
            ${typeBadge}
            ${item.reward ? `<span class="px-2 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase"><i class="fas fa-award mr-1"></i> ${item.reward}</span>` : ''}
          </div>
          <button onclick="window.closeModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 flex items-center justify-center transition-colors">
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <!-- Details Content -->
        <div class="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span class="font-bold text-slate-700 dark:text-slate-300"><i class="fas fa-${cat?.icon || 'tag'} mr-1 text-indigo-500"></i>${cat?.name || 'General'}</span>
              <span>&bull;</span>
              <span>Report ID: ${item.id}</span>
            </div>
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">${item.title}</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">${item.description}</p>
          </div>

          <!-- Attributes Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Campus Location</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">${loc?.name || 'Campus'}</span>
              <span class="text-[11px] text-slate-500 block truncate">${item.locationDetail || loc?.zone}</span>
            </div>

            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Timestamp</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">${new Date(item.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              <span class="text-[11px] text-slate-500 block">${new Date(item.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Brand & Color</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">${item.brand || 'Unbranded'} &bull; ${item.primaryColor || 'N/A'}</span>
            </div>
          </div>

          <!-- Tags -->
          ${item.tags && item.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1.5">
              ${item.tags.map(t => `<span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">#${t}</span>`).join('')}
            </div>
          ` : ''}

          <!-- AI Matches Section for this item -->
          ${!isResolved ? `
            <div class="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <i class="fas fa-sparkles text-indigo-500"></i>
                  Opposite-Type AI Candidates (${matches.length})
                </span>
              </div>

              ${matches.length > 0 ? `
                <div class="space-y-2">
                  ${matches.slice(0, 2).map(m => `
                    <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <img src="${m.targetItem.photo}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
                        <div>
                          <div class="flex items-center gap-1.5">
                            <span class="px-1.5 py-0.2 rounded font-black text-[9px] ${m.totalScore >= 80 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'}">${m.totalScore}% Match</span>
                            <h5 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">${m.targetItem.title}</h5>
                          </div>
                          <p class="text-[10px] text-slate-400 line-clamp-1">${m.explanation}</p>
                        </div>
                      </div>

                      <button onclick="window.openMatchModal('${item.type === 'lost' ? item.id : m.targetItem.id}', '${item.type === 'found' ? item.id : m.targetItem.id}')" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex-shrink-0">
                        Compare &rarr;
                      </button>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p class="text-xs text-slate-500 dark:text-slate-400">No high-confidence match discovered yet. The system will alert the reporter when a matching item is logged.</p>
              `}
            </div>
          ` : ''}

          <!-- Reporter Contact Info Card -->
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                ${item.contactName ? item.contactName.charAt(0) : 'U'}
              </div>
              <div>
                <span class="font-bold text-slate-800 dark:text-slate-200 block">${item.contactName || 'Anonymous Student'}</span>
                <span class="text-[11px] text-slate-400">${item.contactEmail || 'Verified Campus Account'}</span>
              </div>
            </div>

            <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <i class="fas fa-shield-alt"></i> Verified Reporter
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
}
