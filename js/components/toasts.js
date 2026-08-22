/**
 * Quad Find — Toast Notification Manager
 */

export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  
  let bgClass = 'bg-slate-900 text-white border-slate-700';
  let iconHtml = '<i class="fas fa-info-circle text-blue-400"></i>';

  if (type === 'success') {
    bgClass = 'bg-emerald-950 text-emerald-100 border-emerald-700 shadow-emerald-900/40';
    iconHtml = '<i class="fas fa-check-circle text-emerald-400"></i>';
  } else if (type === 'ai') {
    bgClass = 'bg-indigo-950 text-indigo-100 border-indigo-600 shadow-indigo-900/40';
    iconHtml = '<i class="fas fa-sparkles text-indigo-400 animate-pulse"></i>';
  } else if (type === 'warning') {
    bgClass = 'bg-amber-950 text-amber-100 border-amber-700 shadow-amber-900/40';
    iconHtml = '<i class="fas fa-exclamation-triangle text-amber-400"></i>';
  }

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-4 opacity-0 text-sm font-medium ${bgClass}`;
  toast.innerHTML = `
    <span class="text-base flex-shrink-0">${iconHtml}</span>
    <div class="flex-1">${message}</div>
    <button class="text-xs opacity-60 hover:opacity-100 ml-2" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
