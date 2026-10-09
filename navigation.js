(function () {
  function setupNavigation() {
    // 1. Remove duplicate old headers if present
    const oldHeader = document.getElementById("siteDynamicHeader");
    if (oldHeader) oldHeader.remove();
    const oldDrawer = document.getElementById("dynDrawer");
    if (oldDrawer) oldDrawer.remove();

    // 2. Inject CSS
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

      /* Desktop navigation items */
      .dyn-desktop-nav {
        display: none;
        align-items: center;
        gap: 0.4rem;
        height: 100%;
        margin-left: auto;
        margin-right: 1.2rem;
      }
      .dyn-desktop-nav a, .dyn-more-btn {
        text-decoration: none !important;
        font-size: 0.88rem !important;
        font-weight: 600 !important;
        color: #cbd5e1 !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 0.85rem !important;
        border-bottom: 3px solid transparent !important;
        background: transparent;
        border-top: none; border-left: none; border-right: none;
        cursor: pointer;
        transition: 0.2s ease !important;
        font-family: inherit;
      }
      .dyn-desktop-nav a:hover, .dyn-more-btn:hover {
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }
      .dyn-desktop-nav a.is-active {
        color: #ffffff !important;
        border-bottom: 3px solid #38bdf8 !important;
        background: rgba(30, 58, 138, 0.45) !important;
      }

      /* More Options Dropdown */
      .dyn-dropdown-wrap {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .dyn-dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        min-width: 190px;
        background: #0b132b;
        border: 1px solid rgba(99, 179, 255, 0.25);
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        padding: 0.5rem 0;
        z-index: 1000001;
      }
      .dyn-dropdown-menu.show {
        display: block;
      }
      .dyn-dropdown-menu a {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        padding: 0.65rem 1rem !important;
        color: #cbd5e1 !important;
        text-decoration: none !important;
        font-size: 0.88rem !important;
        font-weight: 500 !important;
        height: auto !important;
        border: none !important;
      }
      .dyn-dropdown-menu a:hover {
        background: rgba(56, 189, 248, 0.15) !important;
        color: #38bdf8 !important;
      }

      /* Right actions */
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

      /* Mobile Drawer */
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

      /* Desktop View: Show Header items, hide hamburger */
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

    // 3. Clean Categories List (excludes policy pages)
    let categories = [
      { name: "Finance", path: "/#finance", slug: "finance", icon: "📈" },
      { name: "Math", path: "/#math", slug: "math", icon: "📐" },
      { name: "Utility", path: "/#utility", slug: "utility", icon: "🧰" }
    ];

    const currentUrl = window.location.href.toLowerCase();

    function renderNavElements(cats) {
      const top3 = cats.slice(0, 3);
      const remaining = cats.slice(3);

      const top3Html = top3
        .map((c) => {
          const isActive = currentUrl.includes(c.slug) ? "is-active" : "";
          return `<a href="${c.path}" class="${isActive}">${c.name}</a>`;
        })
        .join("");

      let moreHtml = "";
      if (remaining.length > 0 || cats.length >= 3) {
        const dropdownLinks = remaining
          .map((c) => `<a href="${c.path}"><span>${c.icon}</span> ${c.name}</a>`)
          .join("");

        moreHtml = `
          <div class="dyn-dropdown-wrap">
            <button class="dyn-more-btn" id="dynMoreToggleBtn" type="button">More Options ▾</button>
            <div class="dyn-dropdown-menu" id="dynDropdownMenu">
              ${dropdownLinks}
              <a href="/#all"><span>📋</span> All Tools</a>
            </div>
          </div>
        `;
      }

      const mobileHtml = cats
        .map((c) => `<a href="${c.path}"><span>${c.icon}</span> ${c.name}</a>`)
        .join("") + `<a href="/#all"><span>📋</span> All Tools</a>`;

      return {
        desktop: top3Html + moreHtml,
        mobile: mobileHtml
      };
    }

    const initialNav = renderNavElements(categories);

    // 4. Construct Header Markup
    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <header id="siteDynamicHeader">
        <a href="/" class="dyn-brand">
          <div class="dyn-logo-symbol">&sum;</div>
          <span class="dyn-brand-text">thequantcals</span>
        </a>

        <!-- Desktop Navigation: 3 Categories + More Options -->
        <nav class="dyn-desktop-nav" id="dynDesktopNav">
          ${initialNav.desktop}
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
        <div id="dynMobileLinksBox">
          ${initialNav.mobile}
        </div>
      </aside>
    `;

    document.body.insertAdjacentElement("afterbegin", navContainer);

    // 5. Events: Mobile Drawer and "More Options" Dropdown
    const hamburgerBtn = document.getElementById("dynHamburgerToggleBtn");
    const closeBtn = document.getElementById("dynCloseBtn");
    const drawer = document.getElementById("dynDrawer");
    const overlay = document.getElementById("dynOverlay");

    function setupDropdownEvent() {
      const moreBtn = document.getElementById("dynMoreToggleBtn");
      const dropMenu = document.getElementById("dynDropdownMenu");
      if (moreBtn && dropMenu) {
        moreBtn.onclick = function (e) {
          e.stopPropagation();
          dropMenu.classList.toggle("show");
        };
        document.addEventListener("click", function () {
          dropMenu.classList.remove("show");
        });
      }
    }
    setupDropdownEvent();

    if (hamburgerBtn) hamburgerBtn.onclick = () => { drawer.classList.add("open"); overlay.classList.add("open"); };
    if (closeBtn) closeBtn.onclick = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };
    if (overlay) overlay.onclick = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };

    // 6. Theme Toggle (Dark/Light)
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

    // 7. Auto-fetch categories from homepage while ignoring policy pages
    fetch("/")
      .then((res) => (res.ok ? res.text() : ""))
      .then((html) => {
        if (!html) return;
        const parser = new DOMParser();
        const homeDoc = parser.parseFromString(html, "text/html");
        const found = [];

        // Blacklist keywords for policies, terms, disclaimer, contact
        const ignored = ["privacy", "policy", "terms", "service", "disclaimer", "contact", "about", "dmca"];

        homeDoc.querySelectorAll('nav a, a[href*="/#"]').forEach((a) => {
          const rawText = a.textContent.replace(/[^\w\s]/gi, "").trim();
          const href = a.getAttribute("href") || "";
          const lower = (rawText + " " + href).toLowerCase();

          // Check that it's NOT a policy/legal link
          const isPolicy = ignored.some((word) => lower.includes(word));

          if (rawText && !isPolicy && !found.some((x) => x.name.toLowerCase() === rawText.toLowerCase())) {
            found.push({
              name: rawText,
              slug: rawText.toLowerCase().replace(/\s+/g, "-"),
              path: href,
              icon: "📁"
            });
          }
        });

        if (found.length >= 3) {
          const rendered = renderNavElements(found);
          const dNav = document.getElementById("dynDesktopNav");
          const mBox = document.getElementById("dynMobileLinksBox");
          if (dNav) dNav.innerHTML = rendered.desktop;
          if (mBox) mBox.innerHTML = rendered.mobile;
          setupDropdownEvent();
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
