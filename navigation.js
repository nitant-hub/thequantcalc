(function () {
  const currentPath = window.location.pathname.toLowerCase();
  const isToolPage = currentPath.includes("/tools/") || currentPath.includes("calculator.html");
  const isHomePage = !isToolPage;

  function initNavigation() {
    ["siteDynamicHeader", "dynDrawer", "dynOverlay", "dynSearch"].forEach((id) => {
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
      .dyn-drawer-menu {
        position: fixed !important; top: 0 !important; right: -310px !important; width: 285px !important; height: 100vh !important;
        background: #fff !important; border-left: 1px solid #e2e8f0 !important; padding: 3.5rem 1.2rem 3rem !important;
        display: flex !important; flex-direction: column !important; gap: 0.65rem !important; transition: right 0.28s ease !important;
        box-shadow: -10px 0 30px rgba(0,0,0,0.25) !important; z-index: 1000000 !important; overflow-y: auto !important; box-sizing: border-box !important;
      }
      [data-theme="dark"] .dyn-drawer-menu { background: #0b132b !important; border-left: 1px solid rgba(255,255,255,0.1) !important; }
      .dyn-drawer-menu.open { right: 0 !important; }
      .dyn-drawer-title { color: #64748b; font-size: 0.78rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
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
        /* Tool pages only: content on the left, sidebar on the right */
        .dyn-two-col {
          display: grid !important; grid-template-columns: minmax(0, 1fr) 300px !important; gap: 2rem !important;
          align-items: start !important; max-width: 1200px !important; margin: 1.5rem auto !important;
          padding: 0 1rem !important; width: 100% !important; box-sizing: border-box !important;
        }
        .dyn-two-col > .dyn-side { grid-column: 2 !important; grid-row: 1 !important; width: auto !important; min-width: 0 !important; margin: 0 !important; }
        .dyn-two-col > *:not(.dyn-side) { grid-column: 1 !important; min-width: 0 !important; }
      }
      .dyn-search-wrapper { position: relative !important; width: 100% !important; box-sizing: border-box !important; }
      .dyn-search-wrapper.in-drawer { margin-bottom: 0.8rem !important; }
      .dyn-search-wrapper.in-home { max-width: 640px !important; margin: 1.2rem auto !important; padding: 0 1rem !important; }
      .dyn-search-wrapper.in-sidebar { margin: 0 0 1.2rem 0 !important; }
      .dyn-search-input {
        width: 100% !important; padding: 0.65rem 0.9rem !important; font-size: 0.9rem !important; border-radius: 8px !important;
        border: 1px solid #cbd5e1 !important; background: #f8fafc !important; color: #0f172a !important; outline: none !important; box-sizing: border-box !important;
      }
      .dyn-search-input:focus { border-color: #38bdf8 !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(56,189,248,0.15) !important; }
      [data-theme="dark"] .dyn-search-input { background: #1e293b !important; border: 1px solid #334155 !important; color: #f8fafc !important; }
      .dyn-search-dropdown {
        position: absolute !important; top: 100% !important; left: 0 !important; width: 100% !important; max-height: 240px !important;
        overflow-y: auto !important; background: #fff !important; border: 1px solid #cbd5e1 !important; border-radius: 8px !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important; margin-top: 5px !important; display: none; z-index: 1000005 !important;
      }
      [data-theme="dark"] .dyn-search-dropdown { background: #0f172a !important; border-color: #334155 !important; }
      .dyn-search-dropdown a { display: block !important; padding: 0.6rem 0.85rem !important; font-size: 0.86rem !important; color: #1e293b !important; text-decoration: none !important; border-bottom: 1px solid #f1f5f9 !important; }
      [data-theme="dark"] .dyn-search-dropdown a { color: #e2e8f0 !important; border-bottom: 1px solid #1e293b !important; }
      .dyn-search-dropdown a:hover { background: #f0f9ff !important; color: #0284c7 !important; }
      [data-theme="dark"] .dyn-search-dropdown a:hover { background: #1e293b !important; color: #38bdf8 !important; }
    `;

    const categories = [
      { name: "FINANCE", path: "/#/financial", slug: "financial", icon: "📈" },
      { name: "MATH", path: "/#/math", slug: "math", icon: "📐" },
      { name: "UTILITY", path: "/#/utility", slug: "utility", icon: "🧰" }
    ];
    const moreUrl = "/#/all";

    const desktopLinksHtml = categories
      .map((c) => `<a href="${c.path}" class="${currentPath.includes(c.slug) ? "is-active" : ""}">${c.name}</a>`)
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
        <div id="dynDrawerSearchSlot"></div>
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
    fetch("/").then((r) => (r.ok ? r.text() : "")).then((h) => { if (h) scanLinks(new DOMParser().parseFromString(h, "text/html")); }).catch(() => {});

    const wrap = document.createElement("div");
    wrap.id = "dynSearch";
    wrap.className = "dyn-search-wrapper in-drawer";
    wrap.innerHTML = `<input type="text" class="dyn-search-input" placeholder="🔍 Search calculators..." autocomplete="off"><div class="dyn-search-dropdown"></div>`;
    document.getElementById("dynDrawerSearchSlot").appendChild(wrap);

    const input = wrap.querySelector(".dyn-search-input");
    const dropdown = wrap.querySelector(".dyn-search-dropdown");
    input.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) { dropdown.style.display = "none"; dropdown.innerHTML = ""; return; }
      const matches = allTools.filter((t) => t.name.toLowerCase().includes(q));
      dropdown.innerHTML = matches.length
        ? matches.map((m) => `<a href="${m.url}">${m.name}</a>`).join("")
        : `<div style="padding:0.6rem;font-size:0.8rem;color:#94a3b8;">No calculators found</div>`;
      dropdown.style.display = "block";
    });
    document.addEventListener("click", (e) => { if (!wrap.contains(e.target)) dropdown.style.display = "none"; });

    function findHomeAnchor() {
      const el = Array.from(document.querySelectorAll("h1, h2, h3, h4")).find((n) => {
        if (n.closest("#dynDrawer") || n.closest("#siteDynamicHeader")) return false;
        return (n.textContent || "").trim().toLowerCase().includes("interactive calculator");
      });
      if (!el) return null;
      return el.closest("section, .card") || el.parentElement;
    }
    function findSidebarBox() {
      const el = Array.from(document.querySelectorAll("h1, h2, h3, h4, b, strong")).find((n) => {
        if (n.closest("#dynDrawer") || n.closest("#siteDynamicHeader")) return false;
        return (n.textContent || "").trim().toLowerCase().includes("popular tools");
      });
      if (!el) return null;
      return el.closest("aside, .sidebar, .card") || el.parentElement;
    }

    function placeSearch() {
      const slot = document.getElementById("dynDrawerSearchSlot");
      if (!slot) return true;
      if (window.innerWidth < 768) {
        if (wrap.parentElement !== slot) slot.appendChild(wrap);
        wrap.className = "dyn-search-wrapper in-drawer";
        return true;
      }
      if (isHomePage) {
        const anchor = findHomeAnchor();
        if (!anchor || !anchor.parentNode) return false;
        if (anchor.nextSibling !== wrap) anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
        wrap.className = "dyn-search-wrapper in-home";
        return true;
      }
      const box = findSidebarBox();
      if (!box) {
        const top = document.querySelector("main, .main-body, .wrapper, .container") || document.body;
        if (top.firstChild !== wrap) top.insertBefore(wrap, top.firstChild);
        wrap.className = "dyn-search-wrapper in-home";
        return false;
      }
      const par = box.parentElement;
      if (par && par !== document.body) {
        const d = getComputedStyle(par).display;
        const kids = Array.from(par.children).filter((c) => !/^(SCRIPT|STYLE|LINK)$/.test(c.tagName));
        if (d !== "grid" && d !== "flex" && kids.length >= 2 && kids.length <= 4) {
          par.classList.add("dyn-two-col");
          box.classList.add("dyn-side");
        }
      }
      if (box.firstChild !== wrap) box.insertBefore(wrap, box.firstChild);
      wrap.className = "dyn-search-wrapper in-sidebar";
      return true;
    }

    const drawer = document.getElementById("dynDrawer");
    const overlay = document.getElementById("dynOverlay");
    const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };
    document.getElementById("dynHamburgerToggleBtn").onclick = () => { drawer.classList.add("open"); overlay.classList.add("open"); };
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

    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (placeSearch() || tries > 15) clearInterval(timer);
    }, 200);
    placeSearch();
    window.addEventListener("load", placeSearch);
    window.addEventListener("resize", () => { closeDrawer(); placeSearch(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initNavigation);
  else initNavigation();
})();
