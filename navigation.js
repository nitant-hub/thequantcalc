(function () {
  function initNavigation() {
    ["siteDynamicHeader", "dynDrawer", "dynOverlay"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

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

      /* Hide native unstyled search input */
      .sr input#q {
        display: none !important;
      }

      /* Keep 2-column layout active on category views */
      @media (min-width: 768px) {
        .grid {
          display: grid !important;
          grid-template-columns: 2.5fr 1fr !important;
          gap: 1.5rem !important;
          align-items: start !important;
        }
      }

      /* Standalone Tool Page sidebar reset */
      aside.sidebar {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
      }

      /* ========================================================
         SEARCH COMPONENT
         ======================================================== */
      .dyn-search-wrapper {
        position: relative !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }
      .dyn-search-wrapper.in-home-desktop {
        max-width: 100% !important;
        margin: 0.5rem 0 1rem 0 !important;
      }
      .dyn-search-wrapper.in-cat-left {
        max-width: 100% !important;
        margin: 0.8rem 0 1rem 0 !important;
      }
      .dyn-search-wrapper.in-sidebar {
        max-width: 100% !important;
        display: block !important;
        clear: both !important;
        margin: 0 !important;
        background: var(--bg-surface, #ffffff) !important;
        border: 1px solid var(--border-color, #e2e8f0) !important;
        border-radius: 16px !important;
        padding: 1.15rem 1.25rem !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
      }
      [data-theme="dark"] .dyn-search-wrapper.in-sidebar {
        background: var(--bg-surface, #1e293b) !important;
        border-color: var(--border-color, #334155) !important;
      }

      .dyn-modern-search-box {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 40px !important;
        background: var(--bg-primary, #f8fafc) !important;
        border: 1.5px solid var(--border-color, #cbd5e1) !important;
        border-radius: 20px !important;
        padding: 0 12px 0 14px !important;
        gap: 8px !important;
        box-sizing: border-box !important;
        transition: all 0.2s ease !important;
      }
      [data-theme="dark"] .dyn-modern-search-box {
        background: #0f172a !important;
        border-color: #334155 !important;
      }
      .dyn-modern-search-box:focus-within {
        border-color: #3b82f6 !important;
        background: var(--bg-surface, #ffffff) !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
      }
      [data-theme="dark"] .dyn-modern-search-box:focus-within {
        background: #0f172a !important;
      }

      .dyn-modern-icon {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: var(--text-muted, #64748b) !important;
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
        color: var(--text-main, #0f172a) !important;
        outline: none !important;
      }
      [data-theme="dark"] .dyn-modern-input {
        color: #f8fafc !important;
      }
      .dyn-modern-input::placeholder {
        color: var(--text-muted, #94a3b8) !important;
        font-size: 13px !important;
      }

      .dyn-modern-clear-btn {
        display: none;
        align-items: center !important;
        justify-content: center !important;
        background: var(--border-color, #e2e8f0) !important;
        color: var(--text-muted, #475569) !important;
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
      [data-theme="dark"] .dyn-modern-clear-btn {
        background: #334155 !important;
        color: #94a3b8 !important;
      }
      .dyn-modern-clear-btn:hover {
        color: #0f172a !important;
      }

      .dyn-search-dropdown {
        position: absolute !important; 
        top: calc(100% + 6px) !important; 
        left: 0 !important; 
        width: 100% !important; 
        max-height: 280px !important;
        overflow-y: auto !important; 
        background: var(--bg-surface, #ffffff) !important; 
        border: 1px solid var(--border-color, #e2e8f0) !important; 
        border-radius: 12px !important;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15) !important; 
        display: none; 
        z-index: 1000005 !important;
      }
      [data-theme="dark"] .dyn-search-dropdown {
        background: #1e293b !important;
        border-color: #334155 !important;
      }
      .dyn-search-dropdown a {
        display: flex !important; 
        align-items: center !important; 
        justify-content: space-between !important;
        padding: 0.65rem 0.85rem !important; 
        font-size: 0.88rem !important; 
        font-weight: 600 !important; 
        color: var(--text-main, #1e293b) !important; 
        text-decoration: none !important; 
        border-bottom: 1px solid var(--border-color, #f1f5f9) !important; 
      }
      [data-theme="dark"] .dyn-search-dropdown a {
        color: #f8fafc !important;
        border-bottom: 1px solid #334155 !important;
      }
      .dyn-search-dropdown a:hover { 
        background: var(--bg-primary, #f8fafc) !important; 
        color: #2563eb !important; 
      }
      [data-theme="dark"] .dyn-search-dropdown a:hover {
        background: #0f172a !important;
        color: #38bdf8 !important;
      }

      /* ADSENSE BOX (CARD CONTAINER) */
      .dyn-adsense-slot {
        width: 100% !important;
        min-height: 100px !important;
        background: var(--bg-surface, #ffffff) !important;
        border: 1px dashed var(--border-color, #cbd5e1) !important;
        border-radius: 12px !important;
        margin: 1rem 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: var(--text-muted, #94a3b8) !important;
        font-size: 0.85rem !important;
        box-sizing: border-box !important;
      }
      [data-theme="dark"] .dyn-adsense-slot {
        background: var(--bg-surface, #1e293b) !important;
        border-color: var(--border-color, #334155) !important;
      }

      .dyn-tools-card {
        background: var(--bg-surface, #ffffff) !important;
        border: 1px solid var(--border-color, #e2e8f0) !important;
        border-radius: 16px !important;
        padding: 1.75rem !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
        display: block !important;
        width: 100% !important;
      }
      [data-theme="dark"] .dyn-tools-card {
        background: var(--bg-surface, #1e293b) !important;
        border-color: var(--border-color, #334155) !important;
      }

      /* HEADER & NAVIGATION */
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
        background: var(--bg-surface, #ffffff) !important; 
        border-left: 1px solid var(--border-color, #e2e8f0) !important; 
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
      [data-theme="dark"] .dyn-drawer-menu {
        background: #0f172a !important;
        border-left-color: #334155 !important;
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
        text-decoration: none !important; color: var(--text-main, #1e293b) !important; font-weight: 600 !important; font-size: 0.92rem !important;
        padding: 0.5rem 0.6rem !important; border-radius: 6px !important; display: flex !important; align-items: center !important; gap: 0.55rem !important;
        cursor: pointer !important;
      }
      [data-theme="dark"] .dyn-drawer-menu a { color: #f8fafc !important; }
      .dyn-drawer-menu a:hover { background: var(--bg-primary, #f1f5f9) !important; color: #0284c7 !important; }
      [data-theme="dark"] .dyn-drawer-menu a:hover { background: #1e293b !important; color: #38bdf8 !important; }

      .dyn-backdrop-overlay { position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.55) !important; z-index: 999998 !important; display: none !important; }
      .dyn-backdrop-overlay.open { display: block !important; }

      @media (min-width: 768px) {
        .dyn-desktop-nav { display: flex !important; }
        .dyn-hamburger-btn, .dyn-drawer-menu, .dyn-backdrop-overlay { display: none !important; }
      }
    `;

    // HEADER & DRAWER LINKS
    const categories = [
      { name: "FINANCE", path: "/#/financial", slug: "financial", icon: "📈" },
      { name: "MATH", path: "/#/math", slug: "math", icon: "📐" },
      { name: "UTILITY", path: "/#/utility", slug: "utility", icon: "🧰" }
    ];
    const moreUrl = "/#/all";

    const desktopLinksHtml = categories
      .map((c) => `<a href="${c.path}" data-slug="${c.slug}" class="dyn-nav-item">${c.name}</a>`)
      .join("") + `<a href="${moreUrl}" data-slug="all" class="dyn-more-pill-btn">MORE</a>`;

    const mobileLinksHtml = categories
      .map((c) => `<a href="${c.path}" data-slug="${c.slug}" class="dyn-drawer-link"><span>${c.icon}</span> ${c.name.charAt(0) + c.name.slice(1).toLowerCase()}</a>`)
      .join("") + `<a href="${moreUrl}" data-slug="all" class="dyn-drawer-link"><span>📋</span> All Calculators/Tools</a>`;

    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <header id="siteDynamicHeader">
        <a href="/" class="dyn-brand"><div class="dyn-logo-icon">&sum;</div><span class="dyn-brand-text">thequantcals</span></a>
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
        <a href="/" class="dyn-drawer-link"><span>🏠</span> Home</a>
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

    // SEARCH NODE
    let globalSearchNode = document.getElementById("dynGlobalSearchNode");
    if (!globalSearchNode) {
      globalSearchNode = document.createElement("div");
      globalSearchNode.id = "dynGlobalSearchNode";
      globalSearchNode.className = "dyn-search-wrapper in-sidebar";
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
        // Also trigger the category view page filter if on category page
        const nativeInput = document.getElementById("q");
        if (nativeInput && nativeInput.offsetParent !== null) {
          nativeInput.value = q;
          if (typeof nativeInput.oninput === "function") nativeInput.oninput();
        }

        if (!q) {
          clearBtn.style.display = "none";
          dropdown.style.display = "none";
          dropdown.innerHTML = "";
          return;
        }
        clearBtn.style.display = "flex";
        const matches = allTools.filter((t) => t.name.toLowerCase().includes(q));
        if (!matches.length) {
          dropdown.innerHTML = `<div style="padding:0.75rem 0.9rem;font-size:0.85rem;color:var(--text-muted,#94a3b8);">No matching calculators found</div>`;
        } else {
          dropdown.innerHTML = matches.map((m) => {
            return `<a href="${m.url}"><span>${m.name}</span> <span style="font-size:0.75rem;color:var(--text-muted,#94a3b8);">→</span></a>`;
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

    // ADSENSE NODE
    let globalAdsenseNode = document.getElementById("dynAdsenseBox");
    if (!globalAdsenseNode) {
      globalAdsenseNode = document.createElement("div");
      globalAdsenseNode.id = "dynAdsenseBox";
      globalAdsenseNode.className = "dyn-adsense-slot";
      globalAdsenseNode.innerHTML = `<span>Advertisement</span>`;
    }

    // RELOCATION LOGIC
    function relocateSearch() {
      const isMobile = window.innerWidth < 768;
      const path = window.location.pathname.toLowerCase();
      const hash = (window.location.hash || "").toLowerCase();
      const isTool = path.includes("/tools/") || path.includes("calculator.html");
      const isCategory = hash.startsWith("#/") && hash.length > 2;

      // 1. Mobile Drawer
      if (isMobile) {
        const drawerSlot = document.getElementById("dynDrawerSearchSlot");
        globalSearchNode.className = "dyn-search-wrapper";
        if (drawerSlot && globalSearchNode.parentElement !== drawerSlot) {
          drawerSlot.appendChild(globalSearchNode);
        }
        if (globalAdsenseNode.parentElement) globalAdsenseNode.remove();
        return;
      }

      // 2. Desktop Category View (Financial, Math, Utility, All)
      // Move search option and adsense box to the LEFT column (#catView)
      if (isCategory) {
        const catView = document.getElementById("catView");
        const cols = document.getElementById("cols");
        if (catView && cols) {
          globalSearchNode.className = "dyn-search-wrapper in-cat-left";
          if (cols.previousElementSibling !== globalAdsenseNode) {
            catView.insertBefore(globalSearchNode, cols);
            catView.insertBefore(globalAdsenseNode, cols);
          }
          return;
        }
      }

      // 3. Desktop Homepage View: Under calculator
      if (!isCategory && !isTool) {
        const homeSlot = document.getElementById("homeSearchSlot");
        if (homeSlot) {
          globalSearchNode.className = "dyn-search-wrapper in-home-desktop";
          if (globalSearchNode.parentElement !== homeSlot) {
            homeSlot.appendChild(globalSearchNode);
          }
          if (globalAdsenseNode.parentElement) globalAdsenseNode.remove();
          return;
        }
      }

      // 4. Standalone Tool Page: Right column above Popular Tools
      const sidebarAside = document.querySelector("aside.sidebar");
      if (sidebarAside) {
        let toolsCard = sidebarAside.querySelector(".dyn-tools-card");
        if (!toolsCard) {
          toolsCard = document.createElement("div");
          toolsCard.className = "dyn-tools-card";
          while (sidebarAside.firstChild) {
            toolsCard.appendChild(sidebarAside.firstChild);
          }
          sidebarAside.appendChild(toolsCard);
        }

        globalSearchNode.className = "dyn-search-wrapper in-sidebar";
        if (sidebarAside.firstElementChild !== globalSearchNode) {
          sidebarAside.insertBefore(globalSearchNode, toolsCard);
        }
        if (globalAdsenseNode.parentElement) globalAdsenseNode.remove();
      }
    }

    syncActiveTab();
    relocateSearch();

    const observer = new MutationObserver(() => {
      relocateSearch();
    });
    observer.observe(document.body, { childList: true, subtree: true });

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
