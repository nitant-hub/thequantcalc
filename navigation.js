(function () {
  const currentPath = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash.toLowerCase();
  const isToolPage = currentPath.includes("/tools/") || currentPath.includes("calculator.html");
  const isHomePage = !isToolPage;

  function initNavigation() {
    ["siteDynamicHeader", "dynDrawer", "dynOverlay", "dynDesktopSearchWrap"].forEach((id) => {
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
          --nav-header-height: 66px; 
        }
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
        box-sizing: border-box !important;
        background: linear-gradient(135deg, #020818 0%, #0d1f5c 40%, #1a3a8f 75%, #0e2d6b 100%) !important;
        border-bottom: 1px solid rgba(99, 179, 255, 0.28) !important;
        box-shadow: 0 4px 22px rgba(10, 20, 80, 0.45) !important;
        display: flex !important; 
        align-items: center !important; 
        justify-content: space-between !important;
        padding: 0 1.5rem !important;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
      }

      .dyn-brand { 
        display: flex !important; 
        align-items: center !important; 
        gap: 0.65rem !important; 
        text-decoration: none !important; 
      }
      .dyn-logo-icon {
        background: linear-gradient(135deg, #2563eb, #7c3aed) !important; 
        width: 34px !important; 
        height: 34px !important;
        border-radius: 8px !important; 
        display: flex !important; 
        align-items: center !important; 
        justify-content: center !important;
        color: #fff !important; 
        font-weight: 800 !important; 
        font-size: 1.15rem !important;
      }
      .dyn-brand-text {
        font-size: 1.25rem !important; 
        font-weight: 800 !important; 
        letter-spacing: -0.4px !important;
        background: linear-gradient(90deg, #e0f2fe 0%, #bae6fd 60%, #c7d2fe 100%) !important;
        -webkit-background-clip: text !important; 
        -webkit-text-fill-color: transparent !important;
      }

      /* DESKTOP NAV BAR */
      .dyn-desktop-nav { 
        display: none; 
        align-items: center; 
        gap: 0.6rem; 
        height: 100%; 
        margin-left: auto; 
        margin-right: 1.2rem; 
      }
      .dyn-desktop-nav a.dyn-nav-item {
        text-decoration: none !important; 
        font-size: 1rem !important; 
        font-weight: 700 !important; 
        letter-spacing: 0.3px !important;
        color: #f1f5f9 !important; 
        height: 100% !important; 
        display: flex !important; 
        align-items: center !important; 
        padding: 0 1rem !important;
        border-bottom: 3.5px solid transparent !important; 
        text-transform: uppercase !important;
        transition: all 0.15s ease !important;
      }
      .dyn-desktop-nav a.dyn-nav-item:hover { 
        color: #ffffff !important; 
        background: rgba(255, 255, 255, 0.1) !important; 
      }
      .dyn-desktop-nav a.dyn-nav-item.is-active { 
        color: #ffffff !important; 
        border-bottom: 3.5px solid #38bdf8 !important; 
        background: rgba(30, 58, 138, 0.5) !important; 
      }

      /* MORE BUTTON CONTAINER & DROPDOWN */
      .dyn-more-container {
        position: relative !important;
        display: flex !important;
        align-items: center !important;
        height: 100% !important;
      }

      .dyn-more-pill-btn {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important; 
        border: 1px solid rgba(199, 210, 254, 0.45) !important; 
        color: #ffffff !important;
        font-weight: 800 !important; 
        font-size: 0.92rem !important; 
        padding: 0.45rem 1.05rem !important; 
        border-radius: 8px !important;
        height: auto !important; 
        text-transform: uppercase !important;
        margin-left: 0.3rem !important;
        box-shadow: 0 3px 10px rgba(79, 70, 229, 0.35) !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.35rem !important;
        transition: all 0.15s ease !important;
      }
      .dyn-more-pill-btn:hover { 
        background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important; 
        box-shadow: 0 4px 14px rgba(79, 70, 229, 0.5) !important;
      }
      .dyn-more-pill-btn::after {
        content: "▾";
        font-size: 0.85rem;
        transition: transform 0.2s ease;
      }
      .dyn-more-container.open .dyn-more-pill-btn::after {
        transform: rotate(180deg);
      }

      /* COLOR-CODED MORE DROPDOWN MENU */
      .dyn-more-dropdown {
        position: absolute !important;
        top: calc(100% - 6px) !important;
        right: 0 !important;
        width: 250px !important;
        background: #ffffff !important;
        border-radius: 12px !important;
        box-shadow: 0 14px 35px rgba(2, 6, 23, 0.22), 0 0 0 1px rgba(148, 163, 184, 0.2) !important;
        padding: 0.5rem !important;
        display: none;
        flex-direction: column !important;
        gap: 0.3rem !important;
        z-index: 1000002 !important;
        animation: dynFadeDown 0.18s ease-out forwards;
      }
      [data-theme="dark"] .dyn-more-dropdown {
        background: #0b132b !important;
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
      }
      .dyn-more-container.open .dyn-more-dropdown {
        display: flex !important;
      }

      @keyframes dynFadeDown {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .dyn-dropdown-item {
        display: flex !important;
        align-items: center !important;
        gap: 0.75rem !important;
        padding: 0.6rem 0.85rem !important;
        border-radius: 8px !important;
        text-decoration: none !important;
        font-size: 0.9rem !important;
        font-weight: 700 !important;
        color: #1e293b !important;
        transition: all 0.12s ease !important;
      }
      [data-theme="dark"] .dyn-dropdown-item { color: #f1f5f9 !important; }

      .dyn-dropdown-icon {
        width: 28px !important;
        height: 28px !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 1rem !important;
        flex-shrink: 0 !important;
      }

      /* Color Themes for More Options */
      .dyn-opt-all .dyn-dropdown-icon { background: rgba(16, 185, 129, 0.15) !important; color: #10b981 !important; }
      .dyn-opt-all:hover { background: rgba(16, 185, 129, 0.12) !important; color: #059669 !important; }

      .dyn-opt-fin .dyn-dropdown-icon { background: rgba(245, 158, 11, 0.15) !important; color: #f59e0b !important; }
      .dyn-opt-fin:hover { background: rgba(245, 158, 11, 0.12) !important; color: #d97706 !important; }

      .dyn-opt-math .dyn-dropdown-icon { background: rgba(6, 182, 212, 0.15) !important; color: #06b6d4 !important; }
      .dyn-opt-math:hover { background: rgba(6, 182, 212, 0.12) !important; color: #0891b2 !important; }

      .dyn-opt-util .dyn-dropdown-icon { background: rgba(244, 63, 94, 0.15) !important; color: #f43f5e !important; }
      .dyn-opt-util:hover { background: rgba(244, 63, 94, 0.12) !important; color: #e11d48 !important; }

      .dyn-opt-fit .dyn-dropdown-icon { background: rgba(20, 184, 166, 0.15) !important; color: #14b8a6 !important; }
      .dyn-opt-fit:hover { background: rgba(20, 184, 166, 0.12) !important; color: #0d9488 !important; }

      .dyn-right-controls { 
        display: flex !important; 
        align-items: center !important; 
        gap: 0.75rem !important; 
      }
      .dyn-theme-btn {
        background: rgba(255, 255, 255, 0.12) !important; 
        border: 1px solid rgba(255, 255, 255, 0.25) !important; 
        border-radius: 8px !important;
        font-size: 1.05rem !important; 
        cursor: pointer !important; 
        color: #fff !important; 
        width: 36px !important; 
        height: 36px !important;
        display: flex !important; 
        align-items: center !important; 
        justify-content: center !important;
        transition: background 0.15s ease !important;
      }
      .dyn-theme-btn:hover {
        background: rgba(255, 255, 255, 0.2) !important;
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
        background: #fff !important; 
        border-radius: 2px !important; 
        display: block !important; 
      }
      
      /* MOBILE DRAWER */
      .dyn-drawer-menu {
        position: fixed !important; 
        top: 0 !important; 
        right: -320px !important; 
        width: 290px !important;
        height: 100vh !important; 
        height: 100dvh !important;
        background: #ffffff !important; 
        border-left: 1px solid #e2e8f0 !important; 
        padding: 0.75rem 0.9rem 2rem !important;
        display: flex !important; 
        flex-direction: column !important; 
        gap: 0.35rem !important; 
        transition: right 0.26s cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-shadow: -10px 0 35px rgba(15, 23, 42, 0.22) !important; 
        z-index: 1000000 !important; 
        overflow-y: auto !important; 
        box-sizing: border-box !important;
        -webkit-overflow-scrolling: touch !important;
      }
      [data-theme="dark"] .dyn-drawer-menu { 
        background: #0b132b !important; 
        border-left: 1px solid rgba(255,255,255,0.08) !important; 
      }
      .dyn-drawer-menu.open { right: 0 !important; }

      .dyn-drawer-top-row {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        width: 100% !important;
        margin-bottom: 0.4rem !important;
      }

      .dyn-close-btn { 
        background: #f1f5f9 !important; 
        border: 1px solid #cbd5e1 !important; 
        width: 38px !important;
        height: 38px !important;
        border-radius: 10px !important;
        font-size: 1.15rem !important; 
        font-weight: 800 !important;
        color: #475569 !important; 
        cursor: pointer !important; 
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.15s ease !important;
        flex-shrink: 0 !important;
        padding: 0 !important;
      }
      .dyn-close-btn:active { transform: scale(0.92) !important; }
      [data-theme="dark"] .dyn-close-btn { 
        background: rgba(255, 255, 255, 0.08) !important; 
        border-color: rgba(255, 255, 255, 0.15) !important;
        color: #cbd5e1 !important; 
      }

      .dyn-drawer-menu a {
        text-decoration: none !important; 
        color: #1e293b !important; 
        font-weight: 700 !important; 
        font-size: 0.95rem !important;
        padding: 0.65rem 0.8rem !important; 
        border-radius: 8px !important; 
        display: flex !important; 
        align-items: center !important; 
        gap: 0.75rem !important;
        transition: background 0.15s ease !important;
      }
      [data-theme="dark"] .dyn-drawer-menu a { color: #e2e8f0 !important; }
      .dyn-drawer-menu a:hover { background: #f1f5f9 !important; color: #0284c7 !important; }
      [data-theme="dark"] .dyn-drawer-menu a:hover { background: rgba(56, 189, 248, 0.12) !important; color: #38bdf8 !important; }

      .dyn-backdrop-overlay { 
        position: fixed !important; 
        inset: 0 !important; 
        background: rgba(2, 6, 23, 0.6) !important; 
        backdrop-filter: blur(2px) !important; 
        z-index: 999998 !important; 
        display: none !important; 
      }
      .dyn-backdrop-overlay.open { display: block !important; }

      @media (min-width: 768px) {
        .dyn-desktop-nav { display: flex !important; }
        .dyn-hamburger-btn, .dyn-drawer-menu, .dyn-backdrop-overlay { display: none !important; }
      }

      /* SEARCH COMPONENT */
      .dyn-search-wrapper { position: relative !important; width: 100% !important; box-sizing: border-box !important; display: block !important; }
      .dyn-drawer-top-row .dyn-search-wrapper { flex: 1 !important; margin: 0 !important; }
      
      .dyn-search-wrapper.in-home { max-width: 640px !important; margin: 1.8rem auto 1.2rem !important; padding: 0 1rem !important; }
      .dyn-search-wrapper.in-sidebar { margin: 0 0 1.5rem 0 !important; }

      .dyn-search-input {
        width: 100% !important;
        padding: 0.72rem 1rem !important;
        font-size: 0.95rem !important;
        font-weight: 700 !important;
        letter-spacing: -0.2px !important;
        border-radius: 10px !important;
        border: 2px solid #cbd5e1 !important;
        background: #ffffff !important;
        color: #0f172a !important;
        outline: none !important;
        box-sizing: border-box !important;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04) !important;
        transition: all 0.2s ease-in-out !important;
      }
      .dyn-search-input::placeholder {
        color: #64748b !important;
        font-weight: 600 !important;
      }
      .dyn-search-input:focus {
        border-color: #0284c7 !important;
        box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.18) !important;
      }

      [data-theme="dark"] .dyn-search-input {
        background: #0f172a !important;
        border: 2px solid #334155 !important;
        color: #ffffff !important;
      }
      [data-theme="dark"] .dyn-search-input::placeholder {
        color: #94a3b8 !important;
      }
      [data-theme="dark"] .dyn-search-input:focus {
        border-color: #38bdf8 !important;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25) !important;
      }

      .dyn-search-dropdown {
        position: absolute !important; 
        top: 100% !important; 
        left: 0 !important; 
        width: 100% !important; 
        max-height: 250px !important;
        overflow-y: auto !important; 
        background: #ffffff !important; 
        border: 2px solid #cbd5e1 !important; 
        border-radius: 10px !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18) !important; 
        margin-top: 6px !important; 
        display: none; 
        z-index: 1000005 !important;
      }
      [data-theme="dark"] .dyn-search-dropdown { 
        background: #0f172a !important; 
        border-color: #1e293b !important; 
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6) !important; 
      }
      
      .dyn-search-dropdown a {
        display: block !important; 
        padding: 0.75rem 1rem !important; 
        font-size: 0.92rem !important; 
        font-weight: 700 !important;
        color: #0f172a !important; 
        text-decoration: none !important; 
        border-bottom: 1px solid #f1f5f9 !important;
      }
      [data-theme="dark"] .dyn-search-dropdown a { 
        color: #f1f5f9 !important; 
        border-bottom: 1px solid #1e293b !important; 
      }
      .dyn-search-dropdown a:hover { 
        background: #e0f2fe !important; 
        color: #0369a1 !important; 
      }
      [data-theme="dark"] .dyn-search-dropdown a:hover { 
        background: #1e293b !important; 
        color: #38bdf8 !important; 
      }

      #dynDesktopSearchWrap { display: none !important; }
      @media (min-width: 768px) {
        #dynDesktopSearchWrap { display: block !important; }
      }
    `;

    const categories = [
      { name: "FINANCE", path: "/#/financial", slug: "financial", icon: "📈" },
      { name: "MATH", path: "/#/math", slug: "math", icon: "📐" },
      { name: "UTILITY", path: "/#/utility", slug: "utility", icon: "🧰" }
    ];

    const desktopCategoriesHtml = categories
      .map((c) => `<a href="${c.path}" class="dyn-nav-item ${currentHash.includes(c.slug) ? "is-active" : ""}">${c.name}</a>`)
      .join("");

    // MORE DROPDOWN WITH DISTINCT COLORS
    const moreDropdownHtml = `
      <div class="dyn-more-container" id="dynMoreContainer">
        <button class="dyn-more-pill-btn" id="dynMoreBtn" type="button">MORE</button>
        <div class="dyn-more-dropdown" id="dynMoreMenu">
          <a href="/#/all" class="dyn-dropdown-item dyn-opt-all">
            <span class="dyn-dropdown-icon">📋</span> All Calculators
          </a>
          <a href="/#/financial" class="dyn-dropdown-item dyn-opt-fin">
            <span class="dyn-dropdown-icon">📈</span> Financial Tools
          </a>
          <a href="/#/math" class="dyn-dropdown-item dyn-opt-math">
            <span class="dyn-dropdown-icon">📐</span> Math & Percentage
          </a>
          <a href="/#/utility" class="dyn-dropdown-item dyn-opt-util">
            <span class="dyn-dropdown-icon">🧰</span> Utility & Conversion
          </a>
          <a href="/#/health" class="dyn-dropdown-item dyn-opt-fit">
            <span class="dyn-dropdown-icon">🏃</span> Fitness & Health
          </a>
        </div>
      </div>
    `;

    const mobileLinksHtml = categories
      .map((c) => `<a href="${c.path}"><span>${c.icon}</span> ${c.name.charAt(0) + c.name.slice(1).toLowerCase()}</a>`)
      .join("") + `
        <a href="/#/health"><span>🏃</span> Health & Fitness</a>
        <a href="/#/all"><span>📋</span> All Calculators</a>
      `;

    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <header id="siteDynamicHeader">
        <a href="/" class="dyn-brand">
          <div class="dyn-logo-icon">&sum;</div>
          <span class="dyn-brand-text">thequantcals</span>
        </a>
        <nav class="dyn-desktop-nav">
          ${desktopCategoriesHtml}
          ${moreDropdownHtml}
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
        <div class="dyn-drawer-top-row">
          <div id="dynDrawerSearchSlot" style="flex:1;"></div>
          <button class="dyn-close-btn" id="dynCloseBtn" aria-label="Close menu">&#x2715;</button>
        </div>
        <a href="/"><span>🏠</span> Home</a>
        ${mobileLinksHtml}
      </aside>
    `;
    document.body.insertAdjacentElement("afterbegin", navContainer);

    // More dropdown toggle handling
    const moreContainer = document.getElementById("dynMoreContainer");
    const moreBtn = document.getElementById("dynMoreBtn");
    if (moreBtn && moreContainer) {
      moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        moreContainer.classList.toggle("open");
      });
      document.addEventListener("click", (e) => {
        if (!moreContainer.contains(e.target)) {
          moreContainer.classList.remove("open");
        }
      });
    }

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

    function makeSearchNode(wrapperClass, elementId) {
      const wrap = document.createElement("div");
      if (elementId) wrap.id = elementId;
      wrap.className = "dyn-search-wrapper " + wrapperClass;
      wrap.innerHTML = `<input type="text" class="dyn-search-input" placeholder="🔍 Search calculator..." autocomplete="off"><div class="dyn-search-dropdown"></div>`;

      const input = wrap.querySelector(".dyn-search-input");
      const dropdown = wrap.querySelector(".dyn-search-dropdown");

      input.addEventListener("focus", () => {
        setTimeout(() => {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      });

      input.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        if (!q) {
          dropdown.style.display = "none";
          dropdown.innerHTML = "";
          return;
        }
        const matches = allTools.filter((t) => t.name.toLowerCase().includes(q));
        dropdown.innerHTML = matches.length
          ? matches.map((m) => `<a href="${m.url}">${m.name}</a>`).join("")
          : `<div style="padding:0.8rem 1rem;font-size:0.88rem;font-weight:600;color:#94a3b8;">No calculators found</div>`;
        dropdown.style.display = "block";
      });

      document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) dropdown.style.display = "none";
      });

      return wrap;
    }

    // 1. MOBILE DRAWER: Inline search
    const drawerSlot = document.getElementById("dynDrawerSearchSlot");
    const drawerSearch = makeSearchNode("in-drawer", "dynDrawerSearch");
    drawerSlot.appendChild(drawerSearch);

    // 2. DESKTOP SEARCH
    const desktopSearch = makeSearchNode(isHomePage ? "in-home" : "in-sidebar", "dynDesktopSearchWrap");

    function placeDesktopSearch() {
      if (desktopSearch.isConnected) return true;

      if (isHomePage) {
        const mainContainer = document.querySelector("main, .hero, .container, #app, section");
        if (mainContainer && mainContainer.parentNode) {
          mainContainer.parentNode.insertBefore(desktopSearch, mainContainer);
          return true;
        }
        document.body.appendChild(desktopSearch);
        return true;
      }

      const sidebar = Array.from(document.querySelectorAll("aside, .sidebar, .card")).find((n) => {
        return (n.textContent || "").toLowerCase().includes("popular tools");
      });
      if (sidebar) {
        sidebar.insertBefore(desktopSearch, sidebar.firstChild);
        return true;
      }
      return false;
    }

    let retries = 0;
    const interval = setInterval(() => {
      retries++;
      if (placeDesktopSearch() || retries > 10) clearInterval(interval);
    }, 150);
    placeDesktopSearch();

    // Drawer and Theme controls
    const drawer = document.getElementById("dynDrawer");
    const overlay = document.getElementById("dynOverlay");
    const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };

    document.getElementById("dynHamburgerToggleBtn").onclick = () => {
      drawer.classList.add("open");
      overlay.classList.add("open");
    };
    document.getElementById("dynCloseBtn").onclick = closeDrawer;
    overlay.onclick = closeDrawer;

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
