# 🔖 Bookmarks

A minimal, dark-themed bookmark manager that lives in your browser. Organize your favorite websites into workspaces, pin the ones you use most, and navigate everything from a sleek glassmorphic tab bar.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## ✨ Features

- **Sidebar** — Pinned site favicons in a responsive 2-column grid for one-click access
- **Workspace Tabs** — Glassmorphic pill-style tab bar to switch between workspace categories
- **Bookmark Grid** — Cards with favicon, truncated title, and smooth hover animations
- **Data-driven** — Everything is controlled from a single `data.json` file; no rebuild needed
- **Zero dependencies** — Pure HTML, CSS, and vanilla JS

---

## 📁 Project Structure

```
root/
├── index.html   # App shell
├── styles.css    # All styles (dark theme, glassmorphism, animations)
├── script.js       # Data loading, rendering, workspace logic
└── data/    # Your bookmarks
```

---

## 🚀 Getting Started

Because the app fetches `data.json` via `fetch()`, you need to serve it from a local server rather than opening the file directly.

**Option 1 — Node.js**

```bash
npx serve .
```

**Option 2 — Python**

```bash
python -m http.server 8080
```

**Option 3 — VS Code**
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, then click **Go Live** in the status bar.

Then open `http://localhost:PORT` in your browser.

---

## 🗂 Data Format

All bookmarks live in `data.json`. Each entry follows this shape:

```json
{
  "id": 1,
  "title": "GitHub",
  "link": "https://www.github.com"
}
```

| Field   | Type     | Description                     |
| ------- | -------- | ------------------------------- |
| `id`    | `number` | Unique identifier               |
| `title` | `string` | Display title shown on the card |
| `link`  | `string` | URL opened on click             |

Workspaces are derived automatically from the data — just use a new key and the tab appears.

---

## 🎨 Customization

**Swap emoji for real icons** — In `app.js`, update the `WORKSPACE_ICONS` map to use an `<img>` or SVG path instead of the `emoji` field, then adjust `renderTopTab()` accordingly.

**Change accent color** — In `style.css`, update the `--accent` CSS variable:

```css
:root {
  --accent: #7c6aff; /* change this */
}
```

**Adjust sidebar columns** — The sidebar grid is `repeat(2, 1fr)` by default. Change it in `.sidebar-grid` inside `style.css`.

---

## 📄 License

MIT — do whatever you want with it.
