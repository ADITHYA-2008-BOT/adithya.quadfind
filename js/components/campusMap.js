/**
 * Quad Find — Interactive Campus Hotspots Map Component
 */

import { appStore } from '../state.js';
import { CAMPUS_LOCATIONS } from '../data.js';

export function renderCampusMap() {
  const items = appStore.getItems();
  const selectedBuildingId = appStore.selectedLocation !== 'all' ? appStore.selectedLocation : 'library';
  const activeBuilding = CAMPUS_LOCATIONS.find(b => b.id === selectedBuildingId) || CAMPUS_LOCATIONS[0];
  const buildingItems = items.filter(i => i.locationId === activeBuilding.id && i.status === 'open');

  // Building coordinates on SVG canvas (width 800, height 500)
  const mapCoordinates = {
    'parking_structure': { x: 180, y: 80, labelX: 180, labelY: 60 },
    'science_quad': { x: 420, y: 110, labelX: 420, labelY: 90 },
    'engineering_hall': { x: 620, y: 90, labelX: 620, labelY: 70 },
    'quad_lawns': { x: 380, y: 240, labelX: 380, labelY: 220 },
    'library': { x: 180, y: 270, labelX: 180, labelY: 250 },
    'student_union': { x: 580, y: 280, labelX: 580, labelY: 260 },
    'rec_center': { x: 380, y: 410, labelX: 380, labelY: 390 }
  };

  return `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <i class="fas fa-map-marked-alt"></i> Spatial Proximity Graph
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Interactive Campus Hotspots Map
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select any campus building to inspect active lost reports, turned-in items, and proximity clusters.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.openReportModal()" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
            <i class="fas fa-plus"></i> Report at Location
          </button>
        </div>
      </div>

      <!-- Map & Building Details Split Container -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- SVG Interactive Map Canvas (2 cols) -->
        <div class="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <!-- Map Legend Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs z-10 mb-2">
            <span class="font-bold text-slate-300 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
              Live Campus Map Simulation
            </span>
            <div class="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Lost Items</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Found Items</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Safe Hub</span>
            </div>
          </div>

          <!-- SVG Canvas -->
          <div class="relative w-full aspect-[16/10] bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
            <svg viewBox="0 0 800 500" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
              <!-- Background Campus Paths / Grid -->
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.8" opacity="0.6"/>
                </pattern>
                <linearGradient id="quadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#064e3b" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#065f46" stop-opacity="0.1"/>
                </linearGradient>
              </defs>

              <rect width="800" height="500" fill="url(#grid)" />

              <!-- Campus Quad Central Lawn Area -->
              <ellipse cx="400" cy="250" rx="280" ry="160" fill="url(#quadGrad)" stroke="#047857" stroke-width="1.5" stroke-dasharray="6,4" />

              <!-- Connecting Walkway Lines -->
              <line x1="180" y1="80" x2="420" y2="110" stroke="#334155" stroke-width="3" stroke-dasharray="4,4" />
              <line x1="420" y1="110" x2="620" y2="90" stroke="#334155" stroke-width="3" stroke-dasharray="4,4" />
              <line x1="180" y1="270" x2="380" y2="240" stroke="#334155" stroke-width="3" />
              <line x1="380" y1="240" x2="580" y2="280" stroke="#334155" stroke-width="3" />
              <line x1="420" y1="110" x2="380" y2="240" stroke="#334155" stroke-width="3" />
              <line x1="380" y1="240" x2="380" y2="410" stroke="#334155" stroke-width="3" />
              <line x1="180" y1="80" x2="180" y2="270" stroke="#334155" stroke-width="2" stroke-dasharray="2,4" />
              <line x1="620" y1="90" x2="580" y2="280" stroke="#334155" stroke-width="2" stroke-dasharray="2,4" />

              <!-- Building Pin Markers -->
              ${CAMPUS_LOCATIONS.map(loc => {
                const coords = mapCoordinates[loc.id] || { x: 400, y: 250 };
                const locItems = items.filter(i => i.locationId === loc.id && i.status === 'open');
                const lostC = locItems.filter(i => i.type === 'lost').length;
                const foundC = locItems.filter(i => i.type === 'found').length;
                const isSelected = loc.id === activeBuilding.id;

                return `
                  <g class="cursor-pointer transition-transform hover:scale-110" onclick="window.selectMapBuilding('${loc.id}')">
                    <!-- Outer Selection Glow if active -->
                    ${isSelected ? `
                      <circle cx="${coords.x}" cy="${coords.y}" r="34" fill="#6366f1" fill-opacity="0.25" class="animate-pulse" />
                      <circle cx="${coords.x}" cy="${coords.y}" r="26" fill="none" stroke="#818cf8" stroke-width="2" stroke-dasharray="4,2" />
                    ` : ''}

                    <!-- Pin Base Circle -->
                    <circle cx="${coords.x}" cy="${coords.y}" r="20" fill="${isSelected ? '#4f46e5' : '#1e293b'}" stroke="${isSelected ? '#a5b4fc' : '#475569'}" stroke-width="2.5" />
                    
                    <!-- Building Icon Text -->
                    <text x="${coords.x}" y="${coords.y + 4}" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold" font-family="sans-serif">
                      ${locItems.length}
                    </text>

                    <!-- Building Name Label -->
                    <rect x="${coords.x - 70}" y="${coords.y + 24}" width="140" height="20" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#334155" stroke-width="1" />
                    <text x="${coords.x}" y="${coords.y + 37}" text-anchor="middle" fill="${isSelected ? '#a5b4fc' : '#cbd5e1'}" font-size="9.5" font-weight="bold" font-family="sans-serif">
                      ${loc.name.length > 20 ? loc.name.slice(0, 18) + '..' : loc.name}
                    </text>

                    <!-- Mini Lost/Found Indicators -->
                    ${lostC > 0 ? `
                      <circle cx="${coords.x - 12}" cy="${coords.y - 14}" r="5.5" fill="#f59e0b" stroke="#0f172a" stroke-width="1.5" />
                    ` : ''}
                    ${foundC > 0 ? `
                      <circle cx="${coords.x + 12}" cy="${coords.y - 14}" r="5.5" fill="#10b981" stroke="#0f172a" stroke-width="1.5" />
                    ` : ''}
                  </g>
                `;
              }).join('')}
            </svg>
          </div>

          <div class="mt-3 text-center text-slate-400 text-xs font-medium">
            💡 Click on any building node on the campus map to view all active reports at that spot.
          </div>
        </div>

        <!-- Building Detail Drawer (1 col) -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <!-- Selected Building Header -->
            <div class="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  ${activeBuilding.zone}
                </span>
                <span class="text-xs font-bold text-slate-500">${buildingItems.length} Active Items</span>
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white mt-2">${activeBuilding.name}</h3>
              
              <!-- Floors Tag Cloud -->
              <div class="mt-2 flex flex-wrap gap-1">
                ${activeBuilding.floors.map(f => `
                  <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">${f}</span>
                `).join('')}
              </div>
            </div>

            <!-- List of items in this building -->
            <div class="mt-4 space-y-3 max-h-[340px] overflow-y-auto pr-1">
              ${buildingItems.length > 0 ? buildingItems.map(item => `
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition-all cursor-pointer" onclick="window.openItemDetailModal('${item.id}')">
                  <div class="flex items-center gap-3">
                    <img src="${item.photo}" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1.5 mb-1">
                        <span class="px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${item.type === 'lost' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}">
                          ${item.type}
                        </span>
                        <span class="text-[10px] text-slate-400 truncate">${item.locationDetail || 'Main Area'}</span>
                      </div>
                      <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">${item.title}</h4>
                    </div>
                  </div>
                </div>
              `).join('') : `
                <div class="p-6 text-center text-slate-400 text-xs">
                  <i class="fas fa-check-circle text-emerald-400 text-xl mb-2 block"></i>
                  No open lost or found reports currently recorded at ${activeBuilding.name}.
                </div>
              `}
            </div>
          </div>

          <!-- Bottom Action -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button onclick="window.filterByLocation('${activeBuilding.id}')" class="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors">
              Filter in Explore
            </button>
            <button onclick="window.openReportModal('lost', '${activeBuilding.id}')" class="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors">
              Report Here
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
