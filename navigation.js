(function () {
  function setupNavigation() {
    // 1. Clean up duplicate elements if re-run
    const oldHeader = document.getElementById("siteDynamicHeader");
    if (oldHeader) oldHeader.remove();
    const oldDrawer = document.getElementById("dynDrawer");
    if (oldDrawer) oldDrawer.remove();
    const oldModal = document.getElementById("dynToolsModal");
    if (oldModal) oldModal.remove();

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

      /* Modern "More" button with distinct color */
      .dyn-more-btn {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.25)) !important;
        border: 1px solid rgba(56, 189, 248, 0.5) !important;
        color: #38bdf8 !important;
        font-weight: 700 !important;
        font-size: 0.82rem !important;
        padding: 0.35rem 0.85rem !important;
        border-radius: 20px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.3rem !important;
        transition: all 0.2s ease !important;
      }
      .dyn-more-btn:hover {
        background: linear-gradient(135deg, #0284c7, #4f46e5) !important;
        color: #ffffff !important;
        box-shadow: 0 2px 10px rgba(56, 189, 248, 0.4) !important;
      }

      /* Header actions (Theme & Hamburger) */
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
        overflow-y: auto !important;
      }
      .dyn-drawer-menu.open {
        right: 0 !important;
      }
      .dyn-drawer-menu a, .dyn-drawer-more-btn {
        text-decoration: none !important;
        color: #e2e8f0 !important;
        font-weight: 600 !important;
        font-size: 0.95rem !important;
        padding: 0.65rem 0.85rem !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.6rem !important;
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
        width: 100%;
        text-align: left;
      }
      .dyn-drawer-menu a:hover, .dyn-drawer-more-btn:hover {
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
        background: rgba(0, 0, 0, 0.6) !important;
        z-index: 999998 !important;
        display: none !important;
      }
      .dyn-backdrop-overlay.open {
        display: block !important;
      }

      /* ALL TOOLS MODAL POPUP */
      .dyn-tools-modal {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) scale(0.95) !important;
        width: 90% !important;
        max-width: 650px !important;
        max-height: 80vh !important;
        background: #0b132b !important;
        border: 1px solid rgba(56, 189, 248, 0.35) !important;
        border-radius: 14px !important;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8) !important;
        padding: 1.5rem !important;
        z-index: 1000005 !important;
        display: none !important;
        overflow-y: auto !important;
        color: #fff !important;
        box-sizing: border-box !important;
        transition: transform 0.2s ease !important;
      }
      .dyn-tools-modal.open {
        display: block !important;
        transform: translate(-50%, -50%) scale(1) !important;
      }
      .dyn-modal-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        padding-bottom: 0.8rem !important;
        margin-bottom: 1rem !important;
      }
      .dyn-modal-title {
        font-size: 1.2rem !important;
        font-weight: 700 !important;
        color: #38bdf8 !important;
      }
      .dyn-modal-close {
        background: none !important;
        border: none !important;
        color: #94a3b8 !important;
        font-size: 1.8rem !important;
        cursor: pointer !important;
        line-height: 1 !important;
      }
      .dyn-modal-section {
        margin-bottom: 1.2rem !important;
      }
      .dyn-modal-cat-name {
        font-size: 0.95rem !important;
        font-weight: 700 !important;
        color: #94a3b8 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        margin-bottom: 0.5rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.4rem !important;
      }
      .dyn-modal-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
        gap: 0.6rem !important;
      }
      .dyn-modal-tool-link {
        display: block !important;
        padding: 0.6rem 0.8rem !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 8px !important;
        color: #e2e8f0 !important;
        text-decoration: none !important;
        font-size: 0.88rem !important;
        font-weight: 500 !important;
        transition: 0.2s !important;
      }
      .dyn-modal-tool-link:hover {
        background: rgba(56, 189, 248, 0.2) !important;
        color: #38bdf8 !important;
        border-color: rgba(56, 189, 248, 0.4) !important;
      }

      /* Desktop View (>= 768px): Show top bar, hide hamburger */
      @media (min-width: 768px) {
        .dyn-desktop-nav {
          display: flex !important;
        }
        .dyn-hamburger-btn,
        .dyn-drawer-menu {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // 3. Default Categories and Tools Directory (Used if homepage is offline)
    const categorizedTools = [
      {
        category: "Mathematics",
        slug: "math",
        icon: "📐",
        tools: [
          { name: "Exam Marks Calculator", url: "/tools/Exam-Marks-Percentage-Calculator.html" },
          { name: "Percentage Calculator", url: "/#math" }
        ]
      },
      {
        category: "Finance",
        slug: "finance",
        icon: "📈",
        tools: [
          { name: "Compound Interest", url: "/tools/Compound-Interest-Calculator.html" },
          { name: "SIP Calculator", url: "/#finance" }
        ]
      },
      {
        category: "Utility",
        slug: "utility",
        icon: "🧰",
        tools: [
          { name: "Accurate Age Calculator", url: "/tools/accurate-age-calculator.html" }
        ]
      }
    ];

    const currentUrl = window.location.href.toLowerCase();

    // 4. Render Desktop Header Links (Top 3)
    const desktopLinksHtml = categorizedTools
      .slice(0, 3)
      .map((c) => {
        const isActive = currentUrl.includes(c.slug) ? "is-active" : "";
        return `<a href="/#${c.slug}" class="${isActive}">${c.category}</a>`;
      })
      .join("");

    // 5. Render Modal Tool Grid
    function buildModalHtml(catList) {
      return catList
        .map(
          (cat) => `
          <div class="dyn-modal-section">
            <div class="dyn-modal-cat-name">${cat.icon || "📁"} ${cat.category}</div>
            <div class="dyn-modal-grid">
              ${cat.tools
                .map((t) => `<a href="${t.url}" class="dyn-modal-tool-link">${t.name}</a>`)
                .join("")}
            </div>
          </div>
        `
        )
        .join("");
    }

    // 6. Build Navigation Markup
    const navContainer = document.createElement("div");
    navContainer.innerHTML = `
      <header id="siteDynamicHeader">
        <a href="/" class="dyn-brand">
          <div class="dyn-logo-symbol">&sum;</div>
          <span class="dyn-brand-text">thequantcals</span>
        </a>

        <!-- Desktop Navigation: 3 Categories + Modern 'More' button -->
        <nav class="dyn-desktop-nav" id="dynDesktopNav">
          ${desktopLinksHtml}
          <button class="dyn-more-btn" id="dynMoreModalBtn" type="button">More ▾</button>
        </nav>

        <div class="dyn-right-controls">
          <button id="dynThemeToggleBtn" class="dyn-theme-btn" aria-label="Toggle Theme">🌙</button>
          <button id="dynHamburgerToggleBtn" class="dyn-hamburger-btn" aria-label="Open Navigation">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div class="dyn-backdrop-overlay" id="dynOverlay"></div>

      <!-- Mobile Drawer -->
      <aside class="dyn-drawer-menu" id="dynDrawer">
        <button class="dyn-close-btn" id="dynCloseBtn" aria-label="Close menu">&times;</button>
        <a href="/">🏠 Home Base</a>
        <a href="/#finance">📈 Finance</a>
        <a href="/#math">📐 Math</a>
        <a href="/#utility">🧰 Utility</a>
        <button class="dyn-drawer-more-btn" id="dynDrawerMoreBtn" type="button">
          <span style="color:#38bdf8;">✨</span> Browse All Tools
        </button>
      </aside>

      <!-- Popup Modal: All Tools by Category -->
      <div class="dyn-tools-modal" id="dynToolsModal">
        <div class="dyn-modal-header">
          <div class="dyn-modal-title">Explore All Tools</div>
          <button class="dyn-modal-close" id="dynModalCloseBtn">&times;</button>
        </div>
        <div id="dynModalContent">
          ${buildModalHtml(categorizedTools)}
        </div>
      </div>
    `;

    document.body.insertAdjacentElement("afterbegin", navContainer);

    // 7. Interactive Bindings: Drawer & Modal
    const hamburgerBtn = document.getElementById("dynHamburgerToggleBtn");
    const closeBtn = document.getElementById("dynCloseBtn");
    const drawer = document.getElementById("dynDrawer");
    const overlay = document.getElementById("dynOverlay");

    const moreModalBtn = document.getElementById("dynMoreModalBtn");
    const drawerMoreBtn = document.getElementById("dynDrawerMoreBtn");
    const toolsModal = document.getElementById("dynToolsModal");
    const modalCloseBtn = document.getElementById("dynModalCloseBtn");

    function openModal() {
      drawer.classList.remove("open");
      toolsModal.classList.add("open");
      overlay.classList.add("open");
    }

    function closeModal() {
      toolsModal.classList.remove("open");
      drawer.classList.remove("open");
      overlay.classList.remove("open");
    }

    if (moreModalBtn) moreModalBtn.onclick = openModal;
    if (drawerMoreBtn) drawerMoreBtn.onclick = openModal;
    if (modalCloseBtn) modalCloseBtn.onclick = closeModal;

    if (hamburgerBtn) {
      hamburgerBtn.onclick = () => {
        drawer.classList.add("open");
        overlay.classList.add("open");
      };
    }
    if (closeBtn) closeBtn.onclick = closeModal;
    if (overlay) overlay.onclick = closeModal;

    // 8. Theme Toggle (Dark / Light)
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

    // 9. Auto-detect any extra tools from the homepage dynamically
    fetch("/")
      .then((res) => (res.ok ? res.text() : ""))
      .then((html) => {
        if (!html) return;
        const parser = new DOMParser();
        const homeDoc = parser.parseFromString(html, "text/html");

        // Parse tool cards or links directly from the homepage if available
        const foundTools = [];
        homeDoc.querySelectorAll('a[href*="/tools/"]').forEach((a) => {
          const name = a.textContent.trim().replace(/^[^a-zA-Z0-9]+/, "");
          const href = a.getAttribute("href");
          if (name && href && !foundTools.some((t) => t.url === href)) {
            foundTools.push({ name, url: href });
          }
        });

        if (foundTools.length > 0) {
          // Merge discovered tools into the utility/extra group
          categorizedTools.push({
            category: "More Calculators",
            slug: "more",
            icon: "✨",
            tools: foundTools
          });
          const modalContent = document.getElementById("dynModalContent");
          if (modalContent) {
            modalContent.innerHTML = buildModalHtml(categorizedTools);
          }
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
