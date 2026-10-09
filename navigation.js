(function () {
  const isToolsDirectoryView = window.location.search.includes("view=all-tools") || window.location.hash === "#all-tools";

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

      /* Photo 1 Layout Replication Styles */
      .dyn-photo1-container {
        max-width: 950px;
        margin: 1.5rem auto;
        padding: 0 1.2rem;
        box-sizing: border-box;
      }
      .dyn-photo1-crumb {
        color: #2563eb;
        font-size: 0.85rem;
        margin-bottom: 0.4rem;
        font-family: inherit;
      }
      .dyn-photo1-title {
        font-size: 1.7rem;
        font-weight: 800;
        color: #1e40af;
        margin-bottom: 0.2rem;
      }
      .dyn-photo1-desc {
        color: #64748b;
        font-size: 0.9rem;
        margin-bottom: 1.2rem;
      }
      .dyn-photo1-search {
        width: 100%;
        padding: 0.65rem 1rem;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-size: 0.9rem;
        margin-bottom: 1.8rem;
        box-sizing: border-box;
        outline: none;
      }
      .dyn-photo1-search:focus {
        border-color: #3b82f6;
      }
      .dyn-photo1-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 2rem 1.5rem;
      }
      .dyn-photo1-col h3 {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 0.6rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }
      .dyn-photo1-links {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
      }
      .dyn-photo1-link {
        color: #2563eb;
        text-decoration: underline;
        font-size: 0.92rem;
        transition: 0.2s;
      }
      .dyn-photo1-link:hover {
        color: #1d4ed8;
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

    const allToolsUrl = "/?view=all-tools";
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
      .join("") + `<a href="${allToolsUrl}" class="dyn-more-link">More ▾</a>`;

    const mobileLinksHtml = categories
      .map((c) => `<a href="${c.path}">${c.name}</a>`)
      .join("") + `<a href="${allToolsUrl}" style="color:#38bdf8;">✨ All Calculators</a>`;

    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <header id="siteDynamicHeader">
        <a href="/" class="dyn-brand">
          <div class="dyn-logo-icon">&sum;</div>
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

  // BUILD PHOTO 1 DIRECTORY DYNAMICALLY WHEN VIEWING "ALL TOOLS"
  if (isToolsDirectoryView) {
    document.title = "All Calculators | thequantcals";

    fetch("/")
      .then((res) => (res.ok ? res.text() : ""))
      .then((html) => {
        if (!html) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Collect all categories and links from homepage
        const headings = doc.querySelectorAll("h2, h3");
        const categoryMap = [];
        const ignored = ["interactive", "popular", "status", "system"];

        headings.forEach((h) => {
          const title = h.textContent.trim();
          const lower = title.toLowerCase();
          if (!title || ignored.some((w) => lower.includes(w))) return;

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
              categoryMap.push({ title, tools: catTools });
            }
          }
        });

        // Generate columns layout matching Photo 1
        let colsHtml = "";
        categoryMap.forEach((col) => {
          colsHtml += `
            <div class="dyn-photo1-col">
              <h3>${col.title}</h3>
              <div class="dyn-photo1-links">
                ${col.tools.map((t) => `<a href="${t.url}" class="dyn-photo1-link">${t.name}</a>`).join("")}
              </div>
            </div>
          `;
        });

        const viewContainer = document.createElement("div");
        viewContainer.className = "dyn-photo1-container";
        viewContainer.innerHTML = `
          <div class="dyn-photo1-crumb">home / all calculators</div>
          <h1 class="dyn-photo1-title">All Calculators</h1>
          <p class="dyn-photo1-desc">The following is a complete list of all our calculators by category.</p>
          <input type="text" id="dynPhoto1SearchInput" class="dyn-photo1-search" placeholder="Search calculators">
          <div class="dyn-photo1-grid" id="dynPhoto1Grid">
            ${colsHtml}
          </div>
        `;

        // Strip homepage widgets completely
        Array.from(document.body.children).forEach((child) => {
          if (child.id !== "siteDynamicHeader" && child.id !== "dynDrawer" && child.id !== "dynOverlay") {
            child.remove();
          }
        });

        document.body.appendChild(viewContainer);

        // Instant filter search logic
        const searchInput = document.getElementById("dynPhoto1SearchInput");
        if (searchInput) {
          searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll(".dyn-photo1-link").forEach((link) => {
              const match = link.textContent.toLowerCase().includes(query);
              link.style.display = match ? "inline" : "none";
            });
          });
        }
      })
      .catch(() => {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupNavigation);
  } else {
    setupNavigation();
  }
})();
