(function () {
  function initNavigation() {
    ["siteDynamicHeader", "dynDrawer", "dynOverlay", "dynDesktopSidebarWrap"].forEach((id) => {
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
        margin: 0 !important;
        background-color: #f8fafc !important;
      }

      /* HIDE REDUNDANT DIRECTORY INTRO TEXT */
      p:has(+ input[placeholder*="calculator" i]),
      .category-desc,
      .all-calc-desc {
        display: none !important;
      }

      /* HIDE SIDEBAR & ADS ON HOMEPAGE */
      body:not(.dyn-is-category) #dynDesktopSidebarWrap,
      body:not(.dyn-is-category) #dynAdSenseSlot {
        display: none !important;
      }

      /* ========================================================
         CATEGORY MODE: CLEAN 2-COLUMN SPLIT (DESKTOP)
         ======================================================== */
      @media (min-width: 768px) {
        body.dyn-is-category .dyn-category-grid-parent {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
          gap: 24px !important;
          width: 100% !important;
          max-width: 1220px !important;
          margin: 14px auto 40px !important;
          padding: 0 16px !important;
          box-sizing: border-box !important;
        }

        /* 1. LEFT MAIN TOOLS AREA */
        body.dyn-is-category .dyn-main-card-left,
        body.dyn-is-category .dyn-main-card-left.card {
          flex: 1 1 calc(100% - 325px) !important;
          width: calc(100% - 325px) !important;
          max-width: calc(100% - 325px) !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding-top: 0 !important;
          box-sizing: border-box !important;
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        body.dyn-is-category .dyn-main-card-left * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        /* 2. RIGHT SIDEBAR PORTION (300px FIXED AT TOP ROW) */
        body.dyn-is-category #dynDesktopSidebarWrap {
          flex: 0 0 300px !important;
          width: 300px !important;
          max-width: 300px !important;
          min-width: 300px !important;
          margin: 0 !important;
          padding-top: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
          box-sizing: border-box !important;
        }

        body.dyn-is-category #dynDesktopSidebarWrap .card,
        body.dyn-is-category #dynDesktopSidebarWrap > div {
          width: 100% !important;
          max-width: 300px !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }

        body.dyn-is-category .dyn-main-card-left input[placeholder*="search" i] {
          display: none !important;
        }
      }

      /* TOOL PAGE: SEARCH BAR DOCKED IN SIDEBAR */
      .dyn-search-wrapper.in-tool-sidebar {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 18px 0 !important;
        box-sizing: border-box !important;
        display: block !important;
      }

      /* PUSH POPULAR TOOLS CARD DOWNWARD */
      .dyn-push-down-tools {
        margin-top: 18px !important;
      }

      /* ========================================================
         HIGH READABILITY & ATTRACTIVE SEARCH BAR
         ======================================================== */
      .dyn-search-wrapper {
        position: relative !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .dyn-search-wrapper.in-home-desktop {
        max-width: 460px !important;
        margin: 16px auto 24px !important;
      }

      .dyn-calcnet-search {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        gap: 6px !important;
        box-sizing: border-box !important;
        background: #ffffff !important;
        padding: 4px !important;
        border-radius: 8px !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05) !important;
      }
      .dyn-calcnet-search input {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        height: 38px !important;
        padding: 6px 12px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        letter-spacing: -0.2px !important;
        border: 1.5px solid #cbd5e1 !important;
        border-radius: 6px !important;
        background: #f8fafc !important;
        color: #0f172a !important;
        box-sizing: border-box !important;
        outline: none !important;
        transition: all 0.2s ease !important;
      }
      .dyn-calcnet-search input::placeholder {
        color: #64748b !important;
        font-weight: 500 !important;
      }
      .dyn-calcnet-search input:focus {
        border-color: #2563eb !important;
        background: #ffffff !important;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
      }
      .dyn-calcnet-search button {
        height: 38px !important;
        padding: 0 16px !important;
        font-size: 13.5px !important;
        font-weight: 800 !important;
        letter-spacing: 0.3px !important;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
        color: #ffffff !important;
        border: none !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3) !important;
        transition: all 0.18s ease !important;
        flex-shrink: 0 !important;
      }
      .dyn-calcnet-search button:hover {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 10px rgba(37, 99, 235, 0.4) !important;
      }

      /* ADSENSE UNIT PLACEHOLDER (CATEGORY PAGES ONLY) */
      #dynAdSenseSlot {
        display: none;
        width: 300px;
        min-height: 250px;
        background: #f1f5f9;
        border: 1px dashed #cbd5e1;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #64748b;
        font-size: 13px;
        font-weight: 600;
        box-sizing: border-box;
      }
      @media (min-width: 768px) {
        body.dyn-is-category #dynAdSenseSlot {
          display: flex !important;
        }
      }

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

      /* CATEGORIES HEADER ITEMS */
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

      /* DISTINCT MORE BUTTON */
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
      
      /* MOBILE DRAWER: 60vw WIDTH WITH ISOLATED Y SCROLLING */
      .dyn-drawer-menu {
        position: fixed !important; 
        top: 0 !important; 
        right: -75vw !important; 
        width: 60vw !important; 
        min-width: 210px !important;
        max-width: 250px !important;
        height: 100vh !important; 
        height: 100dvh !important;
        background: #fff !important; 
        border-left: 1px solid #e2e8f0 !important; 
        padding: 0.6rem 0.8rem 2rem !important; 
        display: flex !important; 
        flex-direction: column !important; 
        gap: 0.5rem !important; 
        transition: right 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-shadow: -10px 0 30px rgba(0,0,0,0.25) !important; 
        z-index: 1000000 !important; 
        overflow-y: auto !important; 
        overscroll-behavior: contain !important;
        box-sizing: border-box !important;
        -webkit-overflow-scrolling: touch !important;
      }
      [data-theme="dark"] .dyn-drawer-menu { 
        background: #0b132b !important; 
        border-left: 1px solid rgba(255,255,255,0.1) !important; 
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
        transition: all 0.15s ease !important;
      }

      .dyn-drawer-menu a {
        text-decoration: none !important; color: #1e293b !important; font-weight: 600 !important; font-size: 0.92rem !important;
        padding: 0.5rem 0.6rem !important; border-radius: 6px !important; display: flex !important; align-items: center !important; gap: 0.55rem !important;
        cursor: pointer !important;
      }
      [data-theme="dark"] .dyn-drawer-menu a { color: #e2e8f0 !important; }
      .dyn-drawer-menu a:hover { background: #f1f5f9 !important; color: #0284c7 !important; }
      [data-theme="dark"] .dyn-drawer-menu a:hover { background: rgba(56,189,248,0.15) !important; color: #38bdf8 !important; }

      .dyn-backdrop-overlay { position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.55) !important; z-index: 999998 !important; display: none !important; }
      .dyn-backdrop-overlay.open { display: block !important; }

      @media (min-width: 768px) {
        .dyn-desktop-nav { display: flex !important; }
        .dyn-hamburger-btn, .dyn-drawer-menu, .dyn-backdrop-overlay { display: none !important; }
      }

      /* SEARCH DROPDOWN STYLING */
      .dyn-search-dropdown {
        position: absolute !important; 
        top: calc(100% + 4px) !important; 
        left: 0 !important; 
        width: 100% !important; 
        max-height: 280px !important;
        overflow-y: auto !important; 
        background: #ffffff !important; 
        border: 1px solid #cbd5e1 !important; 
        border-radius: 6px !important;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important; 
        display: none; 
        z-index: 1000005 !important;
      }
      .dyn-search-dropdown a {
        display: flex !important; 
        align-items: center !important; 
        justify-content: space-between !important;
        padding: 0.65rem 0.8rem !important; 
        font-size: 0.9rem !important; 
        font-weight: 600 !important; 
        color: #1a202c !important; 
        text-decoration: none !important; 
        border-bottom: 1px solid #f1f5f9 !important; 
      }
      .dyn-search-dropdown a:hover { 
        background: #edf2f7 !important; 
        color: #2b6cb0 !important; 
      }
    `;

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

    document.querySelectorAll(".dyn-desktop-nav a.dyn-nav-item, .dyn-more-pill-btn, .dyn-drawer-link, .dyn-brand").forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (link.classList.contains("dyn-drawer-link")) {
          closeDrawer();
        }

        const isGoingHome = href === "/" || href === "";
        const wasHome = !window.location.hash || window.location.hash === "#" || window.location.hash === "#/";

        if (isGoingHome) {
          if (!wasHome) {
            e.preventDefault();
            window.location.href = "/";
          }
          return;
        }

        if (wasHome) {
          e.preventDefault();
          window.location.href = href;
          window.location.reload();
          return;
        }

        setTimeout(relocateSearchAndLayout, 10);
      });
    });

    syncActiveTab();
    window.addEventListener("hashchange", () => {
      syncActiveTab();
      relocateSearchAndLayout();
    });
    window.addEventListener("popstate", () => {
      syncActiveTab();
      relocateSearchAndLayout();
    });

    const allTools = [
      { name: "Compound Interest Calculator", url: "/tools/Compound-Interest-Calculator.html" },
      { name: "Exam Marks Percentage Calculator", url: "/tools/Exam-Marks-Percentage-Calculator.html" },
      { name: "Accurate Age Calculator", url: "/tools/accurate-age-calculator.html" },
      { name: "Cosmic Weight Calculator", url: "/tools/cosmic-weight.html" }
    ];
    const scanLinks = (rootDoc) => {
      try {
        rootDoc.querySelectorAll('a[href*="/tools/"]').forEach((a) => {
          const name = (a.textContent || "").trim().replace(/^[^a-zA-Z0-9]+/, "");
          const href = a.getAttribute("href");
          if (name && href && !allTools.some((t) => t.url === href || t.name === name)) allTools.push({ name, url: href });
        });
      } catch (e) {}
    };
    scanLinks(document);

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

    drawer.querySelectorAll(".dyn-drawer-link").forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

    // ========================================================
    // SINGLE HIGH-READABILITY SEARCH BOX NODE
    // ========================================================
    let globalSearchNode = document.getElementById("dynGlobalSearchNode");
    if (!globalSearchNode) {
      globalSearchNode = document.createElement("div");
      globalSearchNode.id = "dynGlobalSearchNode";
      globalSearchNode.className = "dyn-search-wrapper";
      globalSearchNode.innerHTML = `
        <div class="dyn-calcnet-search">
          <input type="text" class="dyn-search-input" placeholder="Search calculators..." autocomplete="off">
          <button type="button">Search</button>
        </div>
        <div class="dyn-search-dropdown"></div>
      `;

      const input = globalSearchNode.querySelector(".dyn-search-input");
      const btn = globalSearchNode.querySelector("button");
      const dropdown = globalSearchNode.querySelector(".dyn-search-dropdown");

      function renderList(q) {
        if (!q) {
          dropdown.style.display = "none";
          dropdown.innerHTML = "";
          return;
        }
        const matches = allTools.filter((t) => t.name.toLowerCase().includes(q));
        if (!matches.length) {
          dropdown.innerHTML = `<div style="padding:0.7rem;font-size:0.85rem;color:#718096;">No calculators found</div>`;
        } else {
          dropdown.innerHTML = matches.map((m) => {
            return `<a href="${m.url}"><span>${m.name}</span> <span style="font-size:0.75rem;color:#718096;">→</span></a>`;
          }).join("");
        }
        dropdown.style.display = "block";
      }

      input.addEventListener("input", (e) => renderList(e.target.value.trim().toLowerCase()));
      btn.addEventListener("click", () => renderList(input.value.trim().toLowerCase()));

      document.addEventListener("click", (e) => {
        if (!globalSearchNode.contains(e.target)) dropdown.style.display = "none";
      });
    }

    // HELPER: Find the specific Popular Tools card/header without picking root containers
    function findPopularToolsCard() {
      const candidates = Array.from(document.querySelectorAll("h2, h3, h4, .title, strong, b, div, aside"));
      for (const el of candidates) {
        const text = (el.textContent || "").trim().toLowerCase();
        if ((text.includes("popular tools") || text.includes("popular calculators")) && el !== globalSearchNode) {
          // If this is a small heading/title, get its container card
          const card = el.closest(".card, aside, .sidebar") || (el.tagName.startsWith("H") ? el.parentElement : el);
          if (card && card !== document.body && card.offsetWidth < 500) {
            return card;
          }
        }
      }
      return null;
    }

    // ========================================================
    // TELEPORT SEARCH: DOCKED IN SIDEBAR JUST ABOVE POPULAR TOOLS
    // ========================================================
    let isLayoutUpdating = false;
    function relocateSearchAndLayout() {
      if (isLayoutUpdating) return;

      const isMobile = window.innerWidth < 768;
      const hash = (window.location.hash || "").toLowerCase();
      const isCategoryView = hash.startsWith("#/") && hash.length > 2;

      // 1. MOBILE PLACEMENT: Search goes inside Hamburger Drawer
      if (isMobile) {
        document.body.classList.remove("dyn-is-category");
        const existingSidebar = document.getElementById("dynDesktopSidebarWrap");
        if (existingSidebar) existingSidebar.remove();

        globalSearchNode.className = "dyn-search-wrapper";
        const drawerSlot = document.getElementById("dynDrawerSearchSlot");
        if (drawerSlot && globalSearchNode.parentElement !== drawerSlot) {
          drawerSlot.appendChild(globalSearchNode);
        }
        return;
      }

      // Check if this page has an isolated Popular Tools sidebar block (Tool Page)
      const popularToolsCard = findPopularToolsCard();

      // 2. TOOL PAGES WITH SIDEBAR: Place Search directly in the right sidebar above Popular Tools
      if (!isCategoryView && popularToolsCard && popularToolsCard.parentElement) {
        globalSearchNode.className = "dyn-search-wrapper in-tool-sidebar";
        popularToolsCard.classList.add("dyn-push-down-tools");

        const sidebarParent = popularToolsCard.parentElement;
        if (popularToolsCard.previousElementSibling !== globalSearchNode) {
          sidebarParent.insertBefore(globalSearchNode, popularToolsCard);
        }
        return;
      }

      // 3. DESKTOP HOME PAGE: Below the interactive calculator
      if (!isCategoryView) {
        document.body.classList.remove("dyn-is-category");
        const existingSidebar = document.getElementById("dynDesktopSidebarWrap");
        if (existingSidebar) existingSidebar.remove();

        const gridParent = document.querySelector(".dyn-category-grid-parent");
        if (gridParent) gridParent.classList.remove("dyn-category-grid-parent");
        const mainCard = document.querySelector(".dyn-main-card-left");
        if (mainCard) mainCard.classList.remove("dyn-main-card-left");

        const calcCard = Array.from(document.querySelectorAll("div, section, .card")).find((el) => {
          const t = (el.textContent || "").toLowerCase();
          return t.includes("interactive calculator") || el.querySelector(".calc-grid") || el.classList.contains("calc-card");
        });

        globalSearchNode.className = "dyn-search-wrapper in-home-desktop";
        if (calcCard && calcCard.parentElement) {
          if (globalSearchNode.nextSibling !== calcCard.nextSibling || globalSearchNode.parentElement !== calcCard.parentElement) {
            calcCard.insertAdjacentElement("afterend", globalSearchNode);
          }
        }
        return;
      }

      // 4. DESKTOP CATEGORY PAGES: In Right Sidebar Just Above Popular Tools
      document.body.classList.add("dyn-is-category");
      globalSearchNode.className = "dyn-search-wrapper in-tool-sidebar";

      const mainCard = Array.from(document.querySelectorAll("div, section, .card")).find((el) => {
        const h = el.querySelector("h1, h2");
        return h && /calculators|tools/i.test(h.textContent);
      }) || document.querySelector(".card");

      if (!mainCard) return;

      const parentContainer = mainCard.parentElement;
      if (!parentContainer) return;

      isLayoutUpdating = true;
      try {
        parentContainer.classList.add("dyn-category-grid-parent");
        mainCard.classList.add("dyn-main-card-left");

        let sidebar = document.getElementById("dynDesktopSidebarWrap");
        if (!sidebar) {
          sidebar = document.createElement("aside");
          sidebar.id = "dynDesktopSidebarWrap";

          // Top item: 300x250 AdSense Unit
          const adSlot = document.createElement("div");
          adSlot.id = "dynAdSenseSlot";
          adSlot.innerHTML = `<span>Advertisement (300x250)</span>`;
          sidebar.appendChild(adSlot);

          // Second item: Search Option placed directly above Popular Tools
          sidebar.appendChild(globalSearchNode);

          // Find secondary cards (Popular Tools, Categories, System Status)
          const secondaryCards = Array.from(parentContainer.children).filter((el) => {
            if (el === mainCard || el === sidebar || el === globalSearchNode) return false;
            const text = (el.textContent || "").toLowerCase();
            return text.includes("popular tools") || text.includes("categories") || text.includes("system status");
          });

          // Insert secondary blocks below the search box
          secondaryCards.forEach((c) => {
            if (c && c.parentElement && c !== sidebar) {
              sidebar.appendChild(c);
            }
          });

          parentContainer.appendChild(sidebar);
        } else {
          const popTools = Array.from(sidebar.children).find((el) => {
            return (el.textContent || "").toLowerCase().includes("popular tools") && el !== globalSearchNode;
          });
          if (popTools) {
            if (popTools.previousElementSibling !== globalSearchNode) {
              sidebar.insertBefore(globalSearchNode, popTools);
            }
          } else if (sidebar.lastElementChild !== globalSearchNode) {
            sidebar.appendChild(globalSearchNode);
          }
        }
      } finally {
        setTimeout(() => { isLayoutUpdating = false; }, 30);
      }
    }

    const observer = new MutationObserver(() => {
      const isMobile = window.innerWidth < 768;
      const hash = (window.location.hash || "").toLowerCase();
      const isCategoryView = hash.startsWith("#/") && hash.length > 2;

      if (!isCategoryView && !isMobile && !findPopularToolsCard()) {
        const existingSidebar = document.getElementById("dynDesktopSidebarWrap");
        if (existingSidebar) existingSidebar.remove();
        document.body.classList.remove("dyn-is-category");
      } else {
        relocateSearchAndLayout();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    relocateSearchAndLayout();
    window.addEventListener("resize", relocateSearchAndLayout);

    const themeBtn = document.getElementById("dynThemeToggleBtn");
    const rootEl = document.documentElement;
    if (localStorage.getItem("theme") === "dark") { rootEl.setAttribute("data-theme", "dark"); themeBtn.textContent = "☀️"; }
    themeBtn.onclick = () => {
      const d = rootEl.getAttribute("data-theme") === "dark";
      rootEl.setAttribute("data-theme", d ? "light" : "dark");
      localStorage.setItem("theme", d ? "light" : "dark");
      themeBtn.textContent = d ? "🌙" : "☀️";
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initNavigation);
  else initNavigation();
})();
