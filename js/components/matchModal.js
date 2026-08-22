/**
 * Quad Find — Side-by-Side Match Comparison & Resolution Modal
 */

import { appStore } from '../state.js';
import { CAMPUS_LOCATIONS, SAFE_EXCHANGE_HUBS } from '../data.js';
import { compareItems } from '../aiMatcher.js';
import { showToast } from './toasts.js';

export function openMatchModal(lostId, foundId) {
  const lostItem = appStore.getItemById(lostId);
  const foundItem = appStore.getItemById(foundId);

  if (!lostItem || !foundItem) {
    showToast('Match item details not found', 'warning');
    return;
  }

  const matchData = compareItems(lostItem, foundItem);
  const locLost = CAMPUS_LOCATIONS.find(l => l.id === lostItem.locationId);
  const locFound = CAMPUS_LOCATIONS.find(l => l.id === foundItem.locationId);

  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const isHigh = matchData.totalScore >= 80;
  const badgeClass = isHigh ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950';

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div class="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
              <i class="fas fa-balance-scale"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">AI Match Verification</h3>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${badgeClass}">
                  ${matchData.totalScore}% Match
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">Review side-by-side details before confirming ownership.</p>
            </div>
          </div>
          
          <button onclick="window.closeModal()" class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors">
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <!-- AI Reasoning Summary Banner -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/40 text-white shadow-md">
            <div class="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <i class="fas fa-sparkles text-indigo-400"></i>
              Quad Neural Explanation
            </div>
            <p class="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              ${matchData.explanation}
            </p>

            <!-- 4-Factor Breakdown Metrics -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-indigo-900/60 text-xs">
              <div class="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                <span class="text-[10px] text-slate-400 block font-semibold uppercase">Visual Match</span>
                <span class="text-base font-black text-indigo-400">${matchData.factors.visual}%</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                <span class="text-[10px] text-slate-400 block font-semibold uppercase">Description Match</span>
                <span class="text-base font-black text-teal-400">${matchData.factors.semantic}%</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                <span class="text-[10px] text-slate-400 block font-semibold uppercase">Spatial Proximity</span>
                <span class="text-base font-black text-emerald-400">${matchData.factors.spatial}%</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                <span class="text-[10px] text-slate-400 block font-semibold uppercase">Time Proximity</span>
                <span class="text-base font-black text-amber-400">${matchData.factors.temporal}%</span>
              </div>
            </div>
          </div>

          <!-- Side-by-Side Comparison Columns -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Left: Lost Item -->
            <div class="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wide">
                  Reported Lost
                </span>
                <span class="text-xs font-bold text-slate-600 dark:text-slate-400">${lostItem.contactName}</span>
              </div>

              <div class="aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-amber-300 dark:border-amber-900">
                <img src="${lostItem.photo}" alt="${lostItem.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'" />
              </div>

              <div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">${lostItem.title}</h4>
                <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">${lostItem.description}</p>
              </div>

              <div class="space-y-1 text-xs pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-slate-600 dark:text-slate-400">
                <div><span class="font-bold text-slate-700 dark:text-slate-300">Location:</span> ${locLost?.name || 'Campus'} (${lostItem.locationDetail || 'Main Area'})</div>
                <div><span class="font-bold text-slate-700 dark:text-slate-300">Time:</span> ${new Date(lostItem.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                ${lostItem.brand ? `<div><span class="font-bold text-slate-700 dark:text-slate-300">Brand:</span> ${lostItem.brand}</div>` : ''}
                ${lostItem.primaryColor ? `<div><span class="font-bold text-slate-700 dark:text-slate-300">Color:</span> ${lostItem.primaryColor}</div>` : ''}
              </div>
            </div>

            <!-- Right: Found Item -->
            <div class="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wide">
                  Reported Found
                </span>
                <span class="text-xs font-bold text-slate-600 dark:text-slate-400">${foundItem.contactName}</span>
              </div>

              <div class="aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-emerald-300 dark:border-emerald-900">
                <img src="${foundItem.photo}" alt="${foundItem.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'" />
              </div>

              <div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">${foundItem.title}</h4>
                <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">${foundItem.description}</p>
              </div>

              <div class="space-y-1 text-xs pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 text-slate-600 dark:text-slate-400">
                <div><span class="font-bold text-slate-700 dark:text-slate-300">Location:</span> ${locFound?.name || 'Campus'} (${foundItem.locationDetail || 'Main Area'})</div>
                <div><span class="font-bold text-slate-700 dark:text-slate-300">Time:</span> ${new Date(foundItem.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                ${foundItem.brand ? `<div><span class="font-bold text-slate-700 dark:text-slate-300">Brand:</span> ${foundItem.brand}</div>` : ''}
                ${foundItem.primaryColor ? `<div><span class="font-bold text-slate-700 dark:text-slate-300">Color:</span> ${foundItem.primaryColor}</div>` : ''}
              </div>
            </div>
          </div>

          <!-- Safe Resolution Exchange Card -->
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <div class="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <i class="fas fa-shield-check text-indigo-500"></i>
              Safe Campus Handshake & Resolution
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Designated Safe Pickup Hub *
                </label>
                <select id="resolve-hub-select" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium">
                  ${SAFE_EXCHANGE_HUBS.map(h => `
                    <option value="${h.id}">${h.name} (${h.location})</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1">
                  Ownership Verification Note *
                </label>
                <input
                  type="text"
                  id="resolve-verification-answer"
                  value="Matched custom stickers and clip"
                  placeholder="e.g. Student ID verified, lock screen passcode match"
                  class="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs"
                />
              </div>
            </div>

            <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 text-xs font-medium flex items-center gap-2">
              <i class="fas fa-info-circle text-indigo-500"></i>
              <span>Accepting this match will mark both reports as <strong>Resolved</strong> and generate a secure 6-digit claim code.</span>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <button onclick="window.closeModal()" class="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors">
              Cancel / Keep Reviewing
            </button>
            <button onclick="window.confirmAndResolveMatch('${lostItem.id}', '${foundItem.id}')" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2">
              <i class="fas fa-check-double"></i>
              <span>Accept Match & Mark Resolved</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function openInstantMatchResults(sourceItem, matches) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
              <i class="fas fa-sparkles"></i>
            </div>
            <div>
              <h3 class="text-lg font-black">AI Found ${matches.length} Potential ${matches.length === 1 ? 'Match' : 'Matches'}!</h3>
              <p class="text-xs text-slate-300">Your report was published and automatically compared against campus logs.</p>
            </div>
          </div>

          <button onclick="window.closeModal()" class="text-slate-400 hover:text-white text-lg">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Top ranked candidates discovered for <strong>"${sourceItem.title}"</strong>:
          </p>

          <div class="space-y-3">
            ${matches.map(m => `
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <img src="${m.targetItem.photo}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'" />
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2 py-0.5 rounded-full ${m.totalScore >= 80 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'} font-black text-[10px]">
                        ${m.totalScore}% Match
                      </span>
                      <span class="text-[10px] font-bold text-slate-400 uppercase">${m.targetItem.type}</span>
                    </div>
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">${m.targetItem.title}</h4>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">${m.explanation}</p>
                  </div>
                </div>

                <button onclick="window.openMatchModal('${sourceItem.type === 'lost' ? sourceItem.id : m.targetItem.id}', '${sourceItem.type === 'found' ? sourceItem.id : m.targetItem.id}')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex-shrink-0 shadow-sm">
                  Review Match &rarr;
                </button>
              </div>
            `).join('')}
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button onclick="window.closeModal()" class="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function confirmAndResolveMatch(lostId, foundId) {
  const hubSelect = document.getElementById('resolve-hub-select');
  const answerInput = document.getElementById('resolve-verification-answer');
  
  const hubId = hubSelect ? hubSelect.value : 'police_desk';
  const hubObj = SAFE_EXCHANGE_HUBS.find(h => h.id === hubId) || SAFE_EXCHANGE_HUBS[0];
  const answer = answerInput ? answerInput.value : 'Verified in person';

  const record = appStore.resolveMatch(lostId, foundId, {
    hubId: hubObj.id,
    hubName: hubObj.name,
    answer
  });

  if (!record) return;

  // Trigger celebration confetti
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  showToast('Match confirmed! Reports marked as Resolved.', 'success');

  // Render Success Handshake Certificate Modal
  renderClaimConfirmationModal(record);
}

function renderClaimConfirmationModal(record) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center space-y-6">
        
        <!-- Big Success Icon -->
        <div class="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-4xl mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
          <i class="fas fa-check"></i>
        </div>

        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
            Safe Handshake Confirmed
          </span>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-3">
            Item Successfully Reunited!
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Both reports have been marked as <strong>Resolved</strong>. Proceed to the safe campus pickup station.
          </p>
        </div>

        <!-- Claim Code Box -->
        <div class="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-2">
          <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Campus Pickup Claim Code</span>
          <div class="text-3xl font-black tracking-widest text-emerald-400 font-mono">
            ${record.claimCode}
          </div>
          <p class="text-[11px] text-slate-400">
            Show this code at <strong class="text-slate-200">${record.hubName}</strong> to collect your item.
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button onclick="window.closeModal()" class="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md">
            Done & Return to Feed
          </button>
        </div>
      </div>
    </div>
  `;
}
