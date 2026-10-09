(function () {
  // 1. Automatically detect current tool category from URL path or meta tag
  function detectCurrentCategory() {
    const metaCat = document.querySelector('meta[name="category"]');
    if (metaCat && metaCat.content) return metaCat.content.trim().toLowerCase();

    const segments = window.location.pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      return segments[0].toLowerCase();
    } else if (segments.length === 1) {
      return segments[0].replace(".html", "").toLowerCase();
    }
    return "home";
  }

  // 2. Automatically fetch categories from home page to stay updated
  async function loadSiteCategories() {
    const defaultCategories = [
      { name: "Finance", slug: "finance", path: "/finance/" },
      { name: "Math", slug: "math", path: "/math/" },
      { name: "Utility", slug: "utility", path: "/utility/" }
    ];

    try {
      const response = await fetch("/");
      if (!response.ok) return defaultCategories;
      const htmlText = await response.text();
      const parser = new DOMParser();
      const homeDoc = parser.parseFromString(htmlText, "text/html");

      const discovered = [];
      const links = homeDoc.querySelectorAll('nav a, [data-category], a[href*="/#"]');

      links.forEach((a) => {
        const text = a.textContent.trim();
        const href = a.getAttribute("href");
        if (text && href && !discovered.some((c) => c.name.toLowerCase() === text.toLowerCase())) {
          discovered.push({
            name: text,
            slug: text.toLowerCase().replace(/\s+/g, "-"),
            path: href
          });
        }
      });

      return discovered.length > 0 ? discovered : defaultCategories;
    } catch (err) {
      return defaultCategories;
    }
  }

  // 3. Inject CSS for responsive layout, header, drawer, and desktop tabs
  function injectStyles() {
    if (document.getElementById("nav-injected-style")) return;
    const style = document.createElement("style");
    style.id = "nav-injected-style";
    style.innerHTML = `
      body {
        padding-top: 60px !important;
      }
      #siteGlobalHeader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 56px;
        z-index: 99999;
        background: linear-gradient(135deg, #020818 0%, #0d1f5c 40%, #1a3a8f 75%, #0e2d6b 100%);
        border-bottom: 1px solid rgba(99, 179, 255, 0.25);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.25rem;
        box-sizing: border-box;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .brand-box {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        text-decoration: none;
      }
      .brand-logo {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 800;
        font-size: 1.1rem;
      }
      .brand-name {
        font-size: 1.15rem;
        font-weight: 800;
        color: #e0f2fe;
        letter-spacing: -0.3px;
      }

      /* Desktop: Visible on desktop, hidden on mobile */
      .desktop-category-bar {
        display: none;
        align-items: center;
        gap: 0.4rem;
        height: 100%;
        margin-left: auto;
        margin-right: 1.5rem;
      }
      .desktop-category-bar a {
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: capitalize;
        color: #cbd5e1;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 0.9rem;
        transition: 0.2s;
        border-bottom: 3px solid transparent;
      }
      .desktop-category-bar a:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
      }
      .desktop-category-bar a.is-active {
        color: #ffffff !important;
        border-bottom: 3px solid #38bdf8 !important;
        background: rgba(30, 58, 138, 0.6) !important;
      }

      /* Mobile Hamburger Button: Hidden on desktop */
      .hamburger-toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 6px;
      }
      .hamburger-toggle-btn span {
        width: 24px;
        height: 2.5px;
        background: #ffffff;
        border-radius: 2px;
      }

      /* Mobile Drawer */
      .mobile-slide-drawer {
        position: fixed;
        top: 0;
        right: -280px;
        width: 260px;
        height: 100vh;
        background: #0b132b;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        padding: 4.5rem 1.25rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 100000;
        transition: right 0.25s ease-in-out;
        box-sizing: border-box;
      }
      .mobile-slide-drawer.drawer-open {
        right: 0;
      }
      .mobile-slide-drawer a {
        text-decoration: none;
        color: #e2e8f0;
        font-size: 1rem;
        font-weight: 600;
        padding: 0.65rem 0.8rem;
        border-radius: 8px;
        transition: 0.2s;
      }
      .mobile-slide-drawer a:hover,
      .mobile-slide-drawer a.is-active {
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
      }
      .close-drawer-btn {
        position: absolute;
        top: 1rem;
        right: 1.25rem;
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 1.8rem;
        cursor: pointer;
      }
      .nav-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99998;
        display: none;
      }
      .nav-backdrop.show {
        display: block;
      }

      /* Switch layout at 768px */
      @media (min-width: 768px) {
        .desktop-category-bar {
          display: flex;
        }
        .hamburger-toggle-btn,
        .mobile-slide-drawer,
        .nav-backdrop {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 4. Mount header, desktop links, and mobile drawer
  async function initNavigation() {
    injectStyles();
    const currentCat = detectCurrentCategory();
    const categories = await loadSiteCategories();

    const desktopHtml = categories
      .map((c) => {
        const active = currentCat.includes(c.slug) ? "is-active" : "";
        return `<a href="${c.path}" class="${active}">${c.name}</a>`;
      })
      .join("");

    const mobileHtml = categories
      .map((c) => {
        const active = currentCat.includes(c.slug) ? "is-active" : "";
        return `<a href="${c.path}" class="${active}">${c.name}</a>`;
      })
      .join("");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <header id="siteGlobalHeader">
        <a href="/" class="brand-box">
          <div class="brand-logo">&sum;</div>
          <span class="brand-name">thequantcals</span>
        </a>

        <!-- Desktop Navigation Bar -->
        <nav class="desktop-category-bar">
          ${desktopHtml}
        </nav>

        <!-- Mobile Hamburger Icon -->
        <button class="hamburger-toggle-btn" id="openNavDrawer" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </header>

      <div class="nav-backdrop" id="navBackdrop"></div>
      <aside class="mobile-slide-drawer" id="mobileDrawer">
        <button class="close-drawer-btn" id="closeNavDrawer">&times;</button>
        <a href="/">🏠 Home</a>
        ${mobileHtml}
      </aside>
    `;

    document.body.insertAdjacentElement("afterbegin", wrapper);

    // Bind mobile menu open/close events
    const drawer = document.getElementById("mobileDrawer");
    const backdrop = document.getElementById("navBackdrop");
    const openBtn = document.getElementById("openNavDrawer");
    const closeBtn = document.getElementById("closeNavDrawer");

    const toggle = (isOpen) => {
      drawer.classList.toggle("drawer-open", isOpen);
      backdrop.classList.toggle("show", isOpen);
    };

    if (openBtn) openBtn.onclick = () => toggle(true);
    if (closeBtn) closeBtn.onclick = () => toggle(false);
    if (backdrop) backdrop.onclick = () => toggle(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }
})();
