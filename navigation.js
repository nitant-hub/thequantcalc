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
      :root { --nav-header-height: 56px; }
      body { padding-top: var(--nav-header-height) !important; }

      header#siteDynamicHeader {
        position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important;
        height: var(--nav-header-height) !important; z-index: 999999 !important; box-sizing: border-box !important;
        background: linear-gradient(135deg, #020818 0%, #0d1f5c 40%, #1a3a8f 75%, #0e2d6b 100%) !important;
        border-bottom: 1px solid rgba(99, 179, 255, 0.25) !important;
        box-shadow: 0 4px 20px rgba(10, 20, 80, 0.4) !important;
        display: flex !important; align-items: center !important; justify-content: space-between !important;
        padding: 0 1.2rem !important;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
      }
      .dyn-brand { display: flex !important; align-items: center !important; gap: 0.6rem !important; text-decoration: none !important; }
      .dyn-logo-icon {
        background: linear-gradient(135deg, #2563eb, #7c3aed) !important; width: 32px !important; height: 32px !important;
        border-radius: 8px !important; display: flex !important; align-items: center !important; justify-content: center !important;
        color: #fff !important; font-weight: 800 !important; font-size: 1.1rem !important;
      }
      .dyn-brand-text {
        font-size: 1.2rem !important; font-weight: 800 !important; letter-spacing: -0.4px !important;
        background: linear-gradient(90deg, #e0f2fe 0%, #bae6fd 60%, #c7d2fe 100%) !important;
        -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important;
      }
      .dyn-desktop-nav { display: none; align-items: center; gap: 0.5rem; height: 100%; margin-left: auto; margin-right: 1rem; }
      .dyn-desktop-nav a {
        text-decoration: none !important; font-size: 0.85rem !important; font-weight: 600 !important; color: #cbd5e1 !important;
        height: 100% !important; display: flex !important; align-items: center !important; padding: 0 0.8rem !important;
        border-bottom: 3px solid transparent !important; text-transform: uppercase !important;
      }
      .dyn-desktop-nav a:hover { color: #fff !important; background: rgba(255,255,255,0.08) !important; }
      .dyn-desktop-nav a.is-active { color: #fff !important; border-bottom: 3px solid #38bdf8 !important; background: rgba(30,58,138,0.45) !important; }
      .dyn-more-pill-btn {
        background: #1e3a8a !important; border: 1px solid rgba(96,165,250,0.4) !important; color: #fff !important;
        font-weight: 700 !important; font-size: 0.8rem !important; padding: 0.35rem 0.8rem !important; border-radius: 6px !important;
        height: auto !important; text-transform: uppercase !important;
      }
      .dyn-more-pill-btn:hover { background: #2563eb !important; }
      .dyn-right-controls { display: flex !important; align-items: center !important; gap: 0.65rem !important; }
      .dyn-theme-btn {
        background: rgba(255,255,255,0.1) !important; border: 1px solid rgba(255,255,255,0.2) !important; border-radius: 8px !important;
        font-size: 1rem !important; cursor: pointer !important; color: #fff !important; width: 34px !important; height: 34px !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
      }
      .dyn-hamburger-btn { background: none !important; border: none !important; cursor: pointer !important; display: flex !important; flex-direction: column !important; gap: 5px !important; padding: 4px !important; }
      .dyn-hamburger-btn span { width: 22px !important; height: 2.5px !important; background: #fff !important; border-radius: 2px !important; display: block !important; }
      
      /* Mobile Drawer Menu */
      .dyn-drawer-menu {
        position: fixed !important; top: 0 !important; right: -310px !important; width: 285px !important;
        height: 100vh !important; height: 100dvh !important;
        background: #fff !important; border-left: 1px solid #e2e8f0 !important; padding: 3.5rem 1.2rem 3rem !important;
        display: flex !important; flex-direction: column !important; gap: 0.65rem !important; transition: right 0.28s ease !important;
        box-shadow: -10px 0 30px rgba(0,0,0,0.25) !important; z-index: 1000000 !important; overflow-y: auto !important; box-sizing: border-box !important;
        -webkit-overflow-scrolling: touch !important;
      }
      [data-theme="dark"] .dyn-drawer-menu { background: #0b132b !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
      .dyn-drawer-menu.open { right: 0 !important; }
      .dyn-drawer-title { color: #475569; font-size: 0.8rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 0.3rem; }
      [data-theme="dark"] .dyn-drawer-title { color: #94a3b8; }
      .dyn-drawer-menu a {
        text-decoration: none !important; color: #1e293b !important; font-weight: 600 !important; font-size: 0.94rem !important;
        padding: 0.5rem 0.65rem !important; border-radius: 6px !important; display: flex !important; align-items: center !important; gap: 0.6rem !important;
      }
      [data-theme="dark"] .dyn-drawer-menu a { color: #e2e8f0 !important; }
      .dyn-drawer-menu a:hover { background: #f1f5f9 !important; color: #0284c7 !important; }
      [data-theme="dark"] .dyn-drawer-menu a:hover { background: rgba(56,189,248,0.15) !important; color: #38bdf8 !important; }
      .dyn-close-btn { position: absolute !important; top: 1rem !important; right: 1.2rem !important; background: none !important; border: none !important; font-size: 2rem !important; color: #64748b !important; cursor: pointer !important; line-height: 1 !important; }
      .dyn-backdrop-overlay { position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.55) !important; z-index: 999998 !important; display: none !important; }
      .dyn-backdrop-overlay.open { display: block !important; }

      @media (min-width: 768px) {
        .dyn-desktop-nav { display: flex !important; }
        .dyn-hamburger-btn, .dyn-drawer-menu, .dyn-backdrop-overlay { display: none !important; }
      }

      /* BOLD & HIGH-CONTRAST SEARCH COMPONENT */
      .dyn-search-wrapper { position: relative !important; width: 100% !important; box-sizing: border-box !important; display: block !important; }
      #dynDrawerSearchSlot { position: sticky !important; top: 0 !important; z-index: 10 !important; background: inherit !important; padding-bottom: 0.4rem !important; }
      
      .dyn-search-wrapper.in-drawer { margin-bottom: 0.6rem !important; }
      .dyn-search-wrapper.in-home { max-width: 640px !important; margin: 1.8rem auto 1.2rem !important; padding: 0 1rem !important; }
      .dyn-search-wrapper.in-sidebar { margin: 0 0 1.5rem 0 !important; }

      .dyn-search-input {
        width: 100% !important;
        padding: 0.85rem 1.1rem !important;
        font-size: 1rem !important;
        font-weight: 700 !important;
        letter-spacing: -0.2px !important;
        border-radius: 12px !important;
        border: 2px solid #94a3b8 !important;
        background: #ffffff !important;
        color: #0f172a !important;
        outline: none !important;
        box-sizing: border-box !important;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08) !important;
        transition: all 0.2s ease-in-out !important;
      }
      .dyn-search-input::placeholder {
        color: #64748b !important;
        font-weight: 600 !important;
        opacity: 0.9 !important;
      }
      .dyn-search-input:hover {
        border-color: #0284c7 !important;
      }
      .dyn-search-input:focus {
        border-color: #0284c7 !important;
        background: #ffffff !important;
        box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.2), 0 8px 20px rgba(2, 132, 199, 0.12) !important;
      }

      /* Dark mode bold search */
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
        box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.3), 0 8px 24px rgba(0, 0, 0, 0.5) !important;
      }

      /* Bold Dropdown styling */
      .dyn-search-dropdown {
        position: absolute !important; top: 100% !important; left: 0 !important; width: 100% !important; max-height: 250px !important;
        overflow-y: auto !important; background: #ffffff !important; border: 2px solid #cbd5e1 !important; border-radius: 10px !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.18) !important; margin-top: 6px !important; display: none; z-index: 1000005 !important;
      }
      [data-theme="dark"] .dyn-search-dropdown { background: #0f172a !important; border-color: #1e293b !important; box-shadow: 0 12px 32px rgba(0,0,0,0.6) !important; }
      
      .dyn-search-dropdown a {
        display: block !important; padding: 0.75rem 1rem !important; font-size: 0.92rem !important; font-weight: 700 !important;
        color: #0f172a !important; text-decoration: none !important; border-bottom: 1px solid #f1f5f9 !important; transition: background 0.15s !important;
      }
      [data-theme="dark"] .dyn-search-dropdown a { color: #f1f5f9 !important; border-bottom: 1px solid #1e293b !important; }
      .dyn-search-dropdown a:hover { background: #e0f2fe !important; color: #0369a1 !important; }
      [data-theme="dark"] .dyn-search-dropdown a:hover { background: #1e293b !important; color: #38bdf8 !important; }

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
    const moreUrl = "/#/all";

    const desktopLinksHtml = categories
      .map((c) => `<a href="${c.path}" class="${currentHash.includes(c.slug) ? "is-active" : ""}">${c.name}</a>`)
      .join("") + `<a href="${moreUrl}" class="dyn-more-pill-btn">MORE</a>`;

    const mobileLinksHtml = categories
      .map((c) => `<a href="${c.path}"><span>${c.icon}</span> ${c.name.charAt(0) + c.name.slice(1).toLowerCase()}</a>`)
      .join("") + `<a href="${moreUrl}"><span>📋</span> All Calculators</a>`;

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
        <button class="dyn-close-btn" id="dynCloseBtn" aria-label="Close menu">&times;</button>
        <div class="dyn-drawer-title">MENU</div>
        <div id="dynDrawerSearchSlot" style="width:100%;"></div>
        <a href="/"><span>🏠</span> Home</a>
        ${mobileLinksHtml}
      </aside>
    `;
    document.body.insertAdjacentElement("afterbegin", navContainer);

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

    // Factory: build self-contained bold search box
    function makeSearchNode(wrapperClass, elementId) {
      const wrap = document.createElement("div");
      if (elementId) wrap.id = elementId;
      wrap.className = "dyn-search-wrapper " + wrapperClass;
      wrap.innerHTML = `<input type="text" class="dyn-search-input" placeholder="🔍 Search any calculator..." autocomplete="off"><div class="dyn-search-dropdown"></div>`;

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

    // 1. MOBILE DRAWER: Permanent bold search
    const drawerSlot = document.getElementById("dynDrawerSearchSlot");
    const drawerSearch = makeSearchNode("in-drawer", "dynDrawerSearch");
    drawerSlot.appendChild(drawerSearch);

    // 2. DESKTOP SEARCH: Dedicated independent instance
    const desktopSearch = makeSearchNode(isHomePage ? "in-home" : "in-sidebar", "dynDesktopSearchWrap");

    function placeDesktopSearch() {
      if (desktopSearch.isConnected) return true;

      if (isHomePage) {
        const calcCard = document.querySelector(".calc-card");
        if (calcCard && calcCard.parentNode) {
          calcCard.parentNode.insertBefore(desktopSearch, calcCard.nextSibling);
          return true;
        }
        const mainContainer = document.querySelector("main, .hero, .container, #app, section");
        if (mainContainer && mainContainer.parentNode) {
          mainContainer.parentNode.insertBefore(desktopSearch, mainContainer.nextSibling);
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
