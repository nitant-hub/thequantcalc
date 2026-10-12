(function () {
  function initNavigation() {
    let vMeta = document.querySelector('meta[name="viewport"]');
    if (!vMeta) {
      vMeta = document.createElement("meta");
      vMeta.name = "viewport";
      document.head.appendChild(vMeta);
    }
    vMeta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no");

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

      html, body {
        overflow-x: hidden !important;
        overflow-x: clip !important;
        width: 100% !important;
        max-width: 100vw !important;
        position: relative !important;
      }

      body { 
        padding-top: var(--nav-header-height) !important; 
      }

      .sr input#q {
        display: none !important;
      }

      /* ========================================================
         CATEGORY VIEW LAYOUT
         ======================================================== */
      #catView {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.25rem !important;
      }
      @media (min-width: 768px) {
        #catView.dyn-cat-split {
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          gap: 2rem !important;
        }
        #catView.dyn-cat-split > .dyn-cat-left-pane {
          flex: 1 1 0% !important;
          min-width: 0 !important;
        }
        #catView.dyn-cat-split > .dyn-cat-right-pane {
          flex: 0 0 320px !important;
          width: 320px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1rem !important;
        }
      }

      /* ========================================================
         SEARCH COMPONENT CORE & FULL WIDTH RECTANGLE
         ======================================================== */
      .dyn-search-wrapper {
        position: relative !important;
        box-sizing: border-box !important;
        width: 100% !important;
        pointer-events: auto !important;
        z-index: 20 !important;
      }

      /* 1. HOMEPAGE SEARCH COMPONENT */
      .dyn-search-wrapper.in-home-desktop {
        max-width: min(340px, calc(100% - 32px)) !important;
        width: 100% !important;
        margin: 1.25rem auto 1.5rem auto !important;
      }
      @media (min-width: 768px) {
        .dyn-search-wrapper.in-home-desktop {
          max-width: 320px !important;
          margin-left: 15% !important;
          margin-right: auto !important;
        }
      }

      /* 2. CATEGORY VIEW */
      .dyn-search-wrapper.in-cat-pane {
        max-width: 340px !important;
        width: 100% !important;
        margin-bottom: 0.5rem !important;
      }

      /* 3. TOOL SIDEBAR */
      .dyn-search-wrapper.in-sidebar {
        max-width: 100% !important;
        display: block !important;
        clear: both !important;
        margin: 0 !important;
        background: var(--bg-surface, #ffffff) !important;
        border: 1px solid var(--border-color, #e2e8f0) !important;
        border-radius: 0px !important;
        padding: 1rem !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
        box-sizing: border-box !important;
      }
      [data-theme="dark"] .dyn-search-wrapper.in-sidebar {
        background: var(--bg-surface, #1e293b) !important;
        border-color: var(--border-color, #334155) !important;
      }

      /* RECTANGULAR FULL-WIDTH ROW CONTAINER */
      .dyn-search-row {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 38px !important;
        background: var(--bg-surface, #ffffff) !important;
        border: 1.5px solid #2563eb !important;
        border-radius: 0px !important;
        padding: 0 10px !important;
        box-sizing: border-box !important;
        box-shadow: 0 1px 4px rgba(37, 99, 235, 0.08) !important;
        transition: border-color 0.2s, box-shadow 0.2s !important;
        cursor: text !important;
        position: relative !important;
        z-index: 25 !important;
      }
      [data-theme="dark"] .dyn-search-row {
        background: var(--bg-surface, #1e293b) !important;
        border-color: #3b82f6 !important;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3) !important;
      }
      .dyn-search-wrapper .dyn-search-row:focus-within {
        border-color: #1d4ed8 !important;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.22) !important;
      }

      /* Modern Input Text taking 100% width */
      .dyn-modern-input {
        font-size: 15px !important;
        font-weight: 500 !important;
        border: none !important;
        border-radius: 0px !important;
        background: transparent !important;
        outline: none !important;
        color: var(--text-main, #0f172a) !important;
        touch-action: manipulation !important;
        -webkit-text-size-adjust: 100% !important;
        width: 100% !important;
        height: 100% !important;
        cursor: text !important;
        pointer-events: auto !important;
        user-select: text !important;
        -webkit-user-select: text !important;
        position: relative !important;
        z-index: 30 !important;
      }
      @media (min-width: 768px) {
        .dyn-modern-input {
          font-size: 13px !important;
        }
      }

      [data-theme="dark"] .dyn-modern-input { color: #f8fafc !important; }
      .dyn-modern-input::placeholder { color: var(--text-muted, #94a3b8) !important; font-size: 13px !important; }

      /* AD CONTAINER */
      .dyn-adsense-300x250 {
        width: 100% !important;
        max-width: 320px !important;
        height: 250px !important;
        background: #f1f5f9 !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 4px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: #64748b !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        box-sizing: border-box !important;
      }
      [data-theme="dark"] .dyn-adsense-300x250 {
        background: #1e293b !important;
        border-color: #334155 !important;
        color: #94a3b8 !important;
      }

      /* SEARCH DROPDOWN */
      .dyn-search-dropdown {
        position: absolute !important; 
        top: calc(100% + 4px) !important; 
        left: 0 !important; 
        width: 100% !important; 
        max-height: 260px !important;
        overflow-y: auto !important; 
        background: var(--bg-surface, #ffffff) !important; 
        border: 1px solid var(--border-color, #e2e8f0) !important; 
        border-radius: 0px !important;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15) !important; 
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
        padding: 0.65rem 0.95rem !important; 
        font-size: 0.88rem !important; 
        font-weight: 600 !important; 
        color: var(--text-main, #1e293b) !important; 
        text-decoration: none !important; 
        border-bottom: 1px solid var(--border-color, #f1f5f9) !important; 
      }
      [data-theme="dark"] .dyn-search-dropdown a { color: #f8fafc !important; border-bottom: 1px solid #334155 !important; }
      .dyn-search-dropdown a:hover { background: var(--bg-primary, #f8fafc) !important; color: #2563eb !important; }

      aside.sidebar {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
      }
      .dyn-tools-card {
        background: var(--bg-surface, #ffffff) !important;
        border: 1px solid var(--border-color, #e2e8f0) !important;
        border-radius: 16px !important;
        padding: 1.75rem !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
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
      
      /* Toggle Hamburger Button */
      .dyn-hamburger-btn { 
        background: rgba(255, 255, 255, 0.1) !important; 
        border: 1px solid rgba(255, 255, 255, 0.2) !important; 
        border-radius: 8px !important; 
        cursor: pointer !important; 
        width: 36px !important; 
        height: 36px !important; 
        display: flex !important; 
        flex-direction: column !important; 
        align-items: center !important; 
        justify-content: center !important; 
        gap: 5px !important; 
        padding: 0 !important; 
        transition: background 0.2s ease !important;
      }
      .dyn-hamburger-btn:hover {
        background: rgba(255, 255, 255, 0.2) !important;
      }
      .dyn-hamburger-btn span.bar { width: 18px !important; height: 2.5px !important; background: #fff !important; border-radius: 2px !important; display: block !important; }
      .dyn-hamburger-btn span.close-x { font-size: 1.25rem !important; font-weight: 800 !important; color: #ef4444 !important; line-height: 1 !important; display: none !important; }
      
      /* When active: perfectly matches the white surface color and seamlessly merges with the popup card */
      .dyn-hamburger-btn.is-active {
        background: var(--bg-surface, #ffffff) !important;
        border: 1px solid rgba(255, 255, 255, 0.9) !important;
        border-bottom: none !important; /* Seamlessly connects with the popup top edge */
        border-radius: 10px 10px 0 0 !important; /* Rounded top tab shape connected to the popup */
        box-shadow: 0 -4px 12px rgba(15, 23, 42, 0.12) !important;
        z-index: 1000001 !important;
      }
      [data-theme="dark"] .dyn-hamburger-btn.is-active {
        background: #151c2e !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
      }
      .dyn-hamburger-btn.is-active span.bar { display: none !important; }
      .dyn-hamburger-btn.is-active span.close-x { display: block !important; }

      /* ========================================================
         MOBILE DRAWER: Apple UI + Semi-3D + Bento Grid + Minimalist UX
         ======================================================== */
      .dyn-drawer-menu {
        position: fixed !important; 
        top: calc(var(--nav-header-height) + 4px) !important; 
        right: -75vw !important; 
        width: fit-content !important; 
        min-width: 150px !important;
        max-width: 75vw !important; 
        height: auto !important; 
        max-height: 80vh !important;
        background: var(--bg-surface, #ffffff) !important; 
        border: 1px solid rgba(255, 255, 255, 0.9) !important; 
        border-radius: 16px !important; 
        padding: 0.6rem 0.5rem 0.5rem 0.5rem !important; 
        display: flex !important; 
        flex-direction: column !important; 
        gap: 0.15rem !important; 
        transition: right 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
        box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.15), 0 4px 6px -2px rgba(15, 23, 42, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.9) !important; 
        z-index: 1000000 !important; 
        overflow-y: auto !important; 
        overflow-x: auto !important; 
        overscroll-behavior: contain !important;
        box-sizing: border-box !important;
      }
      [data-theme="dark"] .dyn-drawer-menu {
        background: #151c2e !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.08) !important;
      }
      .dyn-drawer-menu.open { right: 12px !important; }

      /* Minimalist UX link items with automatic X-flow/scroll support for longer text */
      .dyn-drawer-menu a {
        text-decoration: none !important; 
        color: var(--text-main, #1e293b) !important; 
        font-weight: 600 !important; 
        font-size: 0.82rem !important;
        padding: 0.28rem 0.4rem !important; 
        border-radius: 6px !important; 
        display: flex !important; 
        align-items: center !important; 
        gap: 0.35rem !important;
        white-space: nowrap !important; 
        width: fit-content !important;
        min-width: 100% !important;
        cursor: pointer !important;
        transition: background 0.15s ease, transform 0.15s ease !important;
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
        <a href="/" class="dyn-brand"><div class="logo-symbol">&sum;</div><span class="dyn-brand-text">thequantcals</span></a>
        <nav class="dyn-desktop-nav">${desktopLinksHtml}</nav>
        <div class="dyn-right-controls">
          <button id="dynThemeToggleBtn" class="dyn-theme-btn" aria-label="Toggle Theme">🌙</button>
          <button id="dynHamburgerToggleBtn" class="dyn-hamburger-btn" aria-label="Toggle Navigation">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
            <span class="close-x">&times;</span>
          </button>
        </div>
      </header>
      <div class="dyn-backdrop-overlay" id="dynOverlay"></div>
      <aside class="dyn-drawer-menu" id="dynDrawer">
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
    const hamburgerBtn = document.getElementById("dynHamburgerToggleBtn");

    const closeDrawer = () => { 
      drawer.classList.remove("open"); 
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      hamburgerBtn.classList.remove("is-active");
    };

    const openDrawer = () => {
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      hamburgerBtn.classList.add("is-active");
    };

    hamburgerBtn.onclick = () => {
      if (drawer.classList.contains("open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };

    overlay.onclick = closeDrawer;
    drawer.querySelectorAll(".dyn-drawer-link").forEach((link) => link.addEventListener("click", closeDrawer));

    // SEARCH COMPONENT WITHOUT SEARCH BUTTON (FULL WIDTH INPUT)
    let globalSearchNode = document.getElementById("dynGlobalSearchNode");
    if (!globalSearchNode) {
      globalSearchNode = document.createElement("div");
      globalSearchNode.id = "dynGlobalSearchNode";
      globalSearchNode.className = "dyn-search-wrapper";
      globalSearchNode.innerHTML = `
        <div class="dyn-search-row">
          <input type="text" class="dyn-modern-input" placeholder="Search calculators..." autocomplete="off">
        </div>
        <div class="dyn-search-dropdown"></div>
      `;

      const input = globalSearchNode.querySelector(".dyn-modern-input");
      const row = globalSearchNode.querySelector(".dyn-search-row");
      const dropdown = globalSearchNode.querySelector(".dyn-search-dropdown");

      row.addEventListener("click", () => {
        input.focus();
      });

      function snapBack() {
        requestAnimationFrame(() => {
          window.scrollTo(0, window.scrollY);
          document.documentElement.scrollLeft = 0;
          document.body.scrollLeft = 0;
        });
      }

      input.addEventListener("blur", snapBack);
      input.addEventListener("focusout", snapBack);

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {
          if (document.activeElement !== input) {
            snapBack();
          }
        });
      }

      const allTools = [
        { name: "Compound Interest Calculator", url: "/tools/Compound-Interest-Calculator.html" },
        { name: "Exam Marks Percentage Calculator", url: "/tools/Exam-Marks-Percentage-Calculator.html" },
        { name: "Accurate Age Calculator", url: "/tools/accurate-age-calculator.html" },
        { name: "Cosmic Weight Calculator", url: "/tools/cosmic-weight.html" }
      ];

      function renderList(q) {
        const nativeInput = document.getElementById("q");
        if (nativeInput && nativeInput.offsetParent !== null) {
          nativeInput.value = q;
          if (typeof nativeInput.oninput === "function") nativeInput.oninput();
        }

        if (!q) {
          dropdown.style.display = "none";
          dropdown.innerHTML = "";
          return;
        }
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

      input.addEventListener("input", (e) => {
        renderList(e.target.value.trim().toLowerCase());
      });

      document.addEventListener("click", (e) => {
        if (!globalSearchNode.contains(e.target)) dropdown.style.display = "none";
      });
    }

    let globalAdsenseNode = document.getElementById("dynAdsense300");
    if (!globalAdsenseNode) {
      globalAdsenseNode = document.createElement("div");
      globalAdsenseNode.id = "dynAdsense300";
      globalAdsenseNode.className = "dyn-adsense-300x250";
      globalAdsenseNode.innerHTML = `<span>Advertisement (300x250)</span>`;
    }

    function relocateSearch() {
      const isMobile = window.innerWidth < 768;
      const path = window.location.pathname.toLowerCase();
      const hash = (window.location.hash || "").toLowerCase();
      const isTool = path.includes("/tools/") || path.includes("calculator.html");
      const isCategory = hash.startsWith("#/") && hash.length > 2;

      // 1. Mobile Drawer View
      if (isMobile) {
        const drawerSlot = document.getElementById("dynDrawerSearchSlot");
        globalSearchNode.className = "dyn-search-wrapper in-cat-pane";
        if (drawerSlot && globalSearchNode.parentElement !== drawerSlot) {
          drawerSlot.appendChild(globalSearchNode);
        }
        if (globalAdsenseNode.parentElement) globalAdsenseNode.remove();
        return;
      }

      // 2. Desktop Category Page (Split View with Ad)
      if (isCategory) {
        const catView = document.getElementById("catView");
        if (catView) {
          let leftPane = catView.querySelector(".dyn-cat-left-pane");
          let rightPane = catView.querySelector(".dyn-cat-right-pane");

          if (!leftPane || !rightPane) {
            leftPane = document.createElement("div");
            leftPane.className = "dyn-cat-left-pane";

            rightPane = document.createElement("div");
            rightPane.className = "dyn-cat-right-pane";

            const elementsToMove = ["crumb", "ch1", "cintro", "cols", "none"];
            elementsToMove.forEach((id) => {
              const el = document.getElementById(id);
              if (el && el.parentElement === catView) leftPane.appendChild(el);
            });

            catView.classList.add("dyn-cat-split");
            catView.appendChild(leftPane);
            catView.appendChild(rightPane);
          }

          globalSearchNode.className = "dyn-search-wrapper in-cat-pane";
          if (rightPane.firstElementChild !== globalSearchNode) {
            rightPane.insertBefore(globalSearchNode, rightPane.firstChild);
          }
          if (globalAdsenseNode.parentElement !== rightPane) {
            rightPane.appendChild(globalAdsenseNode);
          }
          return;
        }
      }

      // 3. Desktop Homepage View
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

      // 4. Standalone Tool Page
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

        if (sidebarAside.firstElementChild !== globalAdsenseNode) {
          sidebarAside.insertBefore(globalAdsenseNode, sidebarAside.firstChild);
        }

        if (globalSearchNode.previousElementSibling !== globalAdsenseNode) {
          sidebarAside.insertBefore(globalSearchNode, toolsCard);
        }
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
