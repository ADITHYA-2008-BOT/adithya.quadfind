/**
 * Quad Find — Explore & Search Component
 */

import { appStore } from '../state.js';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../data.js';
import { findMatchesForItem } from '../aiMatcher.js';

function formatTimeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export function renderExplore() {
  const items = appStore.getFilteredItems();
  const allItems = appStore.getItems();
  const activeType = appStore.selectedType;
  const activeCat = appStore.selectedCategory;
  const activeLoc = appStore.selectedLocation;
  const activeTimeframe = appStore.selectedTimeframe;
  const activeSort = appStore.sortBy;
  const viewMode = appStore.viewMode;

  return `
    <div class="space-y-6 animate-fadeIn">
      <!-- Search & Filters Header Bar -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <!-- Top Search Input & View Toggle -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div class="relative flex-1">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              id="explore-search-input"
              value="${appStore.searchQuery}"
              oninput="window.handleSearchInput(this.value)"
              placeholder="Search reports by item name, brand, color, stickers, or tags..."
              class="w-full pl-11 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            ${appStore.searchQuery ? `
              <button onclick="window.clearSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm">
                <i class="fas fa-times-circle"></i>
              </button>
            ` : ''}
          </div>

          <div class="flex items-center gap-2 justify-end">
            <!-- Grid/List View Toggle -->
            <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button onclick="window.setViewMode('grid')" class="p-2 rounded-lg text-xs font-bold ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-800'} transition-all">
                <i class="fas fa-th-large"></i>
              </button>
              <button onclick="window.setViewMode('list')" class="p-2 rounded-lg text-xs font-bold ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-800'} transition-all">
                <i class="fas fa-list"></i>
              </button>
            </div>

            <!-- New Report Button -->
            <button onclick="window.openReportModal()" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 flex-shrink-0">
              <i class="fas fa-plus"></i>
              <span>Report Item</span>
            </button>
          </div>
        </div>

        <!-- Filter Row 1: Status Chips -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span class="text-slate-400 font-bold uppercase text-[10px] tracking-wider flex-shrink-0 mr-1">Status:</span>
          
          <button onclick="window.setTypeFilter('all')" class="px-3.5 py-1.5 rounded-full font-bold transition-all flex-shrink-0 ${activeType === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}">
            All Items (${allItems.length})
          </button>
          
          <button onclick="window.setTypeFilter('lost')" class="px-3.5 py-1.5 rounded-full font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${activeType === 'lost' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'}">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Lost Only (${allItems.filter(i => i.type === 'lost' && i.status !== 'resolved').length})
          </button>
          
          <button onclick="window.setTypeFilter('found')" class="px-3.5 py-1.5 rounded-full font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${activeType === 'found' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'}">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Found Only (${allItems.filter(i => i.type === 'found' && i.status !== 'resolved').length})
          </button>

          <button onclick="window.setTypeFilter('resolved')" class="px-3.5 py-1.5 rounded-full font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${activeType === 'resolved' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'}">
            <i class="fas fa-check-double text-[10px]"></i>
            Resolved (${allItems.filter(i => i.status === 'resolved').length})
          </button>
        </div>

        <!-- Filter Row 2: Category, Location, Timeframe & Sort Selectors -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <!-- Category Selector -->
          <div class="relative">
            <select onchange="window.setCategoryFilter(this.value)" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="all" ${activeCat === 'all' ? 'selected' : ''}>All Categories</option>
              ${CATEGORIES.map(c => `
                <option value="${c.id}" ${activeCat === c.id ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Location Selector -->
          <div class="relative">
            <select onchange="window.setLocationFilter(this.value)" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="all" ${activeLoc === 'all' ? 'selected' : ''}>All Campus Buildings</option>
              ${CAMPUS_LOCATIONS.map(l => `
                <option value="${l.id}" ${activeLoc === l.id ? 'selected' : ''}>${l.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Timeframe Selector -->
          <div class="relative">
            <select onchange="window.setTimeframeFilter(this.value)" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="all" ${activeTimeframe === 'all' ? 'selected' : ''}>Any Time</option>
              <option value="today" ${activeTimeframe === 'today' ? 'selected' : ''}>Past 24 Hours</option>
              <option value="3days" ${activeTimeframe === '3days' ? 'selected' : ''}>Past 3 Days</option>
              <option value="week" ${activeTimeframe === 'week' ? 'selected' : ''}>Past Week</option>
            </select>
          </div>

          <!-- Sort Selector -->
          <div class="relative">
            <select onchange="window.setSortBy(this.value)" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="matches" ${activeSort === 'matches' ? 'selected' : ''}>⚡ AI Matches First</option>
              <option value="newest" ${activeSort === 'newest' ? 'selected' : ''}>🕒 Newest First</option>
              <option value="oldest" ${activeSort === 'oldest' ? 'selected' : ''}>📅 Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Item Feed Container -->
      ${items.length > 0 ? `
        <div class="${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'space-y-4'}">
          ${items.map(item => renderItemCard(item, allItems, viewMode)).join('')}
        </div>
      ` : `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 text-2xl mb-4">
            <i class="fas fa-filter"></i>
          </div>
          <h3 class="font-bold text-slate-800 dark:text-slate-200 text-base">No reports match your active filters</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">Try clearing your search query or selecting "All Categories" and "All Campus Buildings".</p>
          <button onclick="window.resetFilters()" class="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs">
            Reset All Filters
          </button>
        </div>
      `}
    </div>
  `;
}

function renderItemCard(item, allItems, viewMode) {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === item.locationId);
  const cat = CATEGORIES.find(c => c.id === item.category);
  const isResolved = item.status === 'resolved';
  
  // Look for potential opposite-type AI matches
  const matches = !isResolved ? findMatchesForItem(item, allItems, 65) : [];
  const topMatch = matches[0];

  let typeBadge = '';
  if (isResolved) {
    typeBadge = `<span class="px-2 py-0.5 rounded-md bg-indigo-950/90 border border-indigo-500/30 text-indigo-300 font-bold text-[10px] uppercase tracking-wide flex items-center gap-1"><i class="fas fa-check-circle text-indigo-400"></i> Resolved</span>`;
  } else if (item.type === 'lost') {
    typeBadge = `<span class="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wide shadow-sm flex items-center gap-1"><i class="fas fa-search"></i> Lost</span>`;
  } else {
    typeBadge = `<span class="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wide shadow-sm flex items-center gap-1"><i class="fas fa-hand-holding-heart"></i> Found</span>`;
  }

  if (viewMode === 'list') {
    return `
      <div class="bg-white dark:bg-slate-900 border ${isResolved ? 'border-slate-200 dark:border-slate-800 opacity-75' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400/50'} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
            <img src="${item.photo}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
            <div class="absolute top-1 left-1">${typeBadge}</div>
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span class="font-semibold text-slate-700 dark:text-slate-300">${cat?.name || 'General'}</span>
              <span>&bull;</span>
              <span><i class="fas fa-map-pin text-indigo-400 mr-1"></i>${loc?.name || 'Campus'}</span>
              <span>&bull;</span>
              <span>${formatTimeAgo(item.dateTime)}</span>
            </div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">${item.title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">${item.description}</p>
            
            ${topMatch ? `
              <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                <i class="fas fa-sparkles text-indigo-500"></i>
                ${topMatch.totalScore}% AI Match with opposite report
              </div>
            ` : ''}
          </div>
        </div>

        <div class="flex items-center gap-2 justify-end">
          ${topMatch ? `
            <button onclick="window.openMatchModal('${item.type === 'lost' ? item.id : topMatch.targetId}', '${item.type === 'found' ? item.id : topMatch.targetId}')" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <i class="fas fa-bolt"></i>
              <span>Review Match (${topMatch.totalScore}%)</span>
            </button>
          ` : `
            <button onclick="window.openItemDetailModal('${item.id}')" class="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs">
              View Details
            </button>
          `}
        </div>
      </div>
    `;
  }

  // Grid Card Layout
  return `
    <div class="bg-white dark:bg-slate-900 border ${isResolved ? 'border-slate-200 dark:border-slate-800 opacity-80' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400/50'} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <!-- Photo Container -->
        <div class="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onclick="window.openItemDetailModal('${item.id}')">
          <img src="${item.photo}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
          <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            ${typeBadge}
            ${item.reward ? `<span class="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase"><i class="fas fa-award"></i> Reward</span>` : ''}
          </div>
          <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-white font-medium text-[10px]">
            ${formatTimeAgo(item.dateTime)}
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-4 space-y-2.5">
          <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span class="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <i class="fas fa-${cat?.icon || 'tag'} text-indigo-400 text-[10px]"></i>
              ${cat?.name || 'General'}
            </span>
            <span><i class="fas fa-eye mr-1 text-[10px]"></i>${item.views || 1}</span>
          </div>

          <h3 class="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer" onclick="window.openItemDetailModal('${item.id}')">
            ${item.title}
          </h3>

          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            ${item.description}
          </p>

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <i class="fas fa-map-marker-alt text-teal-500 text-[11px]"></i>
            <span class="truncate font-medium">${loc?.name || 'Campus'} &bull; ${item.locationDetail || loc?.zone}</span>
          </div>

          <!-- AI Match Highlight Chip if any -->
          ${topMatch ? `
            <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300 font-bold text-[11px]">
                <i class="fas fa-sparkles text-indigo-500 animate-pulse"></i>
                <span>${topMatch.totalScore}% Match Candidate</span>
              </div>
              <span class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 underline cursor-pointer" onclick="window.openMatchModal('${item.type === 'lost' ? item.id : topMatch.targetId}', '${item.type === 'found' ? item.id : topMatch.targetId}')">Compare &rarr;</span>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-4 pt-0">
        <div class="grid grid-cols-2 gap-2">
          <button onclick="window.openItemDetailModal('${item.id}')" class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors text-center">
            Details
          </button>
          
          ${topMatch ? `
            <button onclick="window.openMatchModal('${item.type === 'lost' ? item.id : topMatch.targetId}', '${item.type === 'found' ? item.id : topMatch.targetId}')" class="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors text-center flex items-center justify-center gap-1 shadow-sm">
              <i class="fas fa-bolt text-[10px]"></i>
              <span>Match (${topMatch.totalScore}%)</span>
            </button>
          ` : `
            <button onclick="window.openAIMatchesForItem('${item.id}')" class="py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-bold text-xs transition-colors text-center flex items-center justify-center gap-1">
              <i class="fas fa-brain text-[10px]"></i>
              <span>Run AI Scan</span>
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}
