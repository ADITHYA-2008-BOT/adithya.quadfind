/**
 * Quad Find — AI Matches Hub Component
 */

import { appStore } from '../state.js';
import { scanAllMatchPairs } from '../aiMatcher.js';

export function renderAIHub() {
  const items = appStore.getItems();
  const pairs = scanAllMatchPairs(items, 50);
  const highMatches = pairs.filter(p => p.totalScore >= 80);
  const moderateMatches = pairs.filter(p => p.totalScore >= 60 && p.totalScore < 80);

  return `
    <div class="space-y-6 animate-fadeIn">
      <!-- AI Hub Header & Statistics -->
      <div class="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/50 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <i class="fas fa-sparkles text-indigo-400"></i>
              Quad Neural Match Engine
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Smart Candidate Matches
            </h2>
            <p class="text-slate-300 text-sm mt-2 leading-relaxed">
              Quad Find continuously scans all newly submitted reports across visual features, semantic text, campus GPS coordinates, and timestamp deltas to find potential matches.
            </p>
          </div>

          <!-- Quick Stats Pills -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="px-4 py-3 rounded-xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md text-center">
              <span class="block text-2xl font-black text-emerald-400">${highMatches.length}</span>
              <span class="text-[11px] font-semibold text-slate-400 uppercase">High Confidence (&ge;80%)</span>
            </div>
            <div class="px-4 py-3 rounded-xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md text-center">
              <span class="block text-2xl font-black text-amber-400">${moderateMatches.length}</span>
              <span class="text-[11px] font-semibold text-slate-400 uppercase">Moderate (60-79%)</span>
            </div>
            <button onclick="window.triggerLiveRescan()" class="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all">
              <i class="fas fa-sync-alt" id="rescan-icon"></i>
              <span>Re-Scan Campus</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Match Cards Stream -->
      ${pairs.length > 0 ? `
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-list-check text-indigo-500"></i>
              Detected Matches Ready for Verification (${pairs.length})
            </h3>
            <span class="text-xs text-slate-500">Sorted by highest confidence score</span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            ${pairs.map(pair => renderHubPairCard(pair)).join('')}
          </div>
        </div>
      ` : `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto text-2xl mb-4">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3 class="font-bold text-slate-800 dark:text-slate-200 text-base">No active unmatched pairs</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">All high-confidence candidate reports have been resolved or claimed!</p>
          <button onclick="window.openReportModal()" class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
            Report a New Item
          </button>
        </div>
      `}
    </div>
  `;
}

function renderHubPairCard(pair) {
  const isHigh = pair.totalScore >= 80;
  const badgeClass = isHigh ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950';

  return `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <!-- Match Score & Confidence Banner -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-black ${badgeClass} shadow-sm flex items-center gap-1.5">
              <i class="fas fa-bolt text-[10px]"></i>
              ${pair.totalScore}% AI Match
            </span>
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">${pair.confidenceLevel.toUpperCase()} CONFIDENCE</span>
          </div>

          <span class="text-[11px] text-slate-400 font-medium">Pair ID: ${pair.lostItem.id.slice(-4)} &harr; ${pair.foundItem.id.slice(-4)}</span>
        </div>

        <!-- Comparative Side-by-Side Cards -->
        <div class="grid grid-cols-2 gap-3 my-4">
          <!-- Lost Item Side -->
          <div class="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wide">Reported Lost</span>
              <span class="text-[10px] text-slate-400"><i class="fas fa-user text-[9px] mr-1"></i>${pair.lostItem.contactName}</span>
            </div>

            <div class="aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img src="${pair.lostItem.photo}" alt="${pair.lostItem.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
            </div>

            <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">${pair.lostItem.title}</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">${pair.lostItem.description}</p>
            <div class="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
              <i class="fas fa-map-pin mr-1"></i>${pair.lostItem.locationDetail || 'Campus'}
            </div>
          </div>

          <!-- Found Item Side -->
          <div class="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wide">Reported Found</span>
              <span class="text-[10px] text-slate-400"><i class="fas fa-user-shield text-[9px] mr-1"></i>${pair.foundItem.contactName}</span>
            </div>

            <div class="aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img src="${pair.foundItem.photo}" alt="${pair.foundItem.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
            </div>

            <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">${pair.foundItem.title}</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">${pair.foundItem.description}</p>
            <div class="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
              <i class="fas fa-map-pin mr-1"></i>${pair.foundItem.locationDetail || 'Campus'}
            </div>
          </div>
        </div>

        <!-- AI Explanation Box -->
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs">
          <div class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] mb-1">
            <i class="fas fa-brain"></i>
            <span>AI Reasoning Analysis</span>
          </div>
          <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
            ${pair.explanation}
          </p>
        </div>

        <!-- 4-Factor Breakdown Progress Bars -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div class="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>Visual (${pair.factors.visual}%)</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-indigo-500 h-1.5 rounded-full" style="width: ${pair.factors.visual}%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>Text (${pair.factors.semantic}%)</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-teal-500 h-1.5 rounded-full" style="width: ${pair.factors.semantic}%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>Spatial (${pair.factors.spatial}%)</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${pair.factors.spatial}%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>Time (${pair.factors.temporal}%)</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${pair.factors.temporal}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison CTA Button -->
      <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button onclick="window.openMatchModal('${pair.lostItem.id}', '${pair.foundItem.id}')" class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm">
          <i class="fas fa-balance-scale"></i>
          <span>Compare Side-by-Side & Confirm Match</span>
        </button>
      </div>
    </div>
  `;
}
