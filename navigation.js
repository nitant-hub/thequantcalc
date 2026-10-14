(function () {
  function initNavigation() {
    let vMeta = document.querySelector('meta[name="viewport"]');
    if (!vMeta) {
      vMeta = document.createElement("meta");
      vMeta.name = "viewport";
      document.head.appendChild(vMeta);
    }
    vMeta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");

    ["siteDynamicHeader", "dynDrawer", "dynOverlay", "dynAllToolsModal"].forEach((id) => {
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
         SEARCH COMPONENT CORE
         ======================================================== */
      .dyn-search-wrapper {
        position: relative !important;
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 0.5rem 0 !important;
        pointer-events: auto !important;
        z-index: 20 !important;
      }

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

      .dyn-search-wrapper.in-cat-pane {
        max-width: 100% !important;
        width: 100% !important;
        margin-bottom: 0.5rem !important;
      }

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

      .dyn-search-row {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 38px !important;
        background: var(--bg-surface, #ffffff) !important;
        border: 1px solid #2563eb !important;
        border-radius: 8px !important;
        padding: 0 10px !important;
        box-sizing: border-box !important;
        box-shadow: 0 1px 3px rgba(37, 99, 235, 0.06) !important;
        transition: border-color 0.2s, box-shadow 0.2s !important;
        cursor: text !important;
        position: relative !important;
        z-index: 25 !important;
      }
      [data-theme="dark"] .dyn-search-row {
        background: var(--bg-surface, #1e293b) !important;
        border-color: #3b82f6 !important;
      }
      .dyn-search-wrapper .dyn-search-row:focus-within {
        border-color: #1d4ed8 !important;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important;
      }

      .dyn-modern-input {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-size: 14.5px !important;
        font-weight: 500 !important;
        letter-spacing: -0.1px !important;
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
          font-size: 13.5px !important;
        }
      }

      [data-theme="dark"] .dyn-modern-input { color: #f8fafc !important; }
      .dyn-modern-input::placeholder { color: var(--text-muted, #64748b) !important; font-size: 14px !important; font-weight: 400 !important; }

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

      .dyn-search-dropdown {
        position: absolute !important; 
        top: calc(100% + 6px) !important; 
        left: 0 !important; 
        width: 100% !important; 
        max-height: 260px !important;
        overflow-y: auto !important; 
        background: var(--bg-surface, #ffffff) !important; 
        border: 1px solid var(--border-color, #e2e8f0) !important; 
        border-radius: 8px !important;
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
        padding: 0.65rem 0.9rem !important; 
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-size: 0.9rem !important; 
        font-weight: 600 !important; 
        letter-spacing: -0.2px !important;
        color: var(--text-main, #1e293b) !important; 
        text-decoration: none !important; 
        border-bottom: 1px solid var(--border-color, #f1f5f9) !important; 
      }
      [data-theme="dark"] .dyn-search-dropdown a { color: #f8fafc !important; border-bottom: 1px solid #334155 !important; }
      .dyn-search-dropdown a:hover { background: var(--bg-primary, #f1f5f9) !important; color: #2563eb !important; }

      aside.sidebar {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      .dyn-tools-card {
        background: var(--bg-surface, #ffffff) !important;
        border: 1px solid var(--border-color, #e2e8f0) !important;
        border-radius: 16px !important;
        padding: 1rem !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
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
      
      .dyn-hamburger-btn span.close-x { 
        font-size: 2.35rem !important; 
        font-weight: 900 !important; 
        color: #ef4444 !important; 
        line-height: 1 !important; 
        display: none !important; 
        text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.9), 2px 3px 6px rgba(15, 23, 42, 0.35) !important; 
      }
      
      .dyn-hamburger-btn.is-active {
        background: var(--bg-surface, #ffffff) !important;
        border: 1px solid rgba(255, 255, 255, 0.9) !important;
        border-bottom: 1px solid var(--bg-surface, #ffffff) !important;
        border-radius: 12px 12px 0 0 !important;
        box-shadow: 0 -4px 12px rgba(15, 23, 42, 0.12) !important;
        z-index: 1000001 !important;
      }
      [data-theme="dark"] .dyn-hamburger-btn.is-active {
        background: #151c2e !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
        border-bottom-color: #151c2e !important;
      }
      .dyn-hamburger-btn.is-active span.bar { display: none !important; }
      .dyn-hamburger-btn.is-active span.close-x { display: block !important; }

      .dyn-drawer-menu {
        position: fixed !important; 
        top: calc((var(--nav-header-height) * 0.85) - 1px) !important; 
        right: -75vw !important; 
        width: max-content !important; 
        min-width: 165px !important;
        max-width: 87vw !important; 
        height: auto !important; 
        max-height: 75vh !important;
        background: var(--bg-surface, #ffffff) !important; 
        border: 1px solid rgba(255, 255, 255, 0.9) !important; 
        border-radius: 14px !important; 
        padding: 0.55rem 0.5rem 0.5rem 0.5rem !important; 
        display: flex !important; 
        flex-direction: column !important; 
        gap: 0.25rem !important; 
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

      .dyn-drawer-menu a {
        text-decoration: none !important; 
        color: var(--text-main, #0f172a) !important; 
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        font-weight: 600 !important; 
        font-size: 0.92rem !important;
        letter-spacing: -0.2px !important;
        padding: 0.38rem 0.5rem !important; 
        border-radius: 7px !important; 
        display: flex !important; 
        align-items: center !important; 
        gap: 0.45rem !important;
        white-space: nowrap !important; 
        width: fit-content !important;
        min-width: 100% !important;
        cursor: pointer !important;
        transition: background 0.15s ease, color 0.15s ease !important;
      }
      [data-theme="dark"] .dyn-drawer-menu a { color: #f8fafc !important; }
      .dyn-drawer-menu a:hover { background: rgba(37, 99, 235, 0.08) !important; color: #2563eb !important; }
      [data-theme="dark"] .dyn-drawer-menu a:hover { background: rgba(59, 130, 246, 0.15) !important; color: #38bdf8 !important; }

      .dyn-backdrop-overlay { position: fixed !important; inset: 0 !important; background: rgba(0,0,0,0.55) !important; z-index: 999998 !important; display: none !important; }
      .dyn-backdrop-overlay.open { display: block !important; }

      @media (min-width: 768px) {
        .dyn-desktop-nav { display: flex !important; }
        .dyn-hamburger-btn, .dyn-drawer-menu, .dyn-backdrop-overlay { display: none !important; }
      }

      /* ========================================================
         COMPACT 3-TOOL CAROUSEL (EXACT POPULAR TOOLS FOOTPRINT & MOBILE FIT)
         ======================================================== */
      .related-section {
        --card: rgba(255,255,255,.95);
        --text: #0f172a;
        --muted: #475569;
        --accent: #2563eb;
        --border: rgba(226, 232, 240, 0.85);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: var(--text);
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 0 10px 0 !important;
        padding: 10px 12px !important;
        overflow: hidden !important;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: linear-gradient(145deg, #ffffff, #f8fafc);
        box-sizing: border-box !important;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
      }
      [data-theme="dark"] .related-section {
        background: linear-gradient(145deg, #1e293b, #0f172a) !important;
        --card: rgba(30,41,59,.95);
        --text: #f8fafc;
        --muted: #94a3b8;
        --border: rgba(255,255,255,0.08);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.08) !important;
      }
      .related-section *, .related-section *::before, .related-section *::after { box-sizing: border-box; }

      .related-section .section-header {
        display: flex !important; 
        flex-direction: column !important; 
        gap: 6px !important; 
        margin-bottom: 8px !important; 
        padding-bottom: 6px !important; 
        border-bottom: 1px solid var(--border) !important;
        width: 100% !important;
      }

      /* LINE 1: Single-line title without global h3 bottom border */
      .related-section .title-row {
        width: 100% !important;
        display: block !important;
      }
      .related-section .section-title {
        margin: 0 !important; 
        padding: 0 !important;
        border: none !important;
        font-size: 14.5px !important; 
        font-weight: 800 !important; 
        letter-spacing: -0.3px !important; 
        color: var(--text) !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
      }
      [data-theme="dark"] .related-section .section-title { 
        color: #f8fafc !important; 
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      /* LINE 2: List view on left, Arrows on right */
      .related-section .controls-row {
        display: flex !important; 
        align-items: center !important; 
        justify-content: space-between !important; 
        gap: 8px !important; 
        width: 100% !important;
      }

      .dyn-list-toggle-btn {
        background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
        color: #ffffff !important;
        border: none !important;
        border-radius: 6px !important;
        padding: 3px 8px !important;
        font-size: 10.5px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        width: auto !important;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.25) !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
      }

      .related-section .carousel-controls { 
        display: flex !important; 
        gap: 5px !important; 
        flex-shrink: 0 !important; 
      }
      .related-section .carousel-btn {
        display: grid !important; 
        place-items: center !important; 
        width: 26px !important; 
        height: 26px !important;
        border: 1px solid var(--border) !important; 
        border-radius: 7px !important; 
        background: #ffffff !important;
        color: var(--text) !important; 
        font-size: 16px !important; 
        font-weight: 900 !important; 
        cursor: pointer !important; 
        padding: 0 !important; 
        line-height: 1 !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08) !important;
      }
      [data-theme="dark"] .related-section .carousel-btn { 
        background: #334155 !important; 
        color: #fff !important; 
        border-color: rgba(255, 255, 255, 0.15) !important; 
      }

      /* LINE 3: Strict Horizontal Viewport & Track (Zero Overflow) */
      .related-section .carousel-viewport {
        overflow: hidden !important; 
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 1px 0 !important; 
        touch-action: pan-y;
        cursor: grab; 
        user-select: none; 
        -webkit-user-select: none;
        position: relative !important;
      }
      .related-section .carousel-viewport:active { cursor: grabbing; }
      
      .related-section .carousel-track { 
        display: flex !important; 
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        gap: 0px !important;
        will-change: transform; 
        width: 100% !important; 
      }
      .related-section .tool-loading {
        margin: 0 !important; 
        padding: 12px 0 !important; 
        width: 100% !important; 
        text-align: center !important;
        color: var(--muted) !important; 
        font-size: 12px !important; 
        font-style: italic !important;
      }

      /* 3-Tool Slide Group */
      .related-section .tool-group {
        display: flex !important; 
        flex: 0 0 100% !important; 
        width: 100% !important; 
        min-width: 100% !important; 
        max-width: 100% !important;
        flex-direction: column !important; 
        gap: 5px !important; 
        padding: 0 1px !important;
        box-sizing: border-box !important;
      }

      .related-section .tool-card {
        position: relative !important; 
        display: flex !important; 
        flex-direction: column !important; 
        padding: 5px 8px !important;
        overflow: hidden !important; 
        color: inherit !important; 
        text-decoration: none !important;
        background: rgba(255, 255, 255, 0.75) !important; 
        border: 1px solid var(--border) !important; 
        border-radius: 8px !important;
        min-height: 40px !important;
        justify-content: center !important;
      }
      [data-theme="dark"] .related-section .tool-card {
        background: rgba(30, 41, 59, 0.75) !important;
      }
      .related-section .tool-card.is-empty {
        visibility: hidden !important;
        pointer-events: none !important;
      }
      .related-section .tool-card::before,
      .related-section .tool-icon,
      .related-section .tool-category,
      .related-section .tool-open { 
        display: none !important; 
      }
      
      .related-section .tool-title {
        position: relative !important; 
        margin: 0 0 1px 0 !important; 
        padding: 0 !important;
        border: none !important;
        font-size: 12.5px !important; 
        font-weight: 700 !important;
        color: #2563eb !important; 
        line-height: 1.25 !important; 
        text-decoration: underline !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      [data-theme="dark"] .related-section .tool-title { color: #38bdf8 !important; }

      .related-section .tool-description {
        position: relative !important; 
        margin: 0 !important; 
        padding: 0 !important;
        color: var(--muted) !important; 
        font-size: 11px !important; 
        line-height: 1.25 !important;
        font-weight: 400 !important; 
        white-space: nowrap !important; 
        overflow: hidden !important; 
        text-overflow: ellipsis !important;
      }

      /* LINE 4: Status (1 of 2) on Left, Dots on Right */
      .related-section .carousel-footer {
        display: flex !important; 
        align-items: center !important; 
        justify-content: space-between !important; 
        gap: 6px !important; 
        margin-top: 6px !important; 
        padding-top: 5px !important; 
        border-top: 1px solid var(--border) !important;
        width: 100% !important;
      }

      .related-section .carousel-status { 
        color: var(--muted) !important; 
        font-size: 11px !important; 
        font-weight: 600 !important; 
      }
      .related-section .carousel-dots { 
        display: flex !important; 
        justify-content: center !important; 
        align-items: center !important; 
        gap: 4px !important; 
      }
      .related-section .carousel-dot {
        width: 5px !important; 
        height: 5px !important; 
        padding: 0 !important; 
        border: 0 !important; 
        border-radius: 10px !important;
        background: #cbd5e1 !important; 
        cursor: pointer !important; 
        transition: width .25s ease, background .25s ease !important;
      }
      .related-section .carousel-dot[aria-current="true"] { 
        width: 14px !important; 
        background: #2563eb !important; 
      }

      /* POPUP MODAL FOR ALL TOOLS */
      #dynAllToolsModal {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(0, 0, 0, 0.6) !important;
        z-index: 10000000 !important;
        display: none;
        align-items: center !important;
        justify-content: center !important;
        padding: 1rem !important;
        backdrop-filter: blur(4px);
      }
      #dynAllToolsModal.open {
        display: flex !important;
      }
      .dyn-modal-content {
        background: var(--bg-surface, #ffffff) !important;
        width: 100% !important;
        max-width: 440px !important;
        max-height: 80vh !important;
        border-radius: 16px !important;
        border: 1px solid rgba(255, 255, 255, 0.8) !important;
        box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25) !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }
      [data-theme="dark"] .dyn-modal-content {
        background: #1e293b !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
      .dyn-modal-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 1rem 1.25rem !important;
        border-bottom: 1px solid var(--border-color, #e2e8f0) !important;
      }
      [data-theme="dark"] .dyn-modal-header { border-bottom-color: #334155 !important; }
      .dyn-modal-header h3 {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        font-size: 1.05rem !important;
        font-weight: 800 !important;
        color: var(--text-main, #0f172a) !important;
      }
      [data-theme="dark"] .dyn-modal-header h3 { color: #f8fafc !important; }
      .dyn-modal-close {
        background: rgba(100, 116, 139, 0.1) !important;
        border: none !important;
        border-radius: 50% !important;
        width: 28px !important;
        height: 28px !important;
        display: grid !important;
        place-items: center !important;
        font-size: 1.15rem !important;
        font-weight: 700 !important;
        color: var(--text-muted, #64748b) !important;
        cursor: pointer !important;
      }
      .dyn-modal-body {
        padding: 1rem 1.25rem !important;
        overflow-y: auto !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 0.75rem !important;
      }
      .dyn-modal-item {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.2rem !important;
        padding: 0.75rem 0.9rem !important;
        background: var(--bg-surface, #f8fafc) !important;
        border: 1px solid var(--border-color, #e2e8f0) !important;
        border-radius: 10px !important;
        text-decoration: none !important;
      }
      [data-theme="dark"] .dyn-modal-item {
        background: #0f172a !important;
        border-color: #334155 !important;
      }
      .dyn-modal-item-title {
        font-size: 0.92rem !important;
        font-weight: 700 !important;
        color: #2563eb !important;
      }
      [data-theme="dark"] .dyn-modal-item-title { color: #38bdf8 !important; }
      .dyn-modal-item-desc {
        font-size: 0.8rem !important;
        color: var(--text-muted, #64748b) !important;
        line-height: 1.35 !important;
        margin: 0 !important;
      }
      [data-theme="dark"] .dyn-modal-item-desc { color: #94a3b8 !important; }
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
      <div id="dynAllToolsModal">
        <div class="dyn-modal-content">
          <div class="dyn-modal-header">
            <h3>🔥 All Related Tools & Calculators</h3>
            <button class="dyn-modal-close" id="dynModalCloseBtn">&times;</button>
          </div>
          <div class="dyn-modal-body" id="dynModalBodyList">
            <p style="text-align:center;color:var(--text-muted,#64748b);font-style:italic;">Loading list...</p>
          </div>
        </div>
      </div>
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

    let globalSearchNode = document.getElementById("dynGlobalSearchNode");
    if (!globalSearchNode) {
      globalSearchNode = document.createElement("div");
      globalSearchNode.id = "dynGlobalSearchNode";
      globalSearchNode.className = "dyn-search-wrapper";
      globalSearchNode.innerHTML = `
        <div class="dyn-search-row">
          <input type="text" class="dyn-modern-input" placeholder="Search..." autocomplete="off">
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

    /* ONLY YOUR 4 REAL TOOLS (NO SIP OR EMI CALCULATOR) */
    const fallbackTools = [
      { path: "/tools/Compound-Interest-Calculator.html", title: "Compound Interest Calculator", text: "Estimate investment growth over time." },
      { path: "/tools/Exam-Marks-Percentage-Calculator.html", title: "Exam Marks Percentage Calculator", text: "Calculate exam scores and percentages." },
      { path: "/tools/accurate-age-calculator.html", title: "Accurate Age Calculator", text: "Calculate your exact age." },
      { path: "/tools/cosmic-weight.html", title: "Cosmic Weight Calculator", text: "Find your weight on other planets." }
    ];

    async function fetchRelatedTools() {
      try {
        let xmlText = null;
        try { xmlText = sessionStorage.getItem("cachedSitemap"); } catch (e) {}
        if (!xmlText) {
          const response = await fetch("/sitemap-pages.xml");
          if (response.ok) {
            xmlText = await response.text();
            try { sessionStorage.setItem("cachedSitemap", xmlText); } catch (e) {}
          }
        }

        if (xmlText) {
          const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
          const locs = xmlDoc.getElementsByTagName("loc");
          const currentUrl = window.location.pathname;
          const found = [];

          for (let i = 0; i < locs.length; i++) {
            const path = new URL(locs[i].textContent).pathname;
            if (path === currentUrl) continue;
            if (/calculator|converter|tools/i.test(path)) {
              const slug = path.split("/").filter(Boolean).pop() || "";
              const clean = slug.replace(/\.html?$/i, "").replace(/-/g, " ");
              const title = clean.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
              found.push({ path: path, title: title, text: "Open this free tool to calculate instantly." });
            }
          }
          if (found.length > 0) return found;
        }
        return fallbackTools;
      } catch (e) {
        return fallbackTools;
      }
    }

    let carouselInitialized = false;
    function initCarouselLogic() {
      if (carouselInitialized) return;
      const viewport = document.getElementById("carouselViewport");
      const track = document.getElementById("carouselTrack");
      if (!viewport || !track) return;
      carouselInitialized = true;

      const modal = document.getElementById("dynAllToolsModal");
      const closeBtn = document.getElementById("dynModalCloseBtn");
      const modalBody = document.getElementById("dynModalBodyList");

      document.querySelectorAll(".dyn-list-toggle-btn").forEach(btn => {
        btn.onclick = async () => {
          modal.classList.add("open");
          document.body.style.overflow = "hidden";
          modalBody.innerHTML = `<p style="text-align:center;color:var(--text-muted,#64748b);font-style:italic;padding:1rem;">Loading list...</p>`;
          
          const toolsList = await fetchRelatedTools();
          modalBody.innerHTML = toolsList.map(t => `
            <a href="${t.path}" class="dyn-modal-item">
              <span class="dyn-modal-item-title">${t.title}</span>
              <p class="dyn-modal-item-desc">${t.text}</p>
            </a>
          `).join("");
        };
      });

      if (closeBtn) {
        closeBtn.onclick = () => {
          modal.classList.remove("open");
          document.body.style.overflow = "";
        };
      }
      if (modal) {
        modal.onclick = (e) => {
          if (e.target === modal) {
            modal.classList.remove("open");
            document.body.style.overflow = "";
          }
        };
      }

      (async () => {
        const prev = document.getElementById("previousBtn");
        const next = document.getElementById("nextBtn");
        const dots = document.getElementById("carouselDots");
        const status = document.getElementById("carouselStatus");
        if (!prev || !next || !dots || !status) return;

        const tools = await fetchRelatedTools();
        track.innerHTML = "";

        const groups = [];
        for (let i = 0; i < tools.length; i += 3) {
          groups.push(tools.slice(i, i + 3));
        }

        groups.forEach((group) => {
          const groupDiv = document.createElement("div");
          groupDiv.className = "tool-group";

          for (let k = 0; k < 3; k++) {
            const tool = group[k];
            if (tool) {
              const a = document.createElement("a");
              a.className = "tool-card";
              a.href = tool.path;
              a.draggable = false;

              const title = document.createElement("div");
              title.className = "tool-title";
              title.textContent = tool.title;

              const desc = document.createElement("p");
              desc.className = "tool-description";
              desc.textContent = tool.text;

              a.append(title, desc);
              groupDiv.appendChild(a);
            } else {
              /* Empty slot placeholder when fewer than 3 tools in this slide */
              const emptyCard = document.createElement("div");
              emptyCard.className = "tool-card is-empty";
              emptyCard.innerHTML = `<div class="tool-title">&nbsp;</div><p class="tool-description">&nbsp;</p>`;
              groupDiv.appendChild(emptyCard);
            }
          }

          track.appendChild(groupDiv);
        });

        const cardGroups = Array.from(track.querySelectorAll(".tool-group"));
        let activeIdx = 0;
        let offset = 0, vel = 0, target = null, raf = null, last = 0;
        let dragging = false, moved = false, startX = 0, lastX = 0, lastT = 0;
        let autoFlowTimer = null;

        function maxIndex() { return Math.max(0, cardGroups.length - 1); }
        function step() { return viewport.getBoundingClientRect().width || viewport.clientWidth || 1; }
        function maxOffset() { return maxIndex() * step(); }
        function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
        function current() { return clamp(Math.round(offset / step()), 0, maxIndex()); }

        function buildDots() {
          dots.innerHTML = "";
          for (let i = 0; i <= maxIndex(); i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", "Show group " + (i + 1));
            dot.addEventListener("click", () => { 
              activeIdx = i;
              target = i * step(); 
              vel = 0; 
              start(); 
              resetAutoFlow();
            });
            dots.appendChild(dot);
          }
        }

        function apply() {
          track.style.transform = "translate3d(" + (-offset) + "px,0,0)";
          const i = current();
          activeIdx = i;
          Array.from(dots.children).forEach((dot, k) => {
            dot.setAttribute("aria-current", String(k === i));
          });
          prev.disabled = i === 0;
          next.disabled = i === maxIndex();
          prev.style.opacity = prev.disabled ? ".4" : "1";
          next.style.opacity = next.disabled ? ".4" : "1";
          status.textContent = (i + 1) + " of " + cardGroups.length;
        }

        function tick(t) {
          const dt = Math.min(40, t - last); last = t;
          if (!dragging) {
            if (target === null) {
              offset += vel * dt;
              vel *= Math.pow(0.995, dt);
              const max = maxOffset();
              if (offset < 0 || offset > max) {
                target = offset < 0 ? 0 : max; vel = 0;
              } else if (Math.abs(vel) < 0.03) {
                target = clamp(Math.round(offset / step()), 0, maxIndex()) * step(); vel = 0;
              }
            }
            if (target !== null) {
              const d = target - offset;
              offset += d * Math.min(1, dt * 0.02);
              if (Math.abs(d) < 0.5) { offset = target; target = null; apply(); raf = null; return; }
            }
          }
          apply();
          raf = requestAnimationFrame(tick);
        }
        function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }

        function stepAutoFlow() {
          if (dragging) return;
          let nextIdx = current() + 1;
          if (nextIdx > maxIndex()) {
            nextIdx = 0;
          }
          activeIdx = nextIdx;
          target = nextIdx * step();
          vel = 0;
          start();
        }

        function resetAutoFlow() {
          clearInterval(autoFlowTimer);
          autoFlowTimer = setInterval(stepAutoFlow, 5000);
        }

        prev.addEventListener("click", () => { 
          activeIdx = Math.max(0, current() - 1);
          target = activeIdx * step(); 
          vel = 0; 
          start(); 
          resetAutoFlow();
        });
        next.addEventListener("click", () => { 
          activeIdx = Math.min(maxIndex(), current() + 1);
          target = activeIdx * step(); 
          vel = 0; 
          start(); 
          resetAutoFlow();
        });

        viewport.addEventListener("pointerdown", e => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          dragging = true; moved = false;
          startX = lastX = e.clientX; lastT = e.timeStamp;
          vel = 0; target = null;
          clearInterval(autoFlowTimer);
        });
        window.addEventListener("pointermove", e => {
          if (!dragging) return;
          if (Math.abs(e.clientX - startX) > 6) moved = true;
          const dx = e.clientX - lastX;
          const dtm = Math.max(1, e.timeStamp - lastT);
          const max = maxOffset();
          const outside = (offset - dx < 0) || (offset - dx > max);
          offset -= outside ? dx * 0.35 : dx;
          vel = vel * 0.6 + (-dx / dtm) * 0.4;
          lastX = e.clientX; lastT = e.timeStamp;
          apply();
        });
        function release(e) {
          if (!dragging) return;
          dragging = false;
          if (e.timeStamp - lastT > 80) vel = 0;
          vel = clamp(vel, -4, 4);
          start();
          setTimeout(() => { moved = false; }, 0);
          resetAutoFlow();
        }
        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);

        track.addEventListener("click", e => {
          if (moved) { e.preventDefault(); e.stopPropagation(); }
        }, true);
        track.addEventListener("dragstart", e => e.preventDefault());

        window.addEventListener("resize", () => {
          target = null;
          vel = 0;
          offset = clamp(activeIdx * step(), 0, maxOffset());
          buildDots();
          apply();
        });

        buildDots();
        apply();
        resetAutoFlow();
      })();
    }

    function relocateSearch() {
      const isMobile = window.innerWidth < 768;
      const path = window.location.pathname.toLowerCase();
      const hash = (window.location.hash || "").toLowerCase();
      const isTool = path.includes("/tools/") || path.includes("calculator.html");
      const isCategory = hash.startsWith("#/") && hash.length > 2;

      /* ALWAYS REPLACE POPULAR TOOLS WITH CAROUSEL ON BOTH MOBILE & DESKTOP */
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

        if (!toolsCard.querySelector(".related-section")) {
          const children = Array.from(toolsCard.children);
          for (const child of children) {
            const txt = (child.textContent || "").toLowerCase();
            if (!txt.includes("system status") && !txt.includes("all tools process locally")) {
              child.remove();
            }
          }

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = `
            <section class="related-section" aria-labelledby="related-title">
              <div class="section-header">
                <div class="title-row">
                  <h3 class="section-title" id="related-title">🔥 Related Tools / Calculators</h3>
                </div>
                <div class="controls-row">
                  <button class="dyn-list-toggle-btn" type="button">📋 List view</button>
                  <div class="carousel-controls">
                    <button class="carousel-btn" id="previousBtn" type="button" aria-label="Previous">‹</button>
                    <button class="carousel-btn" id="nextBtn" type="button" aria-label="Next">›</button>
                  </div>
                </div>
              </div>

              <div class="carousel-viewport" id="carouselViewport" tabindex="0">
                <div class="carousel-track" id="carouselTrack">
                  <p class="tool-loading">Loading...</p>
                </div>
              </div>

              <div class="carousel-footer">
                <span class="carousel-status" id="carouselStatus" aria-live="polite">1 of 2</span>
                <div class="carousel-dots" id="carouselDots" aria-label="Position"></div>
              </div>
            </section>
          `;
          toolsCard.insertBefore(tempDiv.firstElementChild, toolsCard.firstChild);
          initCarouselLogic();
        }
      }

      /* 1. Mobile View Search & Ad Placement */
      if (isMobile) {
        const drawerSlot = document.getElementById("dynDrawerSearchSlot");
        globalSearchNode.className = "dyn-search-wrapper in-cat-pane";
        if (drawerSlot && globalSearchNode.parentElement !== drawerSlot) {
          drawerSlot.appendChild(globalSearchNode);
        }
        if (globalAdsenseNode.parentElement) globalAdsenseNode.remove();
        return;
      }

      /* 2. Desktop Category Page */
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
          if (rightPane.firstElementChild !== globalAdsenseNode) {
            rightPane.insertBefore(globalAdsenseNode, rightPane.firstChild);
          }
          if (globalSearchNode.parentElement !== rightPane) {
            rightPane.appendChild(globalSearchNode);
          }
          return;
        }
      }

      /* 3. Desktop Homepage View */
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

      /* 4. Desktop Sidebar Search & Ad Placement */
      if (sidebarAside) {
        const toolsCard = sidebarAside.querySelector(".dyn-tools-card");
        globalSearchNode.className = "dyn-search-wrapper in-sidebar";

        if (sidebarAside.firstElementChild !== globalSearchNode) {
          sidebarAside.insertBefore(globalSearchNode, sidebarAside.firstChild);
        }

        if (toolsCard && globalAdsenseNode.previousElementSibling !== globalSearchNode) {
          sidebarAside.insertBefore(globalAdsenseNode, toolsCard);
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
