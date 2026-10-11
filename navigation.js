(function () {
  function initNavigation() {
    // 1. Clean up any previous headers or drawers
    ["siteDynamicHeader", "dynDrawer", "dynOverlay", "dynDesktopSidebarWrap", "dynToolSidebar"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    // 2. Inject navigation & search styles
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
      @media (min-width: 768px) {
        :root { 
          --nav-header-height: 68px; 
        }
      }

      body { 
        padding-top: var(--nav-header-height) !important; 
      }

      /* Hide redundant in-card category search input */
      .sr input#q {
        display: none !important;
      }

      /* ========================================================
         MODERN INTEGRATED SEARCH BAR (NO SEPARATE BLUE BUTTON)
         ======================================================== */
      .dyn-search-wrapper {
        position: relative !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .dyn-search-wrapper.in-home-desktop {
        max-width: 100% !important;
        margin: 0.5rem 0 1rem 0 !important;
      }
      .dyn-search-wrapper.in-sidebar {
        width: 100% !important;
        margin-bottom: 1rem !important;
        display: block !important;
      }

      .dyn-modern-search-box {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 42px !important;
        background: var(--surface, #ffffff) !important;
        border: 1.5px solid var(--border, #cbd5e1) !important;
        border-radius: 24px !important;
        padding: 0 12px 0 14px !important;
        gap: 8px !important;
        box-sizing: border-box !important;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05) !important;
        transition: all 0.2s ease !important;
      }
      .dyn-modern-search-box:focus-within {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
      }

      .dyn-modern-icon {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: var(--muted, #64748b) !important;
        font-size: 14px !important;
        flex-shrink: 0 !important;
      }

      .dyn-modern-input {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        height: 100% !important;
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
        font-size: 13.5px !important;
        font-weight: 500 !important;
        color: var(--text, #0f172a) !important;
        outline: none !important;
      }
      .dyn-modern-input::placeholder {
        color: var(--muted, #94a3b8) !important;
        font-size: 13px !important;
      }

      .dyn-modern-clear-btn {
        display: none;
        align-items: center !important;
        justify-content: center !important;
        background: var(--border, #e2e8f0) !important;
        color: var(--muted, #475569) !important;
        border: none !important;
        border-radius: 50% !important;
        width: 18px !important;
        height: 18px !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
        cursor: pointer !important;
        flex-shrink: 0 !important;
        padding: 0 !important;
      }
      .dyn-modern-clear-btn:hover {
        color: var(--text, #0f172a) !important;
      }

      /* SEARCH DROPDOWN STYLING */
      .dyn-search-dropdown {
        position: absolute !important; 
        top: calc(100% + 6px) !important; 
        left: 0 !important; 
        width: 100% !important; 
        max-height: 280px !important;
        overflow-y: auto !important; 
        background: var(--surface, #ffffff) !important; 
        border: 1px solid var(--border, #e2e8f0) !important; 
        border-radius: 12px !important;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15) !important; 
        display: none; 
        z-index: 1000005 !important;
      }
      .dyn-search-dropdown a {
        display: flex !important; 
        align-items: center !important; 
        justify-content: space-between !important;
        padding: 0.65rem 0.85rem !important; 
        font-size: 0.88rem !important; 
        font-weight: 600 !important; 
        color: var(--text, #1e293b) !important; 
        text-decoration: none !important; 
        border-bottom: 1px solid var(--border, #f1f5f9) !important; 
      }
      .dyn-search-dropdown a:hover { 
        background: var(--bg, #f8fafc) !important; 
        color: var(--link, #2563eb) !important; 
      }

      /* ========================================================
         HEADER BAR
         ======================================================== */
      header#siteDynamicHeader {
        position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important;
        height: var(--nav-header-height) !important; z-index: 999999 !important; box-sizing: border-box !important;
        background: linear-gradient(135deg, #020818 0%, #0d1f5c 40%, #1a3a8f 75%, #0e2d6b 100%) !important;
        border-bottom: 1px solid rgba(99, 179, 255, 0.25) !important;
        box-shadow: 0 4px 20px rgba(10, 20, 80, 0.4) !important;
        display: flex !important; align-items: center !important; justify-content: space-between !important;
        padding: 0 1.5rem !important;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
      }
      .dyn-brand { display: flex !important; align-items: center !important; gap: 0.65rem !important; text-decoration: none !important; }
      .dyn-logo-icon {
        background: linear-gradient(135deg, #2563eb, #7c3aed) !important; width: 36px !important; height: 36px !important;
        border-radius: 8px !important; display: flex !important; align-items: center !important; justify-content: center !important;
        color: #fff !important; font-weight: 800 !important; font-size: 1.2rem !important;
      }
      .dyn-brand-text {
        font-size: 1.3rem !important; font-weight: 800 !important; letter-spacing: -0.4px !important;
        background: linear-gradient(90deg, #e0f2fe 0%, #bae6fd 60%, #c7d2fe 100%) !important;
        -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
      }

      .dyn-desktop-nav { 
        display: none; 
        align-items: center; 
        gap: 0.8rem; 
        height: 100%; 
        margin-left: auto; 
        margin-right: 1.2rem; 
      }
      .dyn-desktop-nav a.dyn-nav-item {
        text-decoration: none !important; 
        font-size: 1.08rem !important; 
        font-weight: 800 !important; 
        letter-spacing: 0.5px !important; 
        color: #f8fafc !important;
        height: 100% !important; 
        display: flex !important; 
        align-items: center !important; 
        padding: 0 0.95rem !important;
        border-bottom: 3.5px solid transparent !important; 
        text-transform: uppercase !important;
        cursor: pointer !important;
        transition: all 0.16s ease !important;
      }
      .dyn-desktop-nav a.dyn-nav-item:hover { 
        color: #38bdf8 !important; 
        background: rgba(255,255,255,0.09) !important; 
      }
      .dyn-desktop-nav a.dyn-nav-item.is-active { 
        color: #38bdf8 !important; 
        border-bottom: 3.5px solid #38bdf8 !important; 
        background: rgba(30,58,138,0.55) !important; 
      }

      .dyn-more-pill-btn {
        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%) !important; 
        border: 1px solid rgba(255, 255, 255, 0.45) !important; 
        color: #ffffff !important;
        font-weight: 900 !important; 
        font-size: 0.96rem !important; 
        letter-spacing: 0.6px !important;
        padding: 0.45rem 1.15rem !important; 
        border-radius: 20px !important;
        height: auto !important; 
        text-transform: uppercase !important;
        text-decoration: none !important;
        box-shadow: 0 3px 14px rgba(236, 72, 153, 0.45) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      .dyn-more-pill-btn:hover { 
        background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%) !important; 
        transform: translateY(-1px) scale(1.03) !important;
        box-shadow: 0 5px 18px rgba(236, 72, 153, 0.65) !important;
      }

      .dyn-right-controls { display: flex !important; align-items: center !important; gap: 0.75rem !important; }
      .dyn-theme-btn {
        background: rgba(255,255,255,0.1) !important; border: 1px solid rgba(255,255,255,0.2) !important; border-radius: 8px !important;
        font-size: 1.05rem !important; cursor: pointer !important; color: #fff !important; width: 36px !important; height: 36px !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
      }
      .dyn-hamburger-btn { background: none !important; border: none !important; cursor: pointer !important; display: flex !important; flex-direction: column !important; gap: 5px !important; padding: 4px !important; }
      .dyn-hamburger-btn span { width: 22px !important; height: 2.5px !important; background: #fff !important; border-radius: 2px !important; display: block !important; }
      
      /* MOBILE DRAWER */
      .dyn-drawer-menu {
        position: fixed !important; 
        top: 0 !important; 
        right: -75vw !important; 
        width: 60vw !important; 
        min-width: 210px !important;
        max-width: 250px !important;
        height: 100vh !important; 
        height: 100dvh !important;
        background: var(--surface, #fff) !important; 
        border-left: 1px solid var(--border, #e2e8f0) !important; 
        padding: 0.6rem 0.8rem 2rem !important; 
        display: flex !important; 
        flex-direction: column !important; 
        gap: 0.6rem !important; 
        transition: right 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-shadow: -10px 0 30px rgba(0,0,0,0.25) !important; 
        z-index: 1000000 !important; 
        overflow-y: auto !important; 
        overscroll-behavior: contain !important;
        box-sizing: border-box !important;
      }
      .dyn-drawer-menu.open { right: 0 !important; }

      .dyn-drawer-top-action {
        display: flex !important;
        justify-content: flex-end !important;
        align-items: center !important;
        width: 100% !important;
        margin-bottom: 0.15rem !important;
      }

      .dyn-close-btn { 
        background: #fee2e2 !important; 
        border: 1px solid #fca5a5 !important; 
        border-radius: 8px !important;
        width: 28px !important;
        height: 28px !important;
        font-size: 1.05rem !important; 
        font-weight: 800 !important;
        color: #ef4444 !important; 
        cursor: pointer !important; 
        line-height: 1 !important; 
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
      }

      .dyn-drawer-menu a {
        text-decoration: none !important; color: var(--text, #1e293b) !important; font-weight: 600 !important; font-size: 0.92rem !important;
        padding: 0.5rem 0.6rem !important; border-radius: 6px !important; display: flex !important; align-items: center !important; gap: 0.55rem !important;
        cursor: pointer !important;
      }
      .dyn-drawer-menu a:hover { background: var(--bg, #f1f5f9) !important; color: var(--link, #0284c7) !important; }

      .dyn-backdrop-overlay { position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.55) !important; z-index: 999998 !important; display: none !important; }
      .dyn-backdrop-overlay.open { display: block !important; }

      @media (min-width: 768px) {
        .dyn-desktop-nav { display: flex !important; }
        .dyn-hamburger-btn, .dyn-drawer-menu, .dyn-backdrop-overlay { display: none !important; }
      }
    `;

    // 3. Mount Header Bar & Drawer
    const categories = [
      { name: "FINANCE", path: "#/financial", slug: "financial", icon: "📈" },
      { name: "MATH", path: "#/math", slug: "math", icon: "📐" },
      { name: "UTILITY", path: "#/utility", slug: "utility", icon: "🧰" }
    ];
    const moreUrl = "#/all";

    const desktopLinksHtml = categories
      .map((c) => `<a href="${c.path}" data-slug="${c.slug}" class="dyn-nav-item">${c.name}</a>`)
      .join("") + `<a href="${moreUrl}" data-slug="all" class="dyn-more-pill-btn">MORE</a>`;

    const mobileLinksHtml = categories
      .map((c) => `<a href="${c.path}" data-slug="${c.slug}" class="dyn-drawer-link"><span>${c.icon}</span> ${c.name.charAt(0) + c.name.slice(1).toLowerCase()}</a>`)
      .join("") + `<a href="${moreUrl}" data-slug="all" class="dyn-drawer-link"><span>📋</span> All Calculators/Tools</a>`;

    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <header id="siteDynamicHeader">
        <a href="#/" class="dyn-brand"><div class="dyn-logo-icon">&sum;</div><span class="dyn-brand-text">thequantcals</span></a>
        <nav class="dyn-desktop-nav">${desktopLinksHtml}</nav>
        <div class="dyn-right-controls">
          <button id="dynThemeToggleBtn" class="dyn-theme-btn" aria-label="Toggle Theme">🌙</button>
          <button id="dynHamburgerToggleBtn" class="dyn-hamburger-btn" aria-label="Open Navigation"><span></span><span></span><span></span></button>
        </div>
      </header>
      <div class="dyn-backdrop-overlay" id="dynOverlay"></div>
      <aside class="dyn-drawer-menu" id="dynDrawer">
        <div class="dyn-drawer-top-action">
          <button class="dyn-close-btn" id="dynCloseBtn" aria-label="Close menu">&times;</button>
        </div>
        <div id="dynDrawerSearchSlot"></div>
        <a href="#/" class="dyn-drawer-link"><span>🏠</span> Home</a>
        ${mobileLinksHtml}
      </aside>
    `;
    document.body.insertAdjacentElement("afterbegin", navContainer);

    function syncActiveTab() {
      const hash = (window.location.hash || "").toLowerCase();
      document.querySelectorAll(".dyn-desktop-nav a.dyn-nav-item").forEach((link) => {
        const slug = (link.getAttribute("data-slug") || "").toLowerCase();
        if (slug && hash.includes(slug)) {
          link.classList.add("is-active");
        } else {
          link.classList.remove("is-active");
        }
      });
    }

    const drawer = document.getElementById("dynDrawer");
    const overlay = document.getElementById("dynOverlay");
    const closeDrawer = () => { 
      drawer.classList.remove("open"); 
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    };
    const openDrawer = () => {
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    document.getElementById("dynHamburgerToggleBtn").onclick = openDrawer;
    document.getElementById("dynCloseBtn").onclick = closeDrawer;
    overlay.onclick = closeDrawer;
    drawer.querySelectorAll(".dyn-drawer-link").forEach((link) => link.addEventListener("click", closeDrawer));

    // 4. Single Search Component Instance
    let globalSearchNode = document.getElementById("dynGlobalSearchNode");
    if (!globalSearchNode) {
      globalSearchNode = document.createElement("div");
      globalSearchNode.id = "dynGlobalSearchNode";
      globalSearchNode.className = "dyn-search-wrapper";
      globalSearchNode.innerHTML = `
        <div class="dyn-modern-search-box">
          <span class="dyn-modern-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input type="text" class="dyn-modern-input" placeholder="Search calculators..." autocomplete="off">
          <button type="button" class="dyn-modern-clear-btn" aria-label="Clear">&times;</button>
        </div>
        <div class="dyn-search-dropdown"></div>
      `;

      const input = globalSearchNode.querySelector(".dyn-modern-input");
      const clearBtn = globalSearchNode.querySelector(".dyn-modern-clear-btn");
      const dropdown = globalSearchNode.querySelector(".dyn-search-dropdown");

      const allTools = [
        { name: "Compound Interest Calculator", url: "/tools/Compound-Interest-Calculator.html" },
        { name: "Exam Marks Percentage Calculator", url: "/tools/Exam-Marks-Percentage-Calculator.html" },
        { name: "Accurate Age Calculator", url: "/tools/accurate-age-calculator.html" },
        { name: "Cosmic Weight Calculator", url: "/tools/cosmic-weight.html" }
      ];

      function renderList(q) {
        if (!q) {
          clearBtn.style.display = "none";
          dropdown.style.display = "none";
          dropdown.innerHTML = "";
          return;
        }
        clearBtn.style.display = "flex";
        const matches = allTools.filter((t) => t.name.toLowerCase().includes(q));
        if (!matches.length) {
          dropdown.innerHTML = `<div style="padding:0.75rem 0.9rem;font-size:0.85rem;color:var(--muted,#94a3b8);">No matching calculators found</div>`;
        } else {
          dropdown.innerHTML = matches.map((m) => {
            return `<a href="${m.url}"><span>${m.name}</span> <span style="font-size:0.75rem;color:var(--muted,#94a3b8);">→</span></a>`;
          }).join("");
        }
        dropdown.style.display = "block";
      }

      input.addEventListener("input", (e) => renderList(e.target.value.trim().toLowerCase()));
      clearBtn.addEventListener("click", () => {
        input.value = "";
        renderList("");
        input.focus();
      });

      document.addEventListener("click", (e) => {
        if (!globalSearchNode.contains(e.target)) dropdown.style.display = "none";
      });
    }

    // 5. Intelligent Mount System (Uses your HTML's native layout containers)
    function relocateSearch() {
      const isMobile = window.innerWidth < 768;
      const hash = (window.location.hash || "").toLowerCase();
      const isCategoryView = hash.startsWith("#/") && hash.length > 2;

      // Mobile: mount into drawer
      if (isMobile) {
        const drawerSlot = document.getElementById("dynDrawerSearchSlot");
        globalSearchNode.className = "dyn-search-wrapper";
        if (drawerSlot && globalSearchNode.parentElement !== drawerSlot) {
          drawerSlot.appendChild(globalSearchNode);
        }
        return;
      }

      // Desktop: Home Page (mount into #homeSearchSlot)
      if (!isCategoryView && !isToolPage) {
        const homeSlot = document.getElementById("homeSearchSlot");
        globalSearchNode.className = "dyn-search-wrapper in-home-desktop";
        if (homeSlot && globalSearchNode.parentElement !== homeSlot) {
          homeSlot.appendChild(globalSearchNode);
        }
        return;
      }

      // Desktop: Category or Tool Pages (mount into native #sidebarSearchSlot)
      const sidebarSlot = document.getElementById("sidebarSearchSlot");
      if (sidebarSlot) {
        globalSearchNode.className = "dyn-search-wrapper in-sidebar";
        if (globalSearchNode.parentElement !== sidebarSlot) {
          sidebarSlot.appendChild(globalSearchNode);
        }
      } else {
        // Fallback for standalone tool pages lacking #sidebarSearchSlot
        const popTools = Array.from(document.querySelectorAll(".box, .card")).find((el) => {
          return (el.textContent || "").toLowerCase().includes("popular tools") && el !== globalSearchNode;
        });
        if (popTools && popTools.parentElement) {
          globalSearchNode.className = "dyn-search-wrapper in-sidebar";
          if (popTools.previousElementSibling !== globalSearchNode) {
            popTools.parentElement.insertBefore(globalSearchNode, popTools);
          }
        }
      }
    }

    syncActiveTab();
    relocateSearch();

    window.addEventListener("hashchange", () => {
      syncActiveTab();
      relocateSearch();
    });
    window.addEventListener("resize", relocateSearch);

    // Theme Toggle
    const themeBtn = document.getElementById("dynThemeToggleBtn");
    const rootEl = document.documentElement;
    if (localStorage.getItem("theme") === "dark") {
      rootEl.setAttribute("data-theme", "dark");
      themeBtn.textContent = "☀️";
    }
    themeBtn.onclick = () => {
      const isDark = rootEl.getAttribute("data-theme") === "dark";
      const nextTheme = isDark ? "light" : "dark";
      rootEl.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      themeBtn.textContent = isDark ? "🌙" : "☀️";
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }
})();
