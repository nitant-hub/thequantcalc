(function () {
  function setupNavigation() {
    // 1. Remove any old static header left inside the tool HTML
    const existingHeader = document.getElementById("siteHeader");
    if (existingHeader && !existingHeader.dataset.dynamicNav) {
      existingHeader.remove();
    }
    const existingDrawer = document.getElementById("navMenu");
    if (existingDrawer) {
      existingDrawer.remove();
    }

    // Prevent duplicate injection if script runs twice
    if (document.querySelector('header[data-dynamic-nav="true"]')) return;

    // 2. Inject responsive CSS
    const style = document.createElement("style");
    style.id = "injectedNavigationStyles";
    style.textContent = `
      :root {
        --nav-header-height: 56px;
      }

      body {
        padding-top: var(--nav-header-height) !important;
      }

      /* Fixed Header across all tools */
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
        padding: 0 1.25rem !important;
        box-sizing: border-box !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        transform: none !important;
      }

      /* Logo / Brand */
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

      /* Desktop Header Categories: Visible on desktop, hidden on mobile */
      .dyn-desktop-nav {
        display: none;
        align-items: center;
        gap: 0.4rem;
        height: 100%;
        margin-left: auto;
        margin-right: 1.25rem;
      }
      .dyn-desktop-nav a {
        text-decoration: none !important;
        font-size: 0.88rem !important;
        font-weight: 600 !important;
        color: #cbd5e1 !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 0.85rem !important;
        border-bottom: 3px solid transparent !important;
        transition: 0.2s ease !important;
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

      /* Right Controls (Theme + Hamburger) */
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

      /* Hamburger Menu Button: Visible on mobile, hidden on desktop */
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

      /* Mobile Drawer Menu */
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
      .dyn-drawer-menu a:hover,
      .dyn-drawer-menu a.is-active {
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

      /* Mobile Overlay */
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

      /* Desktop View Breakpoint (>= 768px):
         Hamburger disappears, Categories appear in header */
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

    // 3. Category definitions
    const categories = [
      { name: "Finance Tools", path: "/#finance", icon: "📈", slug: "finance" },
      { name: "Mathematics", path: "/#math", icon: "📐", slug: "math" },
      { name: "Utility Tools", path: "/#utility", icon: "🧰", slug: "utility" },
      { name: "All Tools", path: "/#all", icon: "📋", slug: "all" }
    ];

    const currentUrl = window.location.href.toLowerCase();

    function renderDesktopHtml(list) {
      return list
        .map((cat) => {
          const isActive = currentUrl.includes(cat.slug) ? "is-active" : "";
          return `<a href="${cat.path}" class="${isActive}">${cat.name}</a>`;
        })
        .join("");
    }

    function renderMobileHtml(list) {
      return list
        .map((cat) => {
          const isActive = currentUrl.includes(cat.slug) ? "is-active" : "";
          return `<a href="${cat.path}" class="${isActive}"><span>${cat.icon}</span> ${cat.name}</a>`;
        })
        .join("");
    }

    // 4. Build markup
    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <header id="siteDynamicHeader" data-dynamic-nav="true">
        <a href="/" class="dyn-brand">
          <div class="dyn-logo-symbol">&sum;</div>
          <span class="dyn-brand-text">thequantcals</span>
        </a>

        <!-- Desktop Navigation Categories -->
        <nav class="dyn-desktop-nav" id="dynDesktopNav">
          ${renderDesktopHtml(categories)}
        </nav>

        <div class="dyn-right-controls">
          <button id="dynThemeToggleBtn" class="dyn-theme-btn" aria-label="Toggle Theme">🌙</button>
          <button id="dynHamburgerToggleBtn" class="dyn-hamburger-btn" aria-label="Open Navigation Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div class="dyn-backdrop-overlay" id="dynOverlay"></div>
      <aside class="dyn-drawer-menu" id="dynDrawer">
        <button class="dyn-close-btn" id="dynCloseBtn" aria-label="Close menu">&times;</button>
        <a href="/">🏠 Home Base</a>
        <div id="dynMobileLinksBox">
          ${renderMobileHtml(categories)}
        </div>
      </aside>
    `;

    document.body.insertAdjacentElement("afterbegin", navContainer);

    // 5. Drawer open/close interaction
    const hamburgerBtn = document.getElementById("dynHamburgerToggleBtn");
    const closeBtn = document.getElementById("dynCloseBtn");
    const drawer = document.getElementById("dynDrawer");
    const overlay = document.getElementById("dynOverlay");

    const openMenu = () => {
      drawer.classList.add("open");
      overlay.classList.add("open");
    };
    const closeMenu = () => {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    // 6. Sync theme toggle (Dark / Light)
    const themeBtn = document.getElementById("dynThemeToggleBtn");
    const rootEl = document.documentElement;

    if (localStorage.getItem("theme") === "dark") {
      rootEl.setAttribute("data-theme", "dark");
      if (themeBtn) themeBtn.textContent = "☀️";
    }

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const isDark = rootEl.getAttribute("data-theme") === "dark";
        if (isDark) {
          rootEl.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
          themeBtn.textContent = "🌙";
        } else {
          rootEl.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
          themeBtn.textContent = "☀️";
        }
      });
    }

    // 7. Auto-fetch any newer categories from index.html in the background
    fetch("/")
      .then((res) => (res.ok ? res.text() : ""))
      .then((html) => {
        if (!html) return;
        const parser = new DOMParser();
        const homeDoc = parser.parseFromString(html, "text/html");
        const found = [];

        homeDoc.querySelectorAll('nav a, a[href*="/#"]').forEach((a) => {
          const rawText = a.textContent.replace(/[^\w\s]/gi, "").trim();
          const href = a.getAttribute("href");
          if (rawText && href && !found.some((item) => item.name.toLowerCase() === rawText.toLowerCase())) {
            found.push({
              name: rawText,
              slug: rawText.toLowerCase().replace(/\s+/g, "-"),
              path: href,
              icon: "📁"
            });
          }
        });

        if (found.length > 0) {
          const dNav = document.getElementById("dynDesktopNav");
          const mBox = document.getElementById("dynMobileLinksBox");
          if (dNav) dNav.innerHTML = renderDesktopHtml(found);
          if (mBox) mBox.innerHTML = renderMobileHtml(found);
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
