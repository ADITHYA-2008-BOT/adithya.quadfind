/**
 * Quad Find — Main Application Controller
 */

import { appStore } from './state.js';
import { renderDashboard } from './components/dashboard.js';
import { renderExplore } from './components/explore.js';
import { renderAIHub } from './components/aiHub.js';
import { renderCampusMap } from './components/campusMap.js';
import { openReportModal, setReportType, applyDemoPreset, handlePhotoSelected, removeSelectedPhoto, handleReportSubmit } from './components/reportModal.js';
import { openMatchModal, openInstantMatchResults, confirmAndResolveMatch } from './components/matchModal.js';
import { openItemDetailModal } from './components/itemDetailModal.js';
import { showToast } from './components/toasts.js';

// Setup Global Window Bindings for inline HTML handlers
window.switchTab = function(tabName) {
  appStore.activeTab = tabName;
  updateNavState();
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.openReportModal = function(type = 'lost', locationId = 'library') {
  openReportModal(type, locationId);
};

window.setReportType = setReportType;
window.applyDemoPreset = applyDemoPreset;
window.handlePhotoSelected = handlePhotoSelected;
window.removeSelectedPhoto = removeSelectedPhoto;
window.handleReportSubmit = handleReportSubmit;

window.openMatchModal = openMatchModal;
window.openInstantMatchResults = openInstantMatchResults;
window.confirmAndResolveMatch = confirmAndResolveMatch;

window.openItemDetailModal = openItemDetailModal;

window.openAIMatchesForItem = function(itemId) {
  openItemDetailModal(itemId);
};

window.closeModal = function() {
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) modalContainer.innerHTML = '';
};

// Filter Handlers
let searchDebounceTimer = null;
window.handleSearchInput = function(val) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    appStore.searchQuery = val;
    renderCurrentView();
  }, 200);
};

window.clearSearch = function() {
  appStore.searchQuery = '';
  const input = document.getElementById('explore-search-input');
  if (input) input.value = '';
  renderCurrentView();
};

window.setTypeFilter = function(type) {
  appStore.selectedType = type;
  renderCurrentView();
};

window.setCategoryFilter = function(cat) {
  appStore.selectedCategory = cat;
  renderCurrentView();
};

window.setLocationFilter = function(loc) {
  appStore.selectedLocation = loc;
  renderCurrentView();
};

window.setTimeframeFilter = function(tf) {
  appStore.selectedTimeframe = tf;
  renderCurrentView();
};

window.setSortBy = function(sort) {
  appStore.sortBy = sort;
  renderCurrentView();
};

window.setViewMode = function(mode) {
  appStore.viewMode = mode;
  renderCurrentView();
};

window.resetFilters = function() {
  appStore.searchQuery = '';
  appStore.selectedType = 'all';
  appStore.selectedCategory = 'all';
  appStore.selectedLocation = 'all';
  appStore.selectedTimeframe = 'all';
  appStore.sortBy = 'matches';
  renderCurrentView();
};

window.filterByLocation = function(locationId) {
  appStore.selectedLocation = locationId;
  window.switchTab('explore');
};

window.selectMapBuilding = function(buildingId) {
  appStore.selectedLocation = buildingId;
  renderCurrentView();
};

window.triggerLiveRescan = function() {
  const icon = document.getElementById('rescan-icon');
  if (icon) icon.classList.add('fa-spin');

  showToast('Running deep campus neural rescan...', 'ai', 2000);

  setTimeout(() => {
    if (icon) icon.classList.remove('fa-spin');
    renderCurrentView();
    showToast('Campus rescan complete! All candidate pairs synchronized.', 'success');
  }, 900);
};

window.resetToSeedData = function() {
  if (confirm('Reset all Quad Find items and data back to initial seed dataset?')) {
    appStore.resetToSeedData();
    showToast('Dataset reset to original mock state', 'info');
  }
};

window.toggleDarkMode = function() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('quadfind_theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
};

function updateThemeIcon(isDark) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = isDark ? '<i class="fas fa-sun text-amber-400"></i>' : '<i class="fas fa-moon text-slate-600"></i>';
  }
}

function updateNavState() {
  const tabs = ['dashboard', 'explore', 'ai-hub', 'campus-map'];
  for (const t of tabs) {
    const desktopBtn = document.getElementById(`nav-${t}`);
    const mobileBtn = document.getElementById(`mobile-nav-${t}`);

    const isActive = appStore.activeTab === t;
    if (desktopBtn) {
      if (isActive) {
        desktopBtn.className = 'px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm transition-all flex items-center gap-2';
      } else {
        desktopBtn.className = 'px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-all flex items-center gap-2';
      }
    }

    if (mobileBtn) {
      if (isActive) {
        mobileBtn.className = 'flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px]';
      } else {
        mobileBtn.className = 'flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 font-semibold text-[10px]';
      }
    }
  }
}

function renderCurrentView() {
  const appContainer = document.getElementById('app-main-content');
  if (!appContainer) return;

  if (appStore.activeTab === 'dashboard') {
    appContainer.innerHTML = renderDashboard();
  } else if (appStore.activeTab === 'explore') {
    appContainer.innerHTML = renderExplore();
  } else if (appStore.activeTab === 'ai-hub') {
    appContainer.innerHTML = renderAIHub();
  } else if (appStore.activeTab === 'campus-map') {
    appContainer.innerHTML = renderCampusMap();
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Theme check
  const savedTheme = localStorage.getItem('quadfind_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon(isDark);

  // Subscribe state store
  appStore.subscribe(() => {
    updateNavState();
    renderCurrentView();
  });

  // Initial render
  updateNavState();
  renderCurrentView();
});
