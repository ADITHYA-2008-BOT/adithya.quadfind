/**
 * Quad Find — Report Submission Modal Component
 */

import { appStore } from '../state.js';
import { CATEGORIES, CAMPUS_LOCATIONS, DEMO_PRESETS } from '../data.js';
import { findMatchesForItem } from '../aiMatcher.js';
import { showToast } from './toasts.js';

let currentReportType = 'lost';
let uploadedPhotoDataUrl = '';

export function openReportModal(defaultType = 'lost', defaultLocationId = 'library') {
  currentReportType = defaultType;
  uploadedPhotoDataUrl = '';

  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl ${currentReportType === 'lost' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'} flex items-center justify-center text-lg font-bold">
              <i class="fas ${currentReportType === 'lost' ? 'fa-search-location' : 'fa-hand-holding-heart'}"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">Submit a Campus Report</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Quad AI will automatically scan opposite-type reports for instant matches.</p>
            </div>
          </div>
          
          <button onclick="window.closeModal()" class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors">
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form id="report-form" onsubmit="window.handleReportSubmit(event)" class="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          <!-- Report Type Switcher -->
          <div class="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button type="button" onclick="window.setReportType('lost')" id="btn-type-lost" class="py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${currentReportType === 'lost' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400'}">
              <i class="fas fa-search"></i>
              I Lost Something
            </button>
            <button type="button" onclick="window.setReportType('found')" id="btn-type-found" class="py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${currentReportType === 'found' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400'}">
              <i class="fas fa-hand-holding-heart"></i>
              I Found Something
            </button>
          </div>

          <!-- Quick Demo Presets Selector -->
          <div class="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60">
            <div class="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2">
              <span class="flex items-center gap-1.5"><i class="fas fa-magic text-indigo-500"></i> Fast Hackathon Demo Presets:</span>
              <span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">1-click autofill</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${DEMO_PRESETS.map((p, idx) => `
                <button type="button" onclick="window.applyDemoPreset(${idx})" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold hover:border-indigo-400 transition-all">
                  ${p.title.split(' ')[0]} ${p.title.split(' ')[1] || ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Section 1: Item Basic Info -->
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Item Title *
              </label>
              <input
                type="text"
                id="form-title"
                required
                placeholder="e.g., Apple AirPods Pro (2nd Gen) with Green Clip"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select id="form-category" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  ${CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Brand / Maker
                </label>
                <input
                  type="text"
                  id="form-brand"
                  placeholder="e.g. Apple, Hydro Flask, Bellroy"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Primary Color
                </label>
                <input
                  type="text"
                  id="form-color"
                  placeholder="e.g. White, Black, Grey, Brown"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Detailed Description & Unique Marks *
              </label>
              <textarea
                id="form-description"
                rows="3"
                required
                placeholder="Mention unique marks, stickers, scratches, case color, lock screen, keychain attachments, or serial details..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          <!-- Section 2: Photo Upload & Visual Capture -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Item Photo * <span class="text-[11px] font-normal text-slate-400">(Enables AI visual embedding similarity)</span>
            </label>

            <div id="photo-dropzone" class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-4 text-center transition-all bg-slate-50/50 dark:bg-slate-800/40">
              <input type="file" id="form-photo-file" accept="image/*" class="hidden" onchange="window.handlePhotoSelected(event)" />
              <input type="hidden" id="form-photo-url" value="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80" />

              <div id="photo-preview-box" class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-xl">
                  <i class="fas fa-camera"></i>
                </div>
                <div class="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <button type="button" onclick="document.getElementById('form-photo-file').click()" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Upload a photo</button> or take a snapshot
                </div>
                <p class="text-[10px] text-slate-400">PNG, JPG, WebP up to 10MB</p>
              </div>

              <div id="photo-preview-image-container" class="hidden relative rounded-xl overflow-hidden aspect-video max-h-48 mx-auto">
                <img id="photo-preview-image" src="" alt="Preview" class="w-full h-full object-cover" />
                <button type="button" onclick="window.removeSelectedPhoto()" class="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors text-xs">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Section 3: Campus Location & Timestamp -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Campus Building *
              </label>
              <select id="form-location" required class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                ${CAMPUS_LOCATIONS.map(l => `
                  <option value="${l.id}" ${l.id === defaultLocationId ? 'selected' : ''}>${l.name} (${l.zone})</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Specific Floor / Room / Area
              </label>
              <input
                type="text"
                id="form-location-detail"
                placeholder="e.g. 2nd Floor Quiet Study Desk #14"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Date & Time ${currentReportType === 'lost' ? 'Lost' : 'Found'} *
              </label>
              <input
                type="datetime-local"
                id="form-datetime"
                required
                value="${new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                ${currentReportType === 'lost' ? 'Optional Finder Reward' : 'Safe Hub Turned Into'}
              </label>
              <input
                type="text"
                id="form-reward"
                placeholder="${currentReportType === 'lost' ? 'e.g. $25 Reward or Free Coffee' : 'e.g. Turned into Library front desk'}"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Section 4: Contact Information -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <h4 class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <i class="fas fa-user-shield text-indigo-500"></i>
              Reporter Contact & Privacy
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                id="form-contact-name"
                required
                placeholder="Full Name *"
                value="Taylor Morgan"
                class="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
              <input
                type="email"
                id="form-contact-email"
                required
                placeholder="Campus Email *"
                value="tmorgan@campus.edu"
                class="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
              <input
                type="tel"
                id="form-contact-phone"
                placeholder="Phone (Optional)"
                value="(555) 345-9988"
                class="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
            </div>
            <p class="text-[10px] text-slate-400">
              🔒 Phone and direct contact details remain private until a safe verified match handshake is confirmed.
            </p>
          </div>

          <!-- Submit Action Button -->
          <div class="pt-2">
            <button type="submit" id="submit-report-btn" class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2">
              <i class="fas fa-sparkles"></i>
              <span>Submit & Run AI Match Scan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function setReportType(type) {
  currentReportType = type;
  const btnLost = document.getElementById('btn-type-lost');
  const btnFound = document.getElementById('btn-type-found');
  if (btnLost && btnFound) {
    if (type === 'lost') {
      btnLost.className = 'py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-amber-500 text-slate-950 shadow-md';
      btnFound.className = 'py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400';
    } else {
      btnLost.className = 'py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400';
      btnFound.className = 'py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 shadow-md';
    }
  }
}

export function applyDemoPreset(idx) {
  const preset = DEMO_PRESETS[idx];
  if (!preset) return;

  document.getElementById('form-title').value = preset.title;
  document.getElementById('form-category').value = preset.category;
  document.getElementById('form-brand').value = preset.brand;
  document.getElementById('form-color').value = preset.primaryColor;
  document.getElementById('form-description').value = preset.description;
  document.getElementById('form-location').value = preset.locationId;
  document.getElementById('form-location-detail').value = preset.locationDetail;
  document.getElementById('form-photo-url').value = preset.photo;

  // Update photo preview
  const imgBox = document.getElementById('photo-preview-image-container');
  const previewImg = document.getElementById('photo-preview-image');
  const dropzoneBox = document.getElementById('photo-preview-box');
  if (imgBox && previewImg && dropzoneBox) {
    previewImg.src = preset.photo;
    imgBox.classList.remove('hidden');
    dropzoneBox.classList.add('hidden');
  }

  setReportType(preset.type);
  showToast(`Autofilled with "${preset.title}" preset!`, 'ai');
}

export function handlePhotoSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedPhotoDataUrl = e.target.result;
    document.getElementById('form-photo-url').value = uploadedPhotoDataUrl;

    const imgBox = document.getElementById('photo-preview-image-container');
    const previewImg = document.getElementById('photo-preview-image');
    const dropzoneBox = document.getElementById('photo-preview-box');
    if (imgBox && previewImg && dropzoneBox) {
      previewImg.src = uploadedPhotoDataUrl;
      imgBox.classList.remove('hidden');
      dropzoneBox.classList.add('hidden');
    }
  };
  reader.readAsDataURL(file);
}

export function removeSelectedPhoto() {
  uploadedPhotoDataUrl = '';
  document.getElementById('form-photo-url').value = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
  document.getElementById('photo-preview-image-container').classList.add('hidden');
  document.getElementById('photo-preview-box').classList.remove('hidden');
}

export function handleReportSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('form-title').value;
  const category = document.getElementById('form-category').value;
  const brand = document.getElementById('form-brand').value;
  const primaryColor = document.getElementById('form-color').value;
  const description = document.getElementById('form-description').value;
  const locationId = document.getElementById('form-location').value;
  const locationDetail = document.getElementById('form-location-detail').value;
  const dateTime = document.getElementById('form-datetime').value;
  const photo = document.getElementById('form-photo-url').value;
  const contactName = document.getElementById('form-contact-name').value;
  const contactEmail = document.getElementById('form-contact-email').value;
  const contactPhone = document.getElementById('form-contact-phone').value;
  const reward = document.getElementById('form-reward').value;

  const newItemData = {
    type: currentReportType,
    title,
    category,
    brand,
    primaryColor,
    description,
    locationId,
    locationDetail,
    dateTime: new Date(dateTime).toISOString(),
    photo,
    contactName,
    contactEmail,
    contactPhone,
    reward: currentReportType === 'lost' ? reward : undefined
  };

  // Show animated AI Scanning Modal
  renderAIScanningOverlay(newItemData);
}

function renderAIScanningOverlay(newItemData) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div class="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl p-8 text-center text-white shadow-2xl space-y-6">
        
        <!-- Radar Scanning Animation -->
        <div class="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div class="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping"></div>
          <div class="absolute inset-2 rounded-full border border-teal-500/40 animate-pulse"></div>
          <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <i class="fas fa-brain text-2xl text-white animate-spin"></i>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-black bg-gradient-to-r from-indigo-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
            Quad AI Neural Scanning...
          </h3>
          <p id="scan-status-text" class="text-xs text-slate-400 mt-2 font-medium">
            Extracting visual feature embeddings & tags...
          </p>
        </div>

        <!-- Progress Steps -->
        <div class="space-y-2 text-left text-xs font-semibold text-slate-300 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
          <div class="flex items-center gap-2" id="step-visual">
            <i class="fas fa-check-circle text-emerald-400"></i>
            <span>Visual & Color Profile Analysis</span>
          </div>
          <div class="flex items-center gap-2 text-slate-500" id="step-semantic">
            <i class="fas fa-circle-notch fa-spin"></i>
            <span>Semantic Description Match</span>
          </div>
          <div class="flex items-center gap-2 text-slate-500" id="step-spatial">
            <i class="fas fa-circle text-[8px]"></i>
            <span>Campus Spatial & Timestamp Delta</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Step 2 update
  setTimeout(() => {
    const sem = document.getElementById('step-semantic');
    const txt = document.getElementById('scan-status-text');
    if (sem) {
      sem.className = 'flex items-center gap-2 text-slate-300';
      sem.innerHTML = '<i class="fas fa-check-circle text-emerald-400"></i><span>Semantic Description Match</span>';
    }
    if (txt) txt.innerText = 'Evaluating campus building proximity & loss timeline...';
  }, 600);

  // Step 3 update
  setTimeout(() => {
    const spa = document.getElementById('step-spatial');
    const txt = document.getElementById('scan-status-text');
    if (spa) {
      spa.className = 'flex items-center gap-2 text-slate-300';
      spa.innerHTML = '<i class="fas fa-check-circle text-emerald-400"></i><span>Campus Spatial & Timestamp Delta</span>';
    }
    if (txt) txt.innerText = 'Synthesizing match candidates...';
  }, 1200);

  // Finalize submission and display matches
  setTimeout(() => {
    const createdItem = appStore.addItem(newItemData);
    const matches = findMatchesForItem(createdItem, appStore.getItems(), 60);

    if (matches.length > 0) {
      showToast(`Report published! Found ${matches.length} AI matches!`, 'ai');
      window.openInstantMatchResults(createdItem, matches);
    } else {
      showToast('Report published to campus feed!', 'success');
      window.closeModal();
    }
  }, 1700);
}
