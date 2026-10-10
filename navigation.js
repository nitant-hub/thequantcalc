(function () {
  const currentPath = window.location.pathname.toLowerCase();
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
          --nav-header-height: 68px; 
        }
      }

      body { 
        padding-top: var(--nav-header-height) !important; 
      }

      /* HIDE REDUNDANT DIRECTORY INTRO TEXT */
      p:has(+ input[placeholder*="calculator" i]),
      .category-desc,
      .all-calc-desc {
        display: none !important;
      }

      /* ========================================================
         CALCULATOR.NET STYLE: TWO-COLUMN VERTICAL SPLIT (DESKTOP)
         ======================================================== */
      @media (min-width: 820px) {
        .dyn-desktop-split-layout {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
          justify-content: space-between !important;
          gap: 2.2rem !important;
          max-width: 1180px !important;
          margin: 1.2rem auto 2.5rem !important;
          padding: 0 1.2rem !important;
          box-sizing: border-box !important;
        }

        /* LEFT VERTICAL AREA: CATEGORY HEADING & TOOLS LIST */
        .dyn-left-content {
          flex: 1 1 66% !important;
          min-width: 0 !important;
        }

        /* RIGHT VERTICAL AREA: SEARCH ON TOP + SIDEBAR CARDS */
        .dyn-right-sidebar {
          flex: 0 0 310px !important;
          width: 310px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 1.2rem !important;
        }

        /* SIDEBAR SEARCH BAR STYLING */
        .dyn-right-sidebar .dyn-search-wrapper {
          width: 100% !important;
          margin: 0 !important;
        }
        .dyn-right-sidebar .dyn-search-input {
          width: 100% !important;
          border-radius: 8px !important;
          border: 2px solid #94a3b8 !important;
          padding: 0.65rem 0.85rem !important;
          font-size: 0.92rem !important;
        }

        /* HIDE EMBEDDED INLINE SEARCH ON DESKTOP CATEGORY PAGES */
        .dyn-left-content input[placeholder*="Search calculators" i],
        .dyn-left-content input[placeholder*="search calculators" i] {
          display: none !important;
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

      /* DISTINCT & ATTRACTIVE MORE BUTTON */
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

      /* COMPACT TOP ROW FOR CLOSE BUTTON */
      .dyn-drawer-top-action {
        display: flex !important;
        justify-content: flex-end !important;
        align-items: center !important;
        width: 100% !important;
        margin-bottom: 0.15rem !important;
      }

      /* ATTRACTIVE, BALANCED CLOSE BUTTON */
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
      .dyn-close-btn:hover {
        background: #fecaca !important;
        transform: scale(1.05) !important;
      }
      [data-theme="dark"] .dyn-close-btn {
        background: rgba(239, 68, 68, 0.16) !important;
        border-color: rgba(239, 68, 68, 0.35) !important;
        color: #f87171 !important;
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

      /* SEARCH CONTAINER */
      .dyn-search-wrapper { 
        position: relative !important; 
        width: 100% !important; 
        box-sizing: border-box !important; 
        display: block !important; 
        z-index: 1000 !important;
      }
      #dynDrawerSearchSlot { 
        width: 100% !important; 
        margin-bottom: 0.25rem !important; 
      }
      .dyn-search-wrapper.in-drawer { margin-bottom: 0 !important; width: 100% !important; }
      .dyn-search-wrapper.in-home { max-width: 640px !important; margin: 1.2rem auto 1.2rem !important; padding: 0 1rem !important; }

      .dyn-search-input-box {
        position: relative !important;
        width: 100% !important;
      }

      .dyn-search-input {
        width: 100% !important;
        padding: 0.75rem 0.95rem !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        letter-spacing: -0.2px !important;
        border-radius: 10px !important;
        border: 2px solid #94a3b8 !important;
        background: #ffffff !important;
        color: #0f172a !important;
        outline: none !important;
        box-sizing: border-box !important;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08) !important;
        transition: border-color 0.2s, box-shadow 0.2s !important;
        -webkit-user-select: text !important;
        user-select: text !important;
      }
      .dyn-search-input::placeholder {
        color: #64748b !important;
        font-weight: 600 !important;
        opacity: 0.9 !important;
      }
      .dyn-search-input:focus {
        border-color: #2563eb !important;
        background: #ffffff !important;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.22) !important;
      }

      /* Dark mode styles */
      [data-theme="dark"] .dyn-search-input {
        background: #0f172a !important;
        border: 2px solid #38bdf8 !important;
        color: #ffffff !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
      }
      [data-theme="dark"] .dyn-search-input::placeholder {
        color: #94a3b8 !important;
      }
      [data-theme="dark"] .dyn-search-input:focus {
        border-color: #38bdf8 !important;
        background: #0b132b !important;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.3), 0 8px 24px rgba(0, 0, 0, 0.5) !important;
      }

      /* Clear Dropdown styling */
      .dyn-search-dropdown {
        position: absolute !important; 
        top: calc(100% + 6px) !important; 
        left: 0 !important; 
        width: 100% !important; 
        max-height: 280px !important;
        overflow-y: auto !important; 
        background: #ffffff !important; 
        border: 2px solid #cbd5e1 !important; 
        border-radius: 12px !important;
        box-shadow: 0 16px 36px rgba(15, 23, 42, 0.22) !important; 
        display: none; 
        z-index: 1000005 !important;
      }
      [data-theme="dark"] .dyn-search-dropdown { 
        background: #0f172a !important; 
        border-color: #1e293b !important; 
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7) !important; 
      }
      
      .dyn-search-dropdown a {
        display: flex !important; 
        align-items: center !important; 
        justify-content: space-between !important;
        padding: 0.75rem 0.9rem !important; 
        font-size: 0.92rem !important; 
        font-weight: 700 !important; 
        color: #0f172a !important; 
        text-decoration: none !important; 
        border-bottom: 1px solid #f1f5f9 !important; 
        transition: background 0.15s !important;
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
      .dyn-search-dropdown mark {
        background: rgba(37, 99, 235, 0.15) !important;
        color: #2563eb !important;
        font-weight: 800 !important;
        border-radius: 3px !important;
      }
      [data-theme="dark"] .dyn-search-dropdown mark {
        background: rgba(56, 189, 248, 0.25) !important;
        color: #38bdf8 !important;
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

    function makeSearchNode(wrapperClass, elementId) {
      const wrap = document.createElement("div");
      if (elementId) wrap.id = elementId;
      wrap.className = "dyn-search-wrapper " + wrapperClass;
      wrap.innerHTML = `
        <div class="dyn-search-input-box">
          <input type="text" class="dyn-search-input" placeholder="🔍 Search any calculator..." autocomplete="off">
        </div>
        <div class="dyn-search-dropdown"></div>
      `;

      const input = wrap.querySelector(".dyn-search-input");
      const dropdown = wrap.querySelector(".dyn-search-dropdown");

      function bringIntoFocus() {
        setTimeout(() => {
          const rect = input.getBoundingClientRect();
          const targetY = window.pageYOffset + rect.top - 80;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }, 120);
      }

      input.addEventListener("focus", () => {
        bringIntoFocus();
        const q = input.value.trim().toLowerCase();
        if (q) {
          renderList(q);
        }
      });

      input.addEventListener("click", bringIntoFocus);

      function renderList(q) {
        if (!q) {
          dropdown.style.display = "none";
          dropdown.innerHTML = "";
          return;
        }
        const matches = allTools.filter((t) => t.name.toLowerCase().includes(q));
        if (!matches.length) {
          dropdown.innerHTML = `<div style="padding:0.9rem 1rem;font-size:0.9rem;font-weight:700;color:#94a3b8;">No calculators found</div>`;
        } else {
          dropdown.innerHTML = matches.map((m) => {
            const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
            const highlighted = m.name.replace(regex, "<mark>$1</mark>");
            return `<a href="${m.url}"><span>${highlighted}</span> <span style="font-size:0.8rem;color:#94a3b8;">→</span></a>`;
          }).join("");

          if (wrapperClass.includes("in-drawer")) {
            dropdown.querySelectorAll("a").forEach(a => a.addEventListener("click", closeDrawer));
          }
        }
        dropdown.style.display = "block";
      }

      input.addEventListener("input", (e) => {
        renderList(e.target.value.trim().toLowerCase());
      });

      document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) dropdown.style.display = "none";
      });

      return wrap;
    }

    // 1. MOBILE DRAWER SEARCH
    const drawerSlot = document.getElementById("dynDrawerSearchSlot");
    const drawerSearch = makeSearchNode("in-drawer", "dynDrawerSearch");
    drawerSlot.appendChild(drawerSearch);

    // 2. DESKTOP SEARCH & TWO-COLUMN STRUCTURAL BUILDER
    const desktopSearch = makeSearchNode("in-sidebar", "dynDesktopSearchWrap");

    function arrangeDesktopLayout() {
      const isCategoryView = window.location.hash.startsWith("#/") && !window.location.hash.includes("calc");
      
      // On Homepage: Keep simple search below interactive calc
      if (!isCategoryView) {
        const existingLayout = document.querySelector(".dyn-desktop-split-layout");
        if (existingLayout) {
          while (existingLayout.firstChild) {
            existingLayout.parentNode.insertBefore(existingLayout.firstChild, existingLayout);
          }
          existingLayout.remove();
        }

        const calcCard = document.querySelector(".calc-card");
        if (calcCard && calcCard.parentNode && !desktopSearch.isConnected) {
          desktopSearch.className = "dyn-search-wrapper in-home";
          calcCard.parentNode.insertBefore(desktopSearch, calcCard.nextSibling);
        }
        return;
      }

      // On Category/Tools View: Create true 2-column split (Left Content + Right Sidebar)
      if (window.innerWidth >= 820) {
        let splitWrap = document.querySelector(".dyn-desktop-split-layout");
        if (!splitWrap) {
          // Identify category content elements vs sidebar elements
          const mainArea = document.querySelector("main, #content, .container, body");
          if (!mainArea) return;

          // Find the category tools list / directory card
          const categoryBlock = Array.from(mainArea.querySelectorAll("div, section")).find((el) => {
            const h = el.querySelector("h1, h2");
            return h && (h.textContent.toLowerCase().includes("calculators") || h.textContent.toLowerCase().includes("tools"));
          });

          // Find Popular Tools & Categories Cards
          const sidebarCards = Array.from(mainArea.querySelectorAll("div, aside")).filter((el) => {
            const t = (el.textContent || "").toLowerCase();
            return (t.includes("popular tools") || t.includes("categories") || t.includes("system status")) && el !== categoryBlock;
          });

          if (categoryBlock && sidebarCards.length) {
            splitWrap = document.createElement("div");
            splitWrap.className = "dyn-desktop-split-layout";

            const leftCol = document.createElement("div");
            leftCol.className = "dyn-left-content";

            const rightCol = document.createElement("div");
            rightCol.className = "dyn-right-sidebar";

            categoryBlock.parentNode.insertBefore(splitWrap, categoryBlock);
            leftCol.appendChild(categoryBlock);

            // Mount Search at the top of the right column
            desktopSearch.className = "dyn-search-wrapper in-sidebar";
            rightCol.appendChild(desktopSearch);

            // Append sidebar cards beneath the search box
            sidebarCards.forEach((c) => rightCol.appendChild(c));

            splitWrap.appendChild(leftCol);
            splitWrap.appendChild(rightCol);
          }
        }
      }
    }

    arrangeDesktopLayout();
    window.addEventListener("hashchange", () => setTimeout(arrangeDesktopLayout, 80));
    window.addEventListener("resize", arrangeDesktopLayout);

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
