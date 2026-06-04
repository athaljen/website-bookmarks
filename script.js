// ===========================
//   WORKSPACE EMOJI MAP
// ===========================
const WORKSPACE_ICONS = {
  work:          { emoji: '💼', label: 'Work' },
  social:        { emoji: '👥', label: 'Social' },
  entertainment: { emoji: '🎮', label: 'Entertainment' },
  personal:      { emoji: '🏠', label: 'Personal' },
  others:        { emoji: '🌐', label: 'Others' },
  coding:        { emoji: '💻', label: 'Coding' },
  design:        { emoji: '🎨', label: 'Design' },
  finance:       { emoji: '💰', label: 'Finance' },
  education:     { emoji: '🎓', label: 'Education' },
  health:        { emoji: '🏥', label: 'Health' },
  travel:        { emoji: '✈️', label: 'Travel' },
  food:          { emoji: '🍔', label: 'Food' },
  sports:        { emoji: '⚽', label: 'Sports' },
  music:         { emoji: '🎵', label: 'Music' },
  news:          { emoji: '📰', label: 'News' },
  jobs:          { emoji: '💼', label: 'Jobs' },
};

// ===========================
//   STATE
// ===========================
let allBookmarks = [];
let activeWorkspace = null; // null = show all

// ===========================
//   INIT
// ===========================
async function init() {
  try {
    const res = await fetch('data.json');
    allBookmarks = await res.json();
  } catch (e) {
    console.error('Failed to load data.json:', e);
    allBookmarks = [];
  }

  // Derive workspaces from data
  const workspaceKeys = [...new Set(allBookmarks.map(b => b.workspace))];

  // Default to first workspace
  activeWorkspace = workspaceKeys[0] || null;

  renderTopTab(workspaceKeys);
  renderSidebar();
  renderContent();
}

// ===========================
//   RENDER: SIDEBAR
// ===========================
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarItems = allBookmarks.filter(b => b.isSidebar);

  sidebar.innerHTML = `<div class="sidebar-label">Pinned</div><div class="sidebar-grid" id="sidebar-grid"></div>`;

  const grid = document.getElementById('sidebar-grid');

  sidebarItems.forEach(bookmark => {
    const item = document.createElement('div');
    item.className = 'sidebar-item';
    item.setAttribute('data-name', bookmark.name);
    item.setAttribute('title', bookmark.name);
    item.addEventListener('click', () => window.open(bookmark.link, '_blank'));

    item.innerHTML = `
      <img
        src="${bookmark.favicon}"
        alt="${bookmark.name}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="favicon-fallback" style="display:none">${bookmark.name.charAt(0).toUpperCase()}</div>
    `;

    grid.appendChild(item);
  });
}

// ===========================
//   RENDER: TOP TAB
// ===========================
function renderTopTab(workspaceKeys) {
  const tabPill = document.getElementById('tab-pill');
  tabPill.innerHTML = '';

  workspaceKeys.forEach(key => {
    const ws = WORKSPACE_ICONS[key] || { emoji: '🌐', label: capitalize(key) };

    const wrap = document.createElement('div');
    wrap.className = 'tab-btn-wrap';

    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (key === activeWorkspace ? ' active' : '');
    btn.setAttribute('data-workspace', key);
    btn.setAttribute('aria-label', ws.label);
    btn.innerHTML = `<span class="tab-emoji">${ws.emoji}</span>`;
    btn.addEventListener('click', () => selectWorkspace(key));

    const tooltip = document.createElement('div');
    tooltip.className = 'tab-tooltip';
    tooltip.textContent = ws.label;

    wrap.appendChild(btn);
    wrap.appendChild(tooltip);
    tabPill.appendChild(wrap);
  });
}

// ===========================
//   RENDER: MAIN CONTENT
// ===========================
function renderContent() {
  const content = document.getElementById('content');
  const filtered = activeWorkspace
    ? allBookmarks.filter(b => b.workspace === activeWorkspace)
    : allBookmarks;

  const ws = WORKSPACE_ICONS[activeWorkspace] || { emoji: '🌐', label: capitalize(activeWorkspace) };

  content.innerHTML = `
    <div class="content-header">
      <span class="content-workspace-icon">${ws.emoji}</span>
      <span class="content-workspace-name">${ws.label}</span>
      <span class="content-count">${filtered.length}</span>
    </div>
    <div class="bookmarks-grid" id="bookmarks-grid"></div>
  `;

  const grid = document.getElementById('bookmarks-grid');

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔖</div>
        <p>No bookmarks in this workspace</p>
      </div>
    `;
    return;
  }

  filtered.forEach(bookmark => {
    const card = document.createElement('a');
    card.className = 'bookmark-card';
    card.href = bookmark.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    card.innerHTML = `
      <div class="card-icon">
        <img
          src="${bookmark.favicon}"
          alt="${bookmark.name}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="icon-fallback" style="display:none">${bookmark.name.charAt(0).toUpperCase()}</div>
      </div>
      <span class="card-title">${bookmark.name}</span>
    `;

    grid.appendChild(card);
  });
}

// ===========================
//   ACTIONS
// ===========================
function selectWorkspace(key) {
  if (activeWorkspace === key) return;
  activeWorkspace = key;

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-workspace') === key);
  });

  renderContent();
}

// ===========================
//   UTILS
// ===========================
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ===========================
//   START
// ===========================
document.addEventListener('DOMContentLoaded', init);
