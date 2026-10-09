(function () {
  const isAllToolsView = window.location.pathname.endsWith("/all-tools.html") || 
                         window.location.search.includes("view=all-tools") ||
                         window.location.hash === "#all-tools-page";

  function setupNavigation() {
    const oldHeader = document.getElementById("siteDynamicHeader");
    if (oldHeader) oldHeader.remove();
    const oldDrawer = document.getElementById("dynDrawer");
    if (oldDrawer) oldDrawer.remove();

    const style = document.createElement("style");
    style.id = "injectedNavigationStyles";
    style.textContent = `
      :root {
        --nav-header-height: 56px;
      }
      body {
        padding-top: var(--nav-header-height) !important;
      }
      header#siteDynamicHeader {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: var(--nav-header-height) !important;
        z-index: 999999 !important;
        background: linear-gradient(135deg, #020818 0%, #0d1f5c 40%, #1a3a8f 75%, #0e2d6b 100%) !important;
        border-bottom: 1px solid rgba(99, 179, 255, 0.25) !important;
        box-shadow: 0 4px 25px rgba(10, 20, 80, 0.5) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 0 1.2rem !important;
        box-sizing: border-box !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      }
      .dyn-brand {
        display: flex !important;
        align-items: center !important;
        gap: 0.6rem !important;
        text-decoration: none !important;
      }
      .dyn-logo-icon {
        background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
        width: 32px !important;
        height: 32px !important;
        border-radius: 8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: #ffffff !important;
        font-weight: 800 !important;
        font-size: 1.1rem !important;
      }
      .dyn-brand-text {
        font-size: 1.2rem !important;
        font-weight: 800 !important;
        letter-spacing: -0.4px !important;
        background: linear-gradient(90deg, #e0f2fe 0%, #bae6fd 60%, #c7d2fe 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }

      .dyn-desktop-nav {
        display: none;
        align-items: center;
        gap: 0.5rem;
        height: 100%;
        margin-left: auto;
        margin-right: 1.2rem;
      }
      .dyn-desktop-nav a {
        text-decoration: none !important;
        font-size: 0.88rem !important;
        font-weight: 600 !important;
        color: #cbd5e1 !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 0.85rem !important;
        border-bottom: 3px solid transparent !important;
        transition: 0.2s ease !important;
      }
      .dyn-desktop-nav a:hover {
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }
      .dyn-desktop-nav a.is-active {
        color: #ffffff !important;
        border-bottom: 3px solid #38bdf8 !important;
        background: rgba(30, 58, 138, 0.45) !important;
      }

      .dyn-more-link {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.25)) !important;
        border: 1px solid rgba(56, 189, 248, 0.5) !important;
        color: #38bdf8 !important;
        font-weight: 700 !important;
        font-size: 0.82rem !important;
        padding: 0.35rem 0.85rem !important;
        border-radius: 20px !important;
        text-decoration: none !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.3rem !important;
        height: auto !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      .dyn-more-link:hover {
        background: linear-gradient(135deg, #0284c7, #4f46e5) !important;
        color: #ffffff !important;
        box-shadow: 0 2px 10px rgba(56, 189, 248, 0.4) !important;
      }

      .dyn-right-controls {
        display: flex !important;
        align-items: center !important;
        gap: 0.75rem !important;
      }
      .dyn-theme-btn {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 8px !important;
        font-size: 1rem !important;
        cursor: pointer !important;
        color: #ffffff !important;
        width: 35px !important;
        height: 35px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .dyn-hamburger-btn {
        background: none !important;
        border: none !important;
        cursor: pointer !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 5px !important;
        padding: 5px !important;
      }
      .dyn-hamburger-btn span {
        width: 23px !important;
        height: 2.5px !important;
        background-color: #ffffff !important;
        border-radius: 2px !important;
        display: block !important;
      }

      .dyn-drawer-menu {
        position: fixed !important;
        top: 0 !important;
        right: -290px !important;
        width: 270px !important;
        height: 100vh !important;
        background: #0b132b !important;
        border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
        padding: 4.5rem 1.25rem 2rem !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 0.8rem !important;
        transition: right 0.28s ease !important;
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6) !important;
        z-index: 1000000 !important;
        box-sizing: border-box !important;
      }
      .dyn-drawer-menu.open {
        right: 0 !important;
      }
      .dyn-drawer-menu a {
        text-decoration: none !important;
        color: #e2e8f0 !important;
        font-weight: 600 !important;
        font-size: 0.95rem !important;
        padding: 0.65rem 0.85rem !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.6rem !important;
      }
      .dyn-drawer-menu a:hover {
        background: rgba(56, 189, 248, 0.15) !important;
        color: #38bdf8 !important;
      }
      .dyn-close-btn {
        position: absolute !important;
        top: 1rem !important;
        right: 1.2rem !important;
        background: none !important;
        border: none !important;
        font-size: 2rem !important;
        color: #94a3b8 !important;
        cursor: pointer !important;
        line-height: 1 !important;
      }
      .dyn-backdrop-overlay {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(0, 0, 0, 0.55) !important;
        z-index: 999998 !important;
        display: none !important;
      }
      .dyn-backdrop-overlay.open {
        display: block !important;
      }

      /* Clean All-Tools Page styling */
      .tools-page-wrapper {
        max-width: 900px;
        margin: 2rem auto;
        padding: 0 1rem;
        box-sizing: border-box;
      }
      .tools-page-header {
        margin-bottom: 2rem;
      }
      .tools-page-header h1 {
        font-size: 1.85rem;
        font-weight: 800;
        margin-bottom: 0.4rem;
        color: var(--text-main, #1e293b);
      }
      .tools-page-header p {
        color: var(--text-muted, #64748b);
        font-size: 1rem;
      }
      .tools-cat-box {
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
      }
      .tools-cat-title {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
        padding-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .tools-cat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 0.75rem;
      }
      .tools-item-card {
        padding: 0.85rem 1rem;
        background: var(--bg-primary, #f8fafc);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 8px;
        color: var(--text-main, #1e293b);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        display: block;
        transition: all 0.2s ease;
      }
      .tools-item-card:hover {
        border-color: #38bdf8;
        color: #0284c7;
        transform: translateY(-2px);
      }

      @media (min-width: 768px) {
        .dyn-desktop-nav {
          display: flex !important;
        }
        .dyn-hamburger-btn,
        .dyn-drawer-menu,
        .dyn-backdrop-overlay {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    const allToolsPageUrl = "/?view=all-tools";
    const categories = [
      { name: "Finance", path: "/#finance", slug: "finance" },
      { name: "Math", path: "/#math", slug: "math" },
      { name: "Utility", path: "/#utility", slug: "utility" }
    ];

    const currentUrl = window.location.href.toLowerCase();

    const desktopLinksHtml = categories
      .map((c) => {
        const isActive = currentUrl.includes(c.slug) ? "is-active" : "";
        return `<a href="${c.path}" class="${isActive}">${c.name}</a>`;
      })
      .join("") + `<a href="${allToolsPageUrl}" class="dyn-more-link">More ▾</a>`;

    const mobileLinksHtml = categories
      .map((c) => `<a href="${c.path}">${c.name}</a>`)
      .join("") + `<a href="${allToolsPageUrl}" style="color:#38bdf8;">✨ All Tools & Categories</a>`;

    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <header id="siteDynamicHeader">
        <a href="/" class="dyn-brand">
          <div class="dyn-logo-symbol">&sum;</div>
          <span class="dyn-brand-text">thequantcals</span>
        </a>

        <nav class="dyn-desktop-nav">
          ${desktopLinksHtml}
        </nav>

        <div class="dyn-right-controls">
          <button id="dynThemeToggleBtn" class="dyn-theme-btn" aria-label="Toggle Theme">🌙</button>
          <button id="dynHamburgerToggleBtn" class="dyn-hamburger-btn" aria-label="Open Navigation">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div class="dyn-backdrop-overlay" id="dynOverlay"></div>
      <aside class="dyn-drawer-menu" id="dynDrawer">
        <button class="dyn-close-btn" id="dynCloseBtn" aria-label="Close menu">&times;</button>
        <a href="/">🏠 Home Base</a>
        ${mobileLinksHtml}
      </aside>
    `;

    document.body.insertAdjacentElement("afterbegin", navContainer);

    const hamburgerBtn = document.getElementById("dynHamburgerToggleBtn");
    const closeBtn = document.getElementById("dynCloseBtn");
    const drawer = document.getElementById("dynDrawer");
    const overlay = document.getElementById("dynOverlay");

    if (hamburgerBtn) hamburgerBtn.onclick = () => { drawer.classList.add("open"); overlay.classList.add("open"); };
    if (closeBtn) closeBtn.onclick = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };
    if (overlay) overlay.onclick = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };

    const themeBtn = document.getElementById("dynThemeToggleBtn");
    const rootEl = document.documentElement;
    if (localStorage.getItem("theme") === "dark") {
      rootEl.setAttribute("data-theme", "dark");
      if (themeBtn) themeBtn.textContent = "☀️";
    }
    if (themeBtn) {
      themeBtn.onclick = () => {
        const isDark = rootEl.getAttribute("data-theme") === "dark";
        rootEl.setAttribute("data-theme", isDark ? "light" : "dark");
        localStorage.setItem("theme", isDark ? "light" : "dark");
        themeBtn.textContent = isDark ? "🌙" : "☀️";
      };
    }
  }

  // AUTOMATIC DISCOVERY OF ANY EXISTING AND NEW CATEGORY & TOOLS
  if (isAllToolsView) {
    document.title = "All Tools & Categories | thequantcals";

    fetch("/")
      .then((res) => (res.ok ? res.text() : ""))
      .then((html) => {
        if (!html) return;
        const parser = new DOMParser();
        const homeDoc = parser.parseFromString(html, "text/html");

        // Select all headings that define categories (h2/h3)
        const headings = homeDoc.querySelectorAll("h2, h3, [data-category-title]");
        const discoveredCategories = [];
        const ignored = ["interactive", "popular", "status", "system", "features", "faqs"];

        headings.forEach((h) => {
          const title = h.textContent.trim();
          const lowerTitle = title.toLowerCase();

          // Exclude widgets, calculators, and system blocks
          if (!title || ignored.some((word) => lowerTitle.includes(word))) return;

          // Look for container holding tool links under this category heading
          let container = h.parentElement;
          if (container && container.querySelectorAll("a").length === 0) {
            container = container.parentElement;
          }

          if (container) {
            const links = container.querySelectorAll('a[href*="/tools/"], a[href*="calculator"]');
            const catTools = [];

            links.forEach((a) => {
              const name = a.textContent.trim().replace(/^[^a-zA-Z0-9]+/, "");
              const href = a.getAttribute("href");
              if (name && href && !catTools.some((t) => t.url === href)) {
                catTools.push({ name, url: href });
              }
            });

            if (catTools.length > 0) {
              discoveredCategories.push({
                category: title,
                tools: catTools
              });
            }
          }
        });

        // Build HTML for all discovered categories
        let groupsHtml = "";
        discoveredCategories.forEach((cat) => {
          groupsHtml += `
            <div class="tools-cat-box">
              <h2 class="tools-cat-title">${cat.category}</h2>
              <div class="tools-cat-grid">
                ${cat.tools.map((t) => `<a href="${t.url}" class="tools-item-card">${t.name}</a>`).join("")}
              </div>
            </div>
          `;
        });

        const pageContainer = document.createElement("div");
        pageContainer.className = "tools-page-wrapper";
        pageContainer.innerHTML = `
          <div class="tools-page-header">
            <h1>All Tools & Categories</h1>
            <p>Browse all available tools grouped by category.</p>
          </div>
          ${groupsHtml}
        `;

        // Strip homepage widgets and render only the clean category list
        Array.from(document.body.children).forEach((child) => {
          if (child.id !== "siteDynamicHeader" && child.id !== "dynDrawer" && child.id !== "dynOverlay") {
            child.remove();
          }
        });

        document.body.appendChild(pageContainer);
      })
      .catch(() => {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupNavigation);
  } else {
    setupNavigation();
  }
})();
