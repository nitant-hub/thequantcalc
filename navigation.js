(function () {
  const currentPath = window.location.pathname.toLowerCase();
  const isToolPage = currentPath.includes("/tools/") || currentPath.includes("calculator.html");
  const isHomePage = !isToolPage;

  function initNavigation() {
    // 1. Remove duplicate injected elements if already mounted
    const oldHeader = document.getElementById("siteDynamicHeader");
    if (oldHeader) oldHeader.remove();
    const oldDrawer = document.getElementById("dynDrawer");
    if (oldDrawer) oldDrawer.remove();
    const oldOverlay = document.getElementById("dynOverlay");
    if (oldOverlay) oldOverlay.remove();

    // 2. Responsive CSS Injection
    let style = document.getElementById("injectedNavigationStyles");
    if (!style) {
      style = document.createElement("style");
      style.id = "injectedNavigationStyles";
      document.head.appendChild(style);
    }
    style.textContent = `
      :root {
        --nav-header-height: 56px;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      body {
        padding-top: var(--nav-header-height) !important;
        padding-left: 0 !important;
        margin: 0 !important;
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
        box-shadow: 0 4px 20px rgba(10, 20, 80, 0.4) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 0 1.2rem !important;
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
        margin-right: 1rem;
      }
      .dyn-desktop-nav a {
        text-decoration: none !important;
        font-size: 0.85rem !important;
        font-weight: 600 !important;
        color: #cbd5e1 !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 0.8rem !important;
        border-bottom: 3px solid transparent !important;
        transition: 0.2s ease !important;
        text-transform: uppercase !important;
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
      .dyn-more-pill-btn {
        background: #1e3a8a !important;
        border: 1px solid rgba(96, 165, 250, 0.4) !important;
        color: #ffffff !important;
        font-weight: 700 !important;
        font-size: 0.8rem !important;
        padding: 0.35rem 0.8rem !important;
        border-radius: 6px !important;
        text-decoration: none !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.3rem !important;
        height: auto !important;
        cursor: pointer !important;
        text-transform: uppercase !important;
        transition: all 0.2s ease !important;
      }
      .dyn-more-pill-btn:hover {
        background: #2563eb !important;
        border-color: #93c5fd !important;
      }
      .dyn-right-controls {
        display: flex !important;
        align-items: center !important;
        gap: 0.65rem !important;
      }
      .dyn-theme-btn {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 8px !important;
        font-size: 1rem !important;
        cursor: pointer !important;
        color: #ffffff !important;
        width: 34px !important;
        height: 34px !important;
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
        padding: 4px !important;
      }
      .dyn-hamburger-btn span {
        width: 22px !important;
        height: 2.5px !important;
        background-color: #ffffff !important;
        border-radius: 2px !important;
        display: block !important;
      }
      .dyn-drawer-menu {
        position: fixed !important;
        top: 0 !important;
        right: -310px !important;
        width: 285px !important;
        height: 100vh !important;
        background: #ffffff !important;
        border-left: 1px solid #e2e8f0 !important;
        padding: 3.5rem 1.2rem 3rem !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 0.65rem !important;
        transition: right 0.28s ease !important;
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.25) !important;
        z-index: 1000000 !important;
        overflow-y: auto !important;
      }
      [data-theme="dark"] .dyn-drawer-menu {
        background: #0b132b !important;
        border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .dyn-drawer-menu.open {
        right: 0 !important;
      }
      .dyn-drawer-title {
        color: #64748b;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 0.2rem;
      }
      .dyn-drawer-menu a {
        text-decoration: none !important;
        color: #1e293b !important;
        font-weight: 600 !important;
        font-size: 0.94rem !important;
        padding: 0.5rem 0.65rem !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.6rem !important;
      }
      [data-theme="dark"] .dyn-drawer-menu a {
        color: #e2e8f0 !important;
      }
      .dyn-drawer-menu a:hover {
        background: #f1f5f9 !important;
        color: #0284c7 !important;
      }
      [data-theme="dark"] .dyn-drawer-menu a:hover {
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
        color: #64748b !important;
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

      /* Desktop Layout (>768px): Hide mobile menu drawer & show top nav */
      @media (min-width: 768px) {
        .dyn-desktop-nav {
          display: flex !important;
        }
        .dyn-hamburger-btn,
        .dyn-drawer-menu,
        .dyn-backdrop-overlay {
          display: none !important;
        }
        /* Strict 2-column split */
        .dyn-two-column-layout {
          display: flex !important;
          flex-direction: row-reverse !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          align-items: flex-start !important;
          gap: 2rem !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
          padding: 1.5rem 1rem !important;
          width: 100% !important;
        }
        .dyn-sidebar-card {
          width: 260px !important;
          min-width: 260px !important;
          flex-shrink: 0 !important;
          margin: 0 !important;
        }
      }

      /* Footer stays strictly full-width at the bottom */
      footer, .footer, .dyn-copyright-footer {
        width: 100% !important;
        flex-basis: 100% !important;
        order: 9999 !important;
        display: block !important;
        clear: both !important;
        text-align: center !important;
        margin-top: 3.5rem !important;
        padding: 1.5rem 0 !important;
      }

      .dyn-search-wrapper {
        position: relative !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }
      .dyn-search-input {
        width: 100% !important;
        padding: 0.65rem 0.9rem !important;
        font-size: 0.9rem !important;
        border-radius: 8px !important;
        border: 1px solid #cbd5e1 !important;
        background: #f8fafc !important;
        color: #0f172a !important;
        outline: none !important;
        box-sizing: border-box !important;
        transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease !important;
      }
      .dyn-search-input:focus {
        border-color: #38bdf8 !important;
        background: #ffffff !important;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15) !important;
      }
      [data-theme="dark"] .dyn-search-input {
        background: #1e293b !important;
        border: 1px solid #334155 !important;
        color: #f8fafc !important;
      }
      .dyn-search-below-calc {
        max-width: 640px !important;
        margin: 1.5rem auto !important;
        padding: 0 1rem !important;
      }
      .dyn-search-dropdown {
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        width: 100% !important;
        max-height: 240px !important;
        overflow-y: auto !important;
        background: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 8px !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        margin-top: 5px !important;
        display: none;
        z-index: 1000005 !important;
        box-sizing: border-box !important;
      }
      [data-theme="dark"] .dyn-search-dropdown {
        background: #0f172a !important;
        border-color: #334155 !important;
      }
      .dyn-search-dropdown a {
        display: block !important;
        padding: 0.6rem 0.85rem !important;
        font-size: 0.86rem !important;
        color: #1e293b !important;
        text-decoration: none !important;
        border-bottom: 1px solid #f1f5f9 !important;
      }
      [data-theme="dark"] .dyn-search-dropdown a {
        color: #e2e8f0 !important;
        border-bottom: 1px solid #1e293b !important;
      }
      .dyn-search-dropdown a:hover {
        background: #f0f9ff !important;
        color: #0284c7 !important;
      }
      [data-theme="dark"] .dyn-search-dropdown a:hover {
        background: #1e293b !important;
        color: #38bdf8 !important;
      }
    `;

    const targetMoreUrl = "https://thequantcal.pages.dev/?view=all-tools#/all";
    const categories = [
      { name: "FINANCE", path: "/#finance", slug: "finance", icon: "📈" },
      { name: "MATH", path: "/#math", slug: "math", icon: "📐" },
      { name: "UTILITY", path: "/#utility", slug: "utility", icon: "🧰" }
    ];

    const desktopLinksHtml = categories
      .map((c) => {
        const isActive = currentPath.includes(c.slug) ? "is-active" : "";
        return `<a href="${c.path}" class="${isActive}">${c.name}</a>`;
      })
      .join("") + `<a href="${targetMoreUrl}" class="dyn-more-pill-btn">MORE</a>`;

    const mobileLinksHtml = categories
      .map((c) => `<a href="${c.path}"><span>${c.icon}</span> ${c.name.charAt(0) + c.name.slice(1).toLowerCase()}</a>`)
      .join("") + `<a href="${targetMoreUrl}"><span>📋</span> All Calculators</a>`;

    // 3. Assemble Header and Drawer Markup
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
        <div class="dyn-drawer-title">MENU</div>
        
        <div class="dyn-search-wrapper dyn-drawer-search" style="margin-bottom:0.8rem;">
          <input type="text" class="dyn-search-input dyn-shared-search-input" placeholder="🔍 Search calculators..." autocomplete="off">
          <div class="dyn-search-dropdown"></div>
        </div>

        <a href="/"><span>🏠</span> Home</a>
        ${mobileLinksHtml}
      </aside>
    `;

    document.body.insertAdjacentElement("afterbegin", navContainer);

    // 4. GUARANTEE SEARCH IN DRAWER ON EVERY PAGE
    function ensureDrawerSearch() {
      const drawer = document.getElementById("dynDrawer");
      if (!drawer) return;
      if (!drawer.querySelector(".dyn-drawer-search")) {
        const title = drawer.querySelector(".dyn-drawer-title");
        const searchBox = document.createElement("div");
        searchBox.className = "dyn-search-wrapper dyn-drawer-search";
        searchBox.style.marginBottom = "0.8rem";
        searchBox.innerHTML = `
          <input type="text" class="dyn-search-input dyn-shared-search-input" placeholder="🔍 Search calculators..." autocomplete="off">
          <div class="dyn-search-dropdown"></div>
        `;
        if (title && title.nextSibling) {
          drawer.insertBefore(searchBox, title.nextSibling);
        } else {
          drawer.prepend(searchBox);
        }
        attachSearchEngine(searchBox);
      }
    }

    // 5. GUARANTEE DESKTOP SEARCH PLACEMENT
    function ensureDesktopSearch() {
      if (window.innerWidth < 768) return;

      if (isHomePage) {
        // Place below Interactive Calculator on Homepage
        if (!document.getElementById("dynHomeDesktopSearchBox")) {
          const allEls = Array.from(document.querySelectorAll("*"));
          const calcEl = allEls.find(el => {
            const txt = (el.textContent || "").trim().toLowerCase();
            return txt.includes("interactive calculator") && el.children.length <= 2;
          });

          if (calcEl) {
            let container = calcEl.closest(".card, section, div[class*='calc']");
            if (!container) {
              container = calcEl.parentElement;
              if (container && container.parentElement && container.parentElement.children.length <= 4) {
                container = container.parentElement;
              }
            }

            if (container && container.parentNode) {
              const homeSearch = document.createElement("div");
              homeSearch.id = "dynHomeDesktopSearchBox";
              homeSearch.className = "dyn-search-wrapper dyn-search-below-calc";
              homeSearch.innerHTML = `
                <input type="text" class="dyn-search-input dyn-shared-search-input" placeholder="🔍 Search all calculators..." autocomplete="off">
                <div class="dyn-search-dropdown"></div>
              `;
              container.parentNode.insertBefore(homeSearch, container.nextSibling);
              attachSearchEngine(homeSearch);
            }
          }
        }
      } else if (isToolPage) {
        // Place in Sidebar above Popular Tools on Tool Pages
        const allEls = Array.from(document.querySelectorAll("h1, h2, h3, h4, span, div, p, b"));
        const popEl = allEls.find(el => {
          const txt = (el.textContent || "").trim().toLowerCase();
          return txt.includes("popular tools") || txt.includes("popular");
        });

        if (popEl) {
          const sidebarCard = popEl.closest(".sidebar, aside, .card, div");
          if (sidebarCard && sidebarCard.parentElement) {
            const flexParent = sidebarCard.parentElement;
            flexParent.classList.add("dyn-two-column-layout");
            sidebarCard.classList.add("dyn-sidebar-card");

            if (!sidebarCard.querySelector(".dyn-tool-sidebar-search")) {
              const toolSearch = document.createElement("div");
              toolSearch.className = "dyn-search-wrapper dyn-tool-sidebar-search";
              toolSearch.style.marginBottom = "1.2rem";
              toolSearch.innerHTML = `
                <input type="text" class="dyn-search-input dyn-shared-search-input" placeholder="🔍 Search calculators..." autocomplete="off">
                <div class="dyn-search-dropdown"></div>
              `;
              sidebarCard.insertBefore(toolSearch, sidebarCard.firstChild);
              attachSearchEngine(toolSearch);
            }
          }
        }
      }

      // Safeguard: Ensure footer stays 100% full-width at the bottom
      const allTextEls = Array.from(document.querySelectorAll("div, footer, p, span"));
      const copyEl = allTextEls.find(el => {
        const txt = (el.textContent || "").trim().toLowerCase();
        return txt.includes("all rights reserved") && txt.includes("thequantcals") && el.children.length <= 2;
      });

      if (copyEl) {
        copyEl.classList.add("dyn-copyright-footer");
        if (copyEl.parentElement && copyEl.parentElement.classList.contains("dyn-two-column-layout")) {
          copyEl.parentElement.parentElement.appendChild(copyEl);
        }
      }
    }

    // 6. Drawer Toggle Handlers
    const hamburgerBtn = document.getElementById("dynHamburgerToggleBtn");
    const closeBtn = document.getElementById("dynCloseBtn");
    const drawer = document.getElementById("dynDrawer");
    const overlay = document.getElementById("dynOverlay");

    if (hamburgerBtn) {
      hamburgerBtn.onclick = () => {
        ensureDrawerSearch(); // Verify search is mounted before opening
        drawer.classList.add("open");
        overlay.classList.add("open");
      };
    }
    if (closeBtn) closeBtn.onclick = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };
    if (overlay) overlay.onclick = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };

    // 7. Theme Toggle Handler
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

    // 8. Search Engine & Discovery
    const baseTools = [
      { name: "Compound Interest Calculator", url: "/tools/Compound-Interest-Calculator.html" },
      { name: "Exam Marks Percentage Calculator", url: "/tools/Exam-Marks-Percentage-Calculator.html" },
      { name: "Accurate Age Calculator", url: "/tools/accurate-age-calculator.html" },
      { name: "Cosmic Weight Calculator", url: "/tools/Cosmic-Weight-Calculator.html" }
    ];

    let allDiscoveredTools = [...baseTools];

    const scanLinks = (rootDoc) => {
      try {
        rootDoc.querySelectorAll('a[href*="/tools/"], a[href*="calculator"]').forEach((a) => {
          const name = (a.textContent || "").trim().replace(/^[^a-zA-Z0-9]+/, "");
          const href = a.getAttribute("href");
          if (name && href && !allDiscoveredTools.some((t) => t.url === href || t.name === name)) {
            allDiscoveredTools.push({ name, url: href });
          }
        });
      } catch (e) {}
    };

    scanLinks(document);

    fetch("/")
      .then((res) => (res.ok ? res.text() : ""))
      .then((html) => {
        if (!html) return;
        const parser = new DOMParser();
        scanLinks(parser.parseFromString(html, "text/html"));
      })
      .catch(() => {});

    function attachSearchEngine(wrapper) {
      if (!wrapper) return;
      const input = wrapper.querySelector(".dyn-shared-search-input");
      const dropdown = wrapper.querySelector(".dyn-search-dropdown");
      if (!input || !dropdown || input.dataset.bound === "true") return;
      input.dataset.bound = "true";

      input.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
          dropdown.style.display = "none";
          dropdown.innerHTML = "";
          return;
        }

        const matches = allDiscoveredTools.filter((t) =>
          t.name.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
          dropdown.innerHTML = matches
            .map((m) => `<a href="${m.url}">${m.name}</a>`)
            .join("");
          dropdown.style.display = "block";
        } else {
          dropdown.innerHTML = `<div style="padding:0.6rem; font-size:0.8rem; color:#94a3b8;">No calculators found</div>`;
          dropdown.style.display = "block";
        }
      });
    }

    // Attach to initial drawer search
    attachSearchEngine(document.querySelector("#dynDrawer .dyn-drawer-search"));

    // Global outside click closer
    document.addEventListener("click", (e) => {
      document.querySelectorAll(".dyn-search-wrapper").forEach((wrap) => {
        if (!wrap.contains(e.target)) {
          const dd = wrap.querySelector(".dyn-search-dropdown");
          if (dd) dd.style.display = "none";
        }
      });
    });

    // Run placement passes
    ensureDrawerSearch();
    ensureDesktopSearch();
    window.addEventListener("resize", () => {
      ensureDrawerSearch();
      ensureDesktopSearch();
    });

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      ensureDrawerSearch();
      ensureDesktopSearch();
      if (attempts > 20) clearInterval(interval);
    }, 120);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }
})();
