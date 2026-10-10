(function () {
  const currentPath = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash.toLowerCase();
  const isToolPage = currentPath.includes("/tools/") || currentPath.includes("calculator.html");
  const isHomePage = !isToolPage;

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
        background-color: #ffffff !important;
      }

      /* HIDE REDUNDANT DIRECTORY INTRO TEXT */
      p:has(+ input[placeholder*="calculator" i]),
      .category-desc,
      .all-calc-desc {
        display: none !important;
      }

      /* ========================================================
         EXACT CALCULATOR.NET 2-COLUMN DESKTOP SPLIT
         LEFT: ~70% MAIN TOOLS | RIGHT: ~300px SIDEBAR
         ======================================================== */
      @media (min-width: 768px) {
        /* Force outer wrapper into two distinct side-by-side columns */
        #calcNetDesktopContainer {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
          width: 100% !important;
          max-width: 1200px !important;
          margin: 12px auto 40px !important;
          padding: 0 16px !important;
          box-sizing: border-box !important;
          gap: 24px !important;
        }

        /* 1. LEFT MAIN COLUMN (~70% Width) */
        #calcNetLeftColumn {
          flex: 1 1 0% !important;
          width: calc(100% - 324px) !important;
          max-width: calc(100% - 324px) !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        #calcNetLeftColumn .card,
        #calcNetLeftColumn section,
        #calcNetLeftColumn > div {
          width: 100% !important;
          max-width: 100% !important;
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* 2. RIGHT SIDEBAR COLUMN (~300px Fixed) */
        #dynDesktopSidebarWrap {
          flex: 0 0 300px !important;
          width: 300px !important;
          max-width: 300px !important;
          margin: 0 !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
          box-sizing: border-box !important;
        }

        #dynDesktopSidebarWrap .card,
        #dynDesktopSidebarWrap > div {
          width: 100% !important;
          max-width: 300px !important;
          box-sizing: border-box !important;
          margin: 0 !important;
        }

        /* Hide any legacy inline search from the left column */
        #calcNetLeftColumn input[placeholder*="search" i] {
          display: none !important;
        }
      }

      /* CALCULATOR.NET SIDEBAR SEARCH BAR */
      .dyn-calcnet-search {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        gap: 4px !important;
        box-sizing: border-box !important;
      }
      .dyn-calcnet-search input {
        flex: 1 1 auto !important;
        height: 32px !important;
        padding: 4px 8px !important;
        font-size: 13px !important;
        border: 1px solid #718096 !important;
        border-radius: 2px !important;
        background: #ffffff !important;
        color: #1a202c !important;
        box-sizing: border-box !important;
        outline: none !important;
      }
      .dyn-calcnet-search input:focus {
        border-color: #2b6cb0 !important;
      }
      .dyn-calcnet-search button {
        height: 32px !important;
        padding: 0 14px !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        background: linear-gradient(180deg, #3182ce 0%, #2b6cb0 100%) !important;
        color: #ffffff !important;
        border: 1px solid #2b6cb0 !important;
        border-radius: 2px !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
      }
      .dyn-calcnet-search button:hover {
        background: linear-gradient(180deg, #2b6cb0 0%, #2c5282 100%) !important;
      }

      /* ADSENSE PLACEHOLDER (300x250) */
      #dynAdSenseSlot {
        display: none;
        width: 300px;
        min-height: 250px;
        background: #f7fafc;
        border: 1px dashed #cbd5e0;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #718096;
        font-size: 13px;
        font-weight: 600;
        box-sizing: border-box;
      }
      @media (min-width: 768px) {
        #dynAdSenseSlot {
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

      /* BOLD & ENLARGED CATEGORIES HEADER SECTION */
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
      .dyn-search-wrapper { position: relative !important; width: 100% !important; }
      .dyn-search-dropdown {
        position: absolute !important; 
        top: calc(100% + 4px) !important; 
        left: 0 !important; 
        width: 100% !important; 
        max-height: 280px !important;
        overflow-y: auto !important; 
        background: #ffffff !important; 
        border: 1px solid #cbd5e1 !important; 
        border-radius: 4px !important;
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

    // Dynamic Underline Tab Indicator
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

    document.querySelectorAll(".dyn-desktop-nav a.dyn-nav-item, .dyn-more-pill-btn, .dyn-drawer-link").forEach((link) => {
      link.addEventListener("click", function () {
        const slug = this.getAttribute("data-slug");
        if (slug) {
          document.querySelectorAll(".dyn-desktop-nav a.dyn-nav-item").forEach((item) => {
            if (item.getAttribute("data-slug") === slug) {
              item.classList.add("is-active");
            } else {
              item.classList.remove("is-active");
            }
          });
        }
        if (link.classList.contains("dyn-drawer-link")) {
          closeDrawer();
        }
      });
    });

    syncActiveTab();
    window.addEventListener("hashchange", syncActiveTab);
    window.addEventListener("popstate", syncActiveTab);

    // Update Heading Text Safely
    function updateHeadingText() {
      const headings = document.querySelectorAll("h1, h2, .title, .page-title");
      headings.forEach((el) => {
        if ((el.textContent || "").trim().toLowerCase() === "all calculators") {
          el.textContent = "All Calculators/Tools";
        }
      });
    }
    updateHeadingText();
    window.addEventListener("hashchange", () => setTimeout(updateHeadingText, 60));

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

    // Drawer controls
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

    function makeSearchNode() {
      const wrap = document.createElement("div");
      wrap.className = "dyn-search-wrapper";
      wrap.innerHTML = `
        <div class="dyn-calcnet-search">
          <input type="text" class="dyn-search-input" placeholder="Search calculators..." autocomplete="off">
          <button type="button">Search</button>
        </div>
        <div class="dyn-search-dropdown"></div>
      `;

      const input = wrap.querySelector(".dyn-search-input");
      const btn = wrap.querySelector("button");
      const dropdown = wrap.querySelector(".dyn-search-dropdown");

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
        if (!wrap.contains(e.target)) dropdown.style.display = "none";
      });

      return wrap;
    }

    // 1. MOBILE DRAWER SEARCH
    const drawerSlot = document.getElementById("dynDrawerSearchSlot");
    drawerSlot.appendChild(makeSearchNode());

    // 2. DESKTOP CALCULATOR.NET SIDE-BY-SIDE BUILDER
    function buildCalculatorNetDesktopLayout() {
      if (window.innerWidth < 768) return;

      const isCategoryView = window.location.hash.startsWith("#/");
      const parentContainer = document.querySelector("main, #app, #content, .container, body > div:not(#siteDynamicHeader):not(#dynDrawer):not(#dynOverlay)");
      if (!parentContainer || !isCategoryView) return;

      let splitContainer = document.getElementById("calcNetDesktopContainer");
      if (!splitContainer) {
        splitContainer = document.createElement("div");
        splitContainer.id = "calcNetDesktopContainer";

        const leftCol = document.createElement("div");
        leftCol.id = "calcNetLeftColumn";

        const rightSidebar = document.createElement("aside");
        rightSidebar.id = "dynDesktopSidebarWrap";

        // Right Sidebar Item 1: Top Search Box
        rightSidebar.appendChild(makeSearchNode());

        // Right Sidebar Item 2: Medium Rectangle Ad Unit (300x250)
        const adSlot = document.createElement("div");
        adSlot.id = "dynAdSenseSlot";
        adSlot.innerHTML = `<span>Advertisement (300x250)</span>`;
        rightSidebar.appendChild(adSlot);

        // Gather all existing page items (Tools block, Popular Tools, etc.)
        const children = Array.from(parentContainer.children).filter(el => 
          el.id !== "calcNetDesktopContainer" && 
          el.id !== "siteDynamicHeader" && 
          el.id !== "dynDrawer" && 
          el.id !== "dynOverlay"
        );

        // Separate Left Main content from Secondary cards
        children.forEach((child) => {
          const text = (child.textContent || "").toLowerCase();
          const hasTitle = child.querySelector("h1, h2");

          if (hasTitle || text.includes("calculators") && !text.includes("popular tools") && !text.includes("system status")) {
            leftCol.appendChild(child);
          } else if (text.includes("popular tools") || text.includes("categories") || text.includes("system status")) {
            rightSidebar.appendChild(child);
          } else {
            leftCol.appendChild(child);
          }
        });

        splitContainer.appendChild(leftCol);
        splitContainer.appendChild(rightSidebar);
        parentContainer.appendChild(splitContainer);
      }
    }

    buildCalculatorNetDesktopLayout();
    window.addEventListener("hashchange", () => setTimeout(buildCalculatorNetDesktopLayout, 80));
    window.addEventListener("resize", buildCalculatorNetDesktopLayout);

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
