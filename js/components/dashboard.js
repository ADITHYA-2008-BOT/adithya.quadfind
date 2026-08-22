/**
 * Quad Find — Dashboard Component
 */

import { appStore } from '../state.js';
import { CAMPUS_LOCATIONS } from '../data.js';
import { scanAllMatchPairs } from '../aiMatcher.js';

export function renderDashboard() {
  const stats = appStore.getDashboardStats();
  const items = appStore.getItems();
  const topPairs = scanAllMatchPairs(items, 75).slice(0, 3);

  // Group open items by building
  const buildingCounts = CAMPUS_LOCATIONS.map(loc => {
    const count = items.filter(i => i.locationId === loc.id && i.status === 'open').length;
    return { ...loc, count };
  }).sort((a, b) => b.count - a.count);

  return `
    <div class="space-y-8 animate-fadeIn">
      <!-- Top Banner / Hero -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl">
        <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="max-w-xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Campus Lost & Found Engine
            </div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Reconnecting lost items with <span class="bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">smart AI matching</span>
            </h1>
            <p class="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              Quad Find compares photo features, textual descriptions, campus GPS proximity, and loss timestamps to pair lost belongings in minutes.
            </p>
          </div>
          
          <div class="flex flex-wrap gap-3">
            <button onclick="window.openReportModal('lost')" class="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <i class="fas fa-search-location"></i>
              I Lost Something
            </button>
            <button onclick="window.openReportModal('found')" class="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <i class="fas fa-hand-holding-heart"></i>
              I Found Something
            </button>
          </div>
        </div>

        <!-- Quick Info Micro-Bar -->
        <div class="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div class="flex items-center gap-2 text-slate-300">
            <i class="fas fa-shield-check text-emerald-400 text-base"></i>
            <span>Verified safe campus pickup hubs</span>
          </div>
          <div class="flex items-center gap-2 text-slate-300">
            <i class="fas fa-bolt text-amber-400 text-base"></i>
            <span>Instant real-time similarity score</span>
          </div>
          <div class="flex items-center gap-2 text-slate-300">
            <i class="fas fa-map-marker-alt text-indigo-400 text-base"></i>
            <span>Campus building spatial mapping</span>
          </div>
          <div class="flex items-center gap-2 text-slate-300">
            <i class="fas fa-qrcode text-teal-400 text-base"></i>
            <span>6-digit secure handshake claims</span>
          </div>
        </div>
      </div>

      <!-- High-Level KPI Metric Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <!-- Lost -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Open Lost Reports</span>
            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-bold">
              <i class="fas fa-search"></i>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white">${stats.lostCount}</span>
            <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">Awaiting Match</span>
          </div>
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Reported across campus zones</p>
        </div>

        <!-- Found -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Turned-In Items</span>
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
              <i class="fas fa-box-open"></i>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white">${stats.foundCount}</span>
            <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">In Safekeeping</span>
          </div>
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Logged by students & staff</p>
        </div>

        <!-- Resolved -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reunited Items</span>
            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg font-bold">
              <i class="fas fa-check-double"></i>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white">${stats.resolvedCount}</span>
            <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">${stats.recoveryRate}% Rate</span>
          </div>
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Successfully claimed & verified</p>
        </div>

        <!-- AI Match Rate -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Match Engine</span>
            <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-lg font-bold">
              <i class="fas fa-brain"></i>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white">${stats.pendingMatchesCount}</span>
            <span class="text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">${stats.highMatchCount} High Match</span>
          </div>
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Avg. resolve time &lt; ${stats.avgResolutionHours}h</p>
        </div>
      </div>

      <!-- Actionable AI Recommendations Section -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-sparkles text-indigo-500"></i>
              Top AI Matches Awaiting Confirmation
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">The neural algorithm detected these high-confidence candidate pairings.</p>
          </div>
          <button onclick="window.switchTab('ai-hub')" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
            View All ${topPairs.length} AI Matches <i class="fas fa-arrow-right text-[10px]"></i>
          </button>
        </div>

        ${topPairs.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${topPairs.map(pair => renderTopPairCard(pair)).join('')}
          </div>
        ` : `
          <div class="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 text-xl mb-3">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="font-bold text-slate-800 dark:text-slate-200 text-sm">All top matches have been reviewed</h3>
            <p class="text-xs text-slate-500 mt-1">New matches will automatically appear here when new reports are submitted.</p>
          </div>
        `}
      </div>

      <!-- Split View: Campus Hotspots & Live Activity Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Hotspots Breakdown (2 cols on lg) -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i class="fas fa-map-marked-alt text-teal-500"></i>
                Active Campus Hotspots
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Current volume of open lost & found reports by building</p>
            </div>
            <button onclick="window.switchTab('campus-map')" class="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
              Open Interactive Map
            </button>
          </div>

          <div class="space-y-3">
            ${buildingCounts.map(b => `
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer" onclick="window.filterByLocation('${b.id}')">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                    <i class="fas fa-building"></i>
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">${b.name}</h4>
                    <span class="text-[11px] text-slate-500 dark:text-slate-400">${b.zone}</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold px-2.5 py-1 rounded-full ${b.count > 0 ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}">
                    ${b.count} open ${b.count === 1 ? 'item' : 'items'}
                  </span>
                  <i class="fas fa-chevron-right text-slate-400 text-xs"></i>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- How it Works & Trust Column -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <i class="fas fa-microchip text-indigo-500"></i>
              How Quad Find Works
            </h3>

            <div class="space-y-4 text-xs">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</div>
                <div>
                  <h4 class="font-bold text-slate-800 dark:text-slate-200">Submit a 60s Report</h4>
                  <p class="text-slate-500 dark:text-slate-400 mt-0.5">Upload a photo, write key tags, and pin the campus location.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</div>
                <div>
                  <h4 class="font-bold text-slate-800 dark:text-slate-200">Quad AI Vector & Time Scan</h4>
                  <p class="text-slate-500 dark:text-slate-400 mt-0.5">Calculates multi-factor score: Photo (27%), Text (38%), Spatial (20%), Time delta (15%).</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h4 class="font-bold text-slate-800 dark:text-slate-200">Secure Safe Handshake</h4>
                  <p class="text-slate-500 dark:text-slate-400 mt-0.5">Meet at 24/7 Campus Safety Desk with a verified 6-digit claim code.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-teal-50 dark:from-indigo-950/40 dark:to-teal-950/30 border border-indigo-100 dark:border-indigo-800/40 text-xs">
            <div class="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300">
              <i class="fas fa-sparkles text-indigo-500"></i>
              Hackathon Live Demo Ready
            </div>
            <p class="text-slate-600 dark:text-slate-400 mt-1">
              Click any match card or explore item to test instant AI comparison & resolution workflows in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTopPairCard(pair) {
  const badgeColor = pair.totalScore >= 85 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950';

  return `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-400/50 transition-all flex flex-col justify-between">
      <div>
        <!-- Match Score Header -->
        <div class="flex items-center justify-between mb-3">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black ${badgeColor} shadow-sm">
            <i class="fas fa-bolt text-[10px]"></i>
            ${pair.totalScore}% AI Match
          </span>
          <span class="text-[11px] font-medium text-slate-500">
            ${pair.confidenceLevel.toUpperCase()} CONFIDENCE
          </span>
        </div>

        <!-- Comparative Thumbnails -->
        <div class="grid grid-cols-2 gap-2 mb-3">
          <!-- Lost Thumbnail -->
          <div class="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 aspect-video">
            <img src="${pair.lostItem.photo}" alt="${pair.lostItem.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
            <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500/90 text-slate-950 text-[9px] font-black uppercase">Lost</span>
          </div>

          <!-- Found Thumbnail -->
          <div class="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/50 aspect-video">
            <img src="${pair.foundItem.photo}" alt="${pair.foundItem.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
            <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500/90 text-slate-950 text-[9px] font-black uppercase">Found</span>
          </div>
        </div>

        <!-- Titles -->
        <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">${pair.lostItem.title}</h4>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          ${pair.explanation}
        </p>

        <!-- Factor Mini-Bars -->
        <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-4 gap-1 text-center text-[10px]">
          <div>
            <span class="text-slate-400 block text-[9px]">Visual</span>
            <span class="font-bold text-slate-700 dark:text-slate-300">${pair.factors.visual}%</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[9px]">Text</span>
            <span class="font-bold text-slate-700 dark:text-slate-300">${pair.factors.semantic}%</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[9px]">Spatial</span>
            <span class="font-bold text-slate-700 dark:text-slate-300">${pair.factors.spatial}%</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[9px]">Time</span>
            <span class="font-bold text-slate-700 dark:text-slate-300">${pair.factors.temporal}%</span>
          </div>
        </div>
      </div>

      <button onclick="window.openMatchModal('${pair.lostItem.id}', '${pair.foundItem.id}')" class="mt-4 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2">
        <i class="fas fa-balance-scale"></i>
        Compare & Confirm Match
      </button>
    </div>
  `;
}
