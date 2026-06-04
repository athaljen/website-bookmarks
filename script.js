const bookmarkTabs = {
  "jobs-search": { name: "Job Search", icon: "🔍", bookmarks: [] },
  work: { name: "Work", icon: "💼", bookmarks: [] },
  coding: { name: "Coding", icon: "💻", bookmarks: [] },
  libraries: { name: "Libraries", icon: "📚", bookmarks: [] },
  documentation: { name: "Documentation", icon: "📄", bookmarks: [] },
  "ui-ux": { name: "UI UX", icon: "🎨", bookmarks: [] },
  others: { name: "Others", icon: "🌐", bookmarks: [] },
};

const WORKSPACE_ICONS = {
  work: { emoji: "💼", label: "Work" },
  social: { emoji: "👥", label: "Social" },
  entertainment: { emoji: "🎮", label: "Entertainment" },
  personal: { emoji: "🏠", label: "Personal" },
  others: { emoji: "🌐", label: "Others" },
  coding: { emoji: "💻", label: "Coding" },
  design: { emoji: "🎨", label: "Design" },
  finance: { emoji: "💰", label: "Finance" },
  education: { emoji: "🎓", label: "Education" },
  health: { emoji: "🏥", label: "Health" },
  travel: { emoji: "✈️", label: "Travel" },
  food: { emoji: "🍔", label: "Food" },
  sports: { emoji: "⚽", label: "Sports" },
  music: { emoji: "🎵", label: "Music" },
  news: { emoji: "📰", label: "News" },
  jobs: { emoji: "💼", label: "Jobs" },
};

let sidebarData = [];
let activeWorkspace = null;

function getFabIcon(url, isStatic) {
  if (isStatic) {
    return `${url}/favicon.ico`;
  }
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
  } catch (e) {
    return `${url}/favicon.ico`;
  }
}

async function init() {
  try {
    const [
      sidebarRes,
      documentationRes,
      codingRes,
      jobsRes,
      librariesRes,
      workRes,
      uiuxRes,
      othersRes,
    ] = await Promise.all([
      fetch("data/sidebar.json"),
      fetch("data/documentations.json"),
      fetch("data/coding.json"),
      fetch("data/job-search.json"),
      fetch("data/libraries.json"),
      fetch("data/work.json"),
      fetch("data/ui-ux.json"),
      fetch("data/others.json"),
    ]);
    sidebarData = await sidebarRes.json();

    bookmarkTabs.documentation.bookmarks = await documentationRes.json();
    bookmarkTabs.coding.bookmarks = await codingRes.json();
    bookmarkTabs["jobs-search"].bookmarks = await jobsRes.json();
    bookmarkTabs.libraries.bookmarks = await librariesRes.json();
    bookmarkTabs.work.bookmarks = await workRes.json();
    bookmarkTabs["ui-ux"].bookmarks = await uiuxRes.json();
    bookmarkTabs.others.bookmarks = await othersRes.json();
  } catch (e) {
    console.error("Failed to load data.json:", e);
  }

  activeWorkspace = Object.keys(bookmarkTabs)[1];

  renderTopTab();
  renderSidebar();
  renderContent();
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");

  const grid = document.getElementById("sidebar-grid");

  sidebarData.forEach((sidebar) => {
    const item = document.createElement("a");
    item.className = "sidebar-item";
    item.href = sidebar.link;
    item.target = "_blank";
    item.rel = "noopener noreferrer";

    item.innerHTML = `
      <img
        src="${getFabIcon(sidebar.link, false)}"
        alt="${sidebar.name}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="favicon-fallback" style="display:none">${sidebar.title.charAt(0).toUpperCase()}</div>
    `;

    grid.appendChild(item);
  });
}

function renderTopTab() {
  const tabPill = document.getElementById("tab-pill");
  tabPill.innerHTML = "";

  Object.entries(bookmarkTabs).forEach(([key, ws]) => {
    const wrap = document.createElement("div");
    wrap.className = "tab-btn-wrap";

    const btn = document.createElement("button");
    btn.className = "tab-btn" + (key === activeWorkspace ? " active" : "");
    btn.setAttribute("data-workspace", key);
    btn.setAttribute("aria-label", ws.name);
    btn.innerHTML = `<span class="tab-emoji">${ws.icon}</span>`;
    btn.addEventListener("click", () => selectWorkspace(key));

    const tooltip = document.createElement("div");
    tooltip.className = "tab-tooltip";
    tooltip.textContent = ws.name;

    wrap.appendChild(btn);
    wrap.appendChild(tooltip);
    tabPill.appendChild(wrap);
  });
}

function renderContent() {
  const grid = document.getElementById("bookmarks-grid");

  const bookmarkData = bookmarkTabs[activeWorkspace]?.bookmarks || [];

  grid.innerHTML = "";

  if (bookmarkData.length === 0) {
    grid.innerHTML = "";
    return;
  }

  bookmarkData.forEach((bookmark, index) => {
    const card = document.createElement("a");
    card.className = "bookmark-card";
    card.href = bookmark.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.style.animationDelay = `${index * 25}ms`;

    card.innerHTML = `
      <div class="card-icon">
        <img
          src="${getFabIcon(bookmark.link, false)}"
          alt="${bookmark.title}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="icon-fallback" style="display:none">${bookmark.title.charAt(0).toUpperCase()}</div>
      </div>
      <p class="card-title">${bookmark.title}</p>
    `;
    grid.appendChild(card);
  });
}

function selectWorkspace(key) {
  if (activeWorkspace === key) return;
  activeWorkspace = key;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-workspace") === key);
  });

  renderContent();
}
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

document.addEventListener("DOMContentLoaded", init);
