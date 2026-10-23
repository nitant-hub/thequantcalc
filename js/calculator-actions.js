/**
 * TheQuantCal — Global Calculator Actions
 * File: /js/calculator-actions.js
 *
 * Actions: Download, Print, Copy, Helpful Yes/No, Embed, Share, Report.
 *
 * v2 layout updates:
 * - Three-dot trigger in the top-left corner (auto-moves to nearest safe corner)
 * - Slim, scrollable popup (max-height min(420px, viewport - margins))
 * - Smart below/above positioning with horizontal adjustment
 * - AdSense-aware placement (read-only; never touches ad elements)
 * - Idempotent, debounced MutationObserver (no feedback loops)
 *
 * No external libraries required.
 */
(function () {
  "use strict";

  if (window.__TQC_CALCULATOR_ACTIONS__) return;
  window.__TQC_CALCULATOR_ACTIONS__ = true;

  var STYLE_ID = "tqc-actions-styles";
  var HOST_CLASS = "tqc-actions-host";
  var TRIGGER_CLASS = "tqc-actions-trigger";
  var MENU_CLASS = "tqc-actions-menu";
  var TOAST_CLASS = "tqc-actions-toast";

  var TRIGGER_SIZE = 36;
  var TRIGGER_INSET = 8;

  var activeMenu = null;
  var activeTrigger = null;
  var activeCard = null;
  var toastTimer = 0;
  var repositionFrame = 0;
  var scanTimer = 0;
  var resizeObserver = null;

  var hostByCard = new WeakMap();

  var RESULT_SELECTORS = [
    "[data-calculator-result]",
    ".results-dashboard",
    ".calculator-result",
    ".result-card",
    ".result-box",
    ".result-container",
    ".calculation-result",
    "#results",
    "#result",
    ".result"
  ];

  var AD_SELECTORS = [
    "ins.adsbygoogle",
    ".adsbygoogle",
    "iframe[id^='google_ads_iframe']",
    "iframe[id^='aswift']",
    "iframe[src*='doubleclick.net']",
    "iframe[src*='googlesyndication.com']",
    "[data-ad-client]",
    "[data-ad-slot]",
    "[data-anchor-status]",
    ".google-auto-placed",
    ".ad-container",
    ".ad-wrapper",
    ".ads-container",
    ".ad-slot",
    ".ad-box",
    ".advertisement"
  ];

  var AD_ANCESTOR_SELECTOR = AD_SELECTORS.join(",");

  var ACTIONS = [
    { id: "download", icon: "↓", label: "Download result" },
    { id: "print", icon: "▤", label: "Print result" },
    { id: "copy", icon: "▣", label: "Copy result" },
    { id: "feedback", icon: "♡", label: "Was this helpful?" },
    { id: "embed", icon: "⌘", label: "Embed calculator" },
    { id: "share", icon: "↗", label: "Share result" },
    { id: "report", icon: "⚑", label: "Report an issue" }
  ];

  /* ------------------------------------------------------------------ *
   * CSS
   * ------------------------------------------------------------------ */
  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      .${HOST_CLASS} {
        position: absolute !important;
        top: ${TRIGGER_INSET}px !important;
        left: ${TRIGGER_INSET}px !important;
        right: auto !important;
        bottom: auto !important;
        z-index: 30 !important;
        line-height: 1 !important;
      }
      .${HOST_CLASS}[data-tqc-corner="tr"] {
        left: auto !important;
        right: ${TRIGGER_INSET}px !important;
      }
      .${HOST_CLASS}[data-tqc-corner="bl"] {
        top: auto !important;
        bottom: ${TRIGGER_INSET}px !important;
      }
      .${HOST_CLASS}[data-tqc-corner="br"] {
        top: auto !important;
        left: auto !important;
        right: ${TRIGGER_INSET}px !important;
        bottom: ${TRIGGER_INSET}px !important;
      }

      .${TRIGGER_CLASS} {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        width: ${TRIGGER_SIZE}px !important;
        height: ${TRIGGER_SIZE}px !important;
        min-width: ${TRIGGER_SIZE}px !important;
        min-height: ${TRIGGER_SIZE}px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 1px solid rgba(148,163,184,.25) !important;
        border-radius: 12px !important;
        background: rgba(15,23,42,.92) !important;
        color: #f8fafc !important;
        box-shadow: 0 5px 18px rgba(0,0,0,.16) !important;
        font: 700 22px/1 system-ui,sans-serif !important;
        cursor: pointer !important;
        -webkit-tap-highlight-color: transparent;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        transition: background .18s ease, transform .18s ease;
      }
      .${TRIGGER_CLASS}:hover {
        background: #1d4ed8 !important;
        transform: translateY(-1px);
      }
      .${TRIGGER_CLASS}:focus-visible,
      .${MENU_CLASS} button:focus-visible {
        outline: 2px solid #38bdf8 !important;
        outline-offset: 2px !important;
      }

      .${MENU_CLASS} {
        position: fixed;
        z-index: 2147483000;
        box-sizing: border-box;
        width: min(258px, calc(100vw - 24px));
        max-height: min(420px, calc(100vh - 24px));
        max-height: min(420px, calc(100dvh - 24px));
        padding: 5px;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: rgba(125,211,252,.4) transparent;
        border: 1px solid rgba(148,163,184,.25);
        border-radius: 15px;
        color: #f8fafc;
        background: rgba(12,19,34,.97);
        box-shadow: 0 18px 50px rgba(0,0,0,.32),
                    inset 0 1px 0 rgba(255,255,255,.055);
        backdrop-filter: blur(24px) saturate(150%);
        -webkit-backdrop-filter: blur(24px) saturate(150%);
        opacity: 0;
        transform: translateY(5px) scale(.985);
        transition: opacity .15s ease, transform .15s ease;
        font: 13.5px/1.3 system-ui,-apple-system,BlinkMacSystemFont,
              "Segoe UI",sans-serif;
      }
      .${MENU_CLASS}::-webkit-scrollbar { width: 6px; }
      .${MENU_CLASS}::-webkit-scrollbar-thumb {
        background: rgba(125,211,252,.35);
        border-radius: 6px;
      }
      .${MENU_CLASS}.tqc-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .${MENU_CLASS}.tqc-opening-up { transform-origin: bottom left; }
      .${MENU_CLASS}.tqc-opening-down { transform-origin: top left; }

      .tqc-actions-heading {
        padding: 5px 8px 4px;
        color: #94a3b8;
        font-size: 10px;
        font-weight: 750;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .${MENU_CLASS} button {
        display: flex;
        align-items: center;
        gap: 9px;
        box-sizing: border-box;
        width: 100%;
        min-height: 36px;
        margin: 0;
        padding: 5px 8px;
        border: 0;
        border-radius: 9px;
        background: transparent;
        color: #e2e8f0;
        text-align: left;
        font: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: background .15s ease, color .15s ease;
      }
      .${MENU_CLASS} button:hover {
        background: rgba(59,130,246,.17);
        color: #fff;
      }

      .tqc-actions-icon {
        display: inline-flex;
        flex: 0 0 22px;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 7px;
        background: rgba(59,130,246,.14);
        color: #7dd3fc;
        font-size: 15px;
      }

      .tqc-actions-divider {
        height: 1px;
        margin: 3px 4px;
        background: rgba(148,163,184,.15);
      }

      .tqc-actions-feedback-label {
        display: flex;
        align-items: center;
        gap: 9px;
        min-height: 30px;
        padding: 3px 8px 0;
        color: #e2e8f0;
      }

      .tqc-actions-feedback {
        display: flex;
        gap: 6px;
        padding: 2px 4px 5px;
      }
      .${MENU_CLASS} .tqc-feedback-choice {
        justify-content: center;
        min-height: 34px;
        border: 1px solid rgba(148,163,184,.22);
        background: rgba(255,255,255,.035);
      }
      .${MENU_CLASS} .tqc-feedback-choice[aria-checked="true"] {
        border-color: #38bdf8;
        background: rgba(14,165,233,.18);
      }

      .${TOAST_CLASS} {
        position: fixed;
        left: 50%;
        bottom: max(22px, env(safe-area-inset-bottom));
        z-index: 2147483647;
        box-sizing: border-box;
        width: max-content;
        max-width: calc(100vw - 32px);
        padding: 11px 16px;
        border: 1px solid rgba(148,163,184,.22);
        border-radius: 12px;
        background: #111c30;
        color: #f8fafc;
        box-shadow: 0 10px 32px rgba(0,0,0,.28);
        font: 13px/1.4 system-ui,sans-serif;
        text-align: center;
        transform: translate(-50%, 10px);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease, transform .2s ease;
      }
      .${TOAST_CLASS}.tqc-toast-visible {
        transform: translate(-50%, 0);
        opacity: 1;
      }

      @media (pointer: coarse) {
        .${MENU_CLASS} button { min-height: 38px; }
        .${MENU_CLASS} .tqc-feedback-choice { min-height: 36px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .${MENU_CLASS},
        .${TRIGGER_CLASS},
        .${TOAST_CLASS} {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function showToast(message) {
    var toast = document.querySelector("." + TOAST_CLASS);

    if (!toast) {
      toast = document.createElement("div");
      toast.className = TOAST_CLASS;
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    // Force a style flush so the transition runs even for new toasts.
    void toast.offsetWidth;
    toast.classList.add("tqc-toast-visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("tqc-toast-visible");
    }, 3200);
  }

  function isOurNode(node) {
    if (!node) return false;
    var el = node.nodeType === 1 ? node : node.parentElement;
    if (!el) return false;
    if (el.id === STYLE_ID) return true;
    return !!(el.closest && el.closest(
      "." + HOST_CLASS + ", ." + MENU_CLASS + ", ." + TOAST_CLASS
    ));
  }

  function isAdNode(node) {
    if (!node) return false;
    var el = node.nodeType === 1 ? node : node.parentElement;
    if (!el || !el.closest) return false;
    try {
      return !!el.closest(AD_ANCESTOR_SELECTOR);
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------------ *
   * Result detection and extraction
   * ------------------------------------------------------------------ */
  function findResultCards() {
    var found = new Set();

    RESULT_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (card) {
        if (!(card instanceof HTMLElement)) return;
        if (card.closest("." + MENU_CLASS)) return;
        if (card.dataset.tqcActionsIgnore === "true") return;
        if (!card.isConnected) return;
        if (isAdNode(card)) return;

        var style = getComputedStyle(card);
        var rect = card.getBoundingClientRect();

        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          rect.width < 80 ||
          rect.height < 25
        ) return;

        var text = (card.innerText || "").replace(/⋮/g, "").trim();
        if (text.length < 3) return;

        found.add(card);
      });
    });

    var list = Array.from(found);

    // Avoid attaching duplicate buttons to nested result elements.
    return list.filter(function (card) {
      return !list.some(function (other) {
        return other !== card && other.contains(card);
      });
    });
  }

  function getResultText(card) {
    var clone = card.cloneNode(true);

    clone.querySelectorAll(
      "." + HOST_CLASS + ", ." + MENU_CLASS + ", button, script, style"
    ).forEach(function (node) {
      node.remove();
    });

    return (clone.innerText || clone.textContent || "")
      .replace(/\n{3,}/g, "\n\n")
      .trim() || "No result text was detected.";
  }

  /* ------------------------------------------------------------------ *
   * Safe-corner detection for the trigger
   * ------------------------------------------------------------------ */
  function boxIntersects(box, r) {
    return (
      r.width > 0 &&
      r.height > 0 &&
      r.left < box.right &&
      r.right > box.left &&
      r.top < box.bottom &&
      r.bottom > box.top
    );
  }

  function countObstructions(card, box) {
    var count = 0;

    // Visible text (headings, values, labels).
    var walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (isOurNode(parent)) return NodeFilter.FILTER_REJECT;
        var tag = parent.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var range = document.createRange();
    var node;
    var guard = 0;

    while ((node = walker.nextNode()) && guard < 400) {
      guard += 1;
      range.selectNodeContents(node);
      var rects = range.getClientRects();
      for (var i = 0; i < rects.length; i += 1) {
        if (boxIntersects(box, rects[i])) {
          count += 1;
          break;
        }
      }
    }

    // Existing controls and media.
    card.querySelectorAll(
      "input, select, textarea, button, a[href], canvas, svg, img, [role='button']"
    ).forEach(function (el) {
      if (isOurNode(el)) return;
      if (boxIntersects(box, el.getBoundingClientRect())) count += 1;
    });

    return count;
  }

  function pickCorner(card) {
    var rect = card.getBoundingClientRect();
    var pad = 4;
    var s = TRIGGER_SIZE;
    var i = TRIGGER_INSET;

    var corners = [
      { id: "tl", left: rect.left + i, top: rect.top + i },
      { id: "tr", left: rect.right - i - s, top: rect.top + i },
      { id: "bl", left: rect.left + i, top: rect.bottom - i - s },
      { id: "br", left: rect.right - i - s, top: rect.bottom - i - s }
    ];

    var best = null;

    for (var k = 0; k < corners.length; k += 1) {
      var c = corners[k];
      var box = {
        left: c.left - pad,
        top: c.top - pad,
        right: c.left + s + pad,
        bottom: c.top + s + pad
      };
      var score = countObstructions(card, box);

      if (score === 0) return c.id; // Top-left is checked first.
      if (!best || score < best.score) best = { id: c.id, score: score };
    }

    return best ? best.id : "tl";
  }

  function updateCorner(card, host) {
    var corner = pickCorner(card);
    if (host.getAttribute("data-tqc-corner") !== corner) {
      host.setAttribute("data-tqc-corner", corner);
    }
  }

  /* ------------------------------------------------------------------ *
   * Ad detection (read-only)
   *
   * Detects common AdSense elements and close-fitting wrappers. It cannot
   * guarantee detection of every third-party or cross-origin layout.
   * It never modifies, hides, resizes or reads ad contents.
   * ------------------------------------------------------------------ */
  function getVisibleAdRects() {
    var elements = new Set();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;

    AD_SELECTORS.forEach(function (selector) {
      var nodes;
      try {
        nodes = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }

      nodes.forEach(function (element) {
        if (!(element instanceof HTMLElement)) return;

        var style = getComputedStyle(element);
        var rect = element.getBoundingClientRect();

        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity) === 0 ||
          rect.width < 2 ||
          rect.height < 2 ||
          rect.bottom <= 0 ||
          rect.top >= vh ||
          rect.right <= 0 ||
          rect.left >= vw
        ) return;

        elements.add(element);

        // Include the nearest wrapper(s) only when they hug the ad, so the
        // whole page layout is never treated as an ad region.
        var parent = element.parentElement;
        var hops = 0;

        while (parent && parent !== document.body && hops < 2) {
          var pr = parent.getBoundingClientRect();

          var hugs =
            pr.width >= rect.width - 1 &&
            pr.height >= rect.height - 1 &&
            pr.width <= Math.max(rect.width * 1.8, rect.width + 80) &&
            pr.height <= Math.max(rect.height * 1.8, rect.height + 80);

          if (!hugs) break;

          elements.add(parent);
          parent = parent.parentElement;
          hops += 1;
        }
      });
    });

    return Array.from(elements).map(function (element) {
      return element.getBoundingClientRect();
    });
  }

  /* ------------------------------------------------------------------ *
   * Menu lifecycle
   * ------------------------------------------------------------------ */
  function stopResizeWatch() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  }

  function startResizeWatch(card) {
    stopResizeWatch();
    if (typeof ResizeObserver !== "function") return;

    resizeObserver = new ResizeObserver(function () {
      scheduleReposition();
    });

    resizeObserver.observe(document.documentElement);
    if (card && card.isConnected) resizeObserver.observe(card);
  }

  function closeMenu() {
    cancelAnimationFrame(repositionFrame);
    stopResizeWatch();

    if (activeMenu) activeMenu.remove();

    if (activeTrigger) {
      activeTrigger.setAttribute("aria-expanded", "false");
    }

    activeMenu = null;
    activeTrigger = null;
    activeCard = null;
  }

  /* ------------------------------------------------------------------ *
   * Smart positioning
   *
   * 1. Prefer below the trigger, then above.
   * 2. If the full menu does not fit, use the available space; the menu
   *    scrolls internally (max-height + overflow-y: auto).
   * 3. Try several horizontal offsets, including ones that step around
   *    detected ads.
   * 4. Never place the menu over a detected ad. If no safe placement
   *    exists, close and show a clear message.
   * ------------------------------------------------------------------ */
  function positionMenu(menu, trigger) {
    var GAP = 8;
    var MARGIN = 12;
    var MIN_USABLE = 88;
    var CAP = 420;

    if (!trigger.isConnected || !menu.isConnected) {
      closeMenu();
      return false;
    }

    var t = trigger.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;

    // Trigger scrolled completely out of view: close quietly.
    if (t.bottom < 0 || t.top > vh || t.right < 0 || t.left > vw) {
      closeMenu();
      return false;
    }

    var prevScroll = menu.scrollTop;
    var width = Math.max(160, Math.min(258, vw - MARGIN * 2));

    menu.style.width = width + "px";
    menu.style.maxHeight = "none";
    menu.style.left = "0px";
    menu.style.top = "0px";

    var naturalHeight = menu.getBoundingClientRect().height;
    var wanted = Math.min(naturalHeight, CAP, vh - MARGIN * 2);

    function clampLeft(x) {
      return Math.round(Math.max(MARGIN, Math.min(x, vw - width - MARGIN)));
    }

    var ads = getVisibleAdRects();

    var leftOptions = [
      t.left,
      t.right - width,
      MARGIN,
      vw - width - MARGIN
    ];

    ads.forEach(function (ad) {
      leftOptions.push(ad.right + GAP, ad.left - GAP - width);
    });

    var seen = {};
    var lefts = [];

    leftOptions.forEach(function (x) {
      var v = clampLeft(x);
      if (!seen[v]) {
        seen[v] = true;
        lefts.push(v);
      }
    });

    var candidates = [];

    lefts.forEach(function (left, li) {
      ["down", "up"].forEach(function (dir) {
        var colL = left;
        var colR = left + width;
        var anchor; // Edge nearest the trigger.
        var height;

        if (dir === "down") {
          anchor = t.bottom + GAP;
          height = Math.min(wanted, vh - MARGIN - anchor);
        } else {
          anchor = t.top - GAP;
          height = Math.min(wanted, anchor - MARGIN);
        }

        if (height < MIN_USABLE) return;

        var blocked = false;

        ads.forEach(function (ad) {
          var overlapsColumn =
            ad.left < colR + GAP && ad.right > colL - GAP;
          if (!overlapsColumn) return;

          if (dir === "down") {
            if (ad.top - GAP < anchor && ad.bottom + GAP > anchor) {
              blocked = true; // Menu would start inside an ad zone.
            } else if (ad.top - GAP >= anchor) {
              height = Math.min(height, ad.top - GAP - anchor);
            }
          } else {
            if (ad.top - GAP < anchor && ad.bottom + GAP > anchor) {
              blocked = true;
            } else if (ad.bottom + GAP <= anchor) {
              height = Math.min(height, anchor - (ad.bottom + GAP));
            }
          }
        });

        if (blocked || height < MIN_USABLE) return;

        candidates.push({
          dir: dir,
          left: left,
          top: dir === "down" ? anchor : anchor - height,
          height: height,
          full: height >= wanted - 0.5,
          li: li
        });
      });
    });

    if (!candidates.length) {
      closeMenu();
      showToast(
        "No ad-free space for the menu here. Scroll a little and try again."
      );
      return false;
    }

    candidates.sort(function (a, b) {
      if (a.full !== b.full) return a.full ? -1 : 1;

      if (!a.full) {
        var diff = b.height - a.height;
        if (Math.abs(diff) > 1) return diff;
      }

      if (a.dir !== b.dir) return a.dir === "down" ? -1 : 1;
      return a.li - b.li;
    });

    var best = candidates[0];

    menu.style.left = best.left + "px";
    menu.style.top = best.top + "px";
    menu.style.width = width + "px";
    menu.style.maxHeight = Math.floor(best.height) + "px";
    menu.style.overflowY = "auto";
    menu.style.visibility = "visible";

    menu.classList.remove("tqc-opening-up", "tqc-opening-down");
    menu.classList.add(
      best.dir === "up" ? "tqc-opening-up" : "tqc-opening-down"
    );

    menu.scrollTop = prevScroll;

    if (!menu.classList.contains("tqc-visible")) {
      requestAnimationFrame(function () {
        if (menu.isConnected) menu.classList.add("tqc-visible");
      });
    }

    return true;
  }

  function scheduleReposition() {
    if (!activeMenu || !activeTrigger) return;

    cancelAnimationFrame(repositionFrame);

    repositionFrame = requestAnimationFrame(function () {
      if (!activeMenu || !activeTrigger) return;
      positionMenu(activeMenu, activeTrigger);
    });
  }

  /* ------------------------------------------------------------------ *
   * Menu construction
   * ------------------------------------------------------------------ */
  function makeActionButton(action) {
    var button = document.createElement("button");
    button.type = "button";
    button.dataset.tqcAction = action.id;
    button.setAttribute("role", "menuitem");

    button.innerHTML =
      '<span class="tqc-actions-icon" aria-hidden="true">' +
      escapeHTML(action.icon) +
      "</span><span>" +
      escapeHTML(action.label) +
      "</span>";

    return button;
  }

  function buildFeedback(menu, card, action) {
    var group = document.createElement("div");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", action.label);

    var label = document.createElement("div");
    label.className = "tqc-actions-feedback-label";
    label.innerHTML =
      '<span class="tqc-actions-icon" aria-hidden="true">' +
      escapeHTML(action.icon) +
      "</span><span>" +
      escapeHTML(action.label) +
      "</span>";
    group.appendChild(label);

    var choices = document.createElement("div");
    choices.className = "tqc-actions-feedback";
    choices.setAttribute("role", "none");

    [
      { value: "yes", label: "👍 Yes" },
      { value: "no", label: "👎 No" }
    ].forEach(function (choice) {
      var choiceButton = document.createElement("button");
      choiceButton.type = "button";
      choiceButton.className = "tqc-feedback-choice";
      choiceButton.textContent = choice.label;
      choiceButton.setAttribute("role", "menuitemradio");
      choiceButton.setAttribute("aria-checked", "false");

      choiceButton.addEventListener("click", function (event) {
        event.stopPropagation();

        document.dispatchEvent(new CustomEvent("tqc:feedback", {
          detail: {
            answer: choice.value,
            result: getResultText(card),
            page: location.href
          }
        }));

        choices.querySelectorAll("button").forEach(function (item) {
          item.setAttribute("aria-checked", "false");
        });

        choiceButton.setAttribute("aria-checked", "true");
        showToast("Thanks for your feedback!");
      });

      choices.appendChild(choiceButton);
    });

    group.appendChild(choices);
    menu.appendChild(group);
  }

  function addDivider(menu) {
    var divider = document.createElement("div");
    divider.className = "tqc-actions-divider";
    divider.setAttribute("role", "separator");
    menu.appendChild(divider);
  }

  function openMenu(card, trigger, viaKeyboard) {
    if (activeTrigger === trigger && activeMenu) {
      closeMenu();
      return;
    }

    closeMenu();

    var menu = document.createElement("div");
    menu.className = MENU_CLASS;
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "Calculator result actions");

    var heading = document.createElement("div");
    heading.className = "tqc-actions-heading";
    heading.setAttribute("role", "presentation");
    heading.textContent = "Result actions";
    menu.appendChild(heading);

    ACTIONS.forEach(function (action) {
      if (["feedback", "embed", "report"].indexOf(action.id) !== -1) {
        addDivider(menu);
      }

      if (action.id === "feedback") {
        buildFeedback(menu, card, action);
        return;
      }

      var button = makeActionButton(action);

      button.addEventListener("click", function () {
        handleAction(action.id, card);
      });

      menu.appendChild(button);
    });

    menu.addEventListener("keydown", function (event) {
      var keys = ["ArrowDown", "ArrowUp", "Home", "End"];
      if (keys.indexOf(event.key) === -1) return;

      var items = Array.from(menu.querySelectorAll("button"));
      if (!items.length) return;

      var index = items.indexOf(document.activeElement);
      var next = index;

      if (event.key === "ArrowDown") next = (index + 1) % items.length;
      if (event.key === "ArrowUp") {
        next = index <= 0 ? items.length - 1 : index - 1;
      }
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = items.length - 1;

      event.preventDefault();
      items[next].focus();
    });

    document.body.appendChild(menu);

    activeMenu = menu;
    activeTrigger = trigger;
    activeCard = card;
    trigger.setAttribute("aria-expanded", "true");

    if (!positionMenu(menu, trigger)) return;

    startResizeWatch(card);

    if (viaKeyboard) {
      var first = menu.querySelector("button");
      if (first) first.focus();
    }
  }

  /* ------------------------------------------------------------------ *
   * Copy, download, print
   * ------------------------------------------------------------------ */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);
    textarea.select();

    var success = document.execCommand("copy");
    textarea.remove();

    if (!success) throw new Error("Copy was denied by the browser.");
  }

  function downloadText(text, filename) {
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1500);
  }

  function printResult(text) {
    var printWindow = window.open("", "_blank", "width=760,height=700");

    if (!printWindow) {
      showToast("Allow popups in your browser to print.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(
      "<!doctype html><html><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
      "<title>TheQuantCal — Calculator Result</title>" +
      "<style>body{font:16px/1.6 system-ui,sans-serif;" +
      "max-width:760px;margin:40px auto;padding:0 22px;color:#172033}" +
      "h1{font-size:24px}pre{white-space:pre-wrap;" +
      "overflow-wrap:anywhere;font:inherit}" +
      "footer{margin-top:28px;color:#64748b;font-size:12px}" +
      "@media print{body{margin:0}}</style></head><body>" +
      "<h1>TheQuantCal — Calculator Result</h1><pre>" +
      escapeHTML(text) +
      "</pre><footer>Source: " +
      escapeHTML(location.href) +
      "</footer><script>window.onload=function(){window.print();};<\/script>" +
      "</body></html>"
    );

    printWindow.document.close();
  }

  function getEmbedCode() {
    var url = new URL(location.href);
    url.hash = "";

    return '<iframe src="' + url.href +
      '" title="TheQuantCal calculator" width="100%" height="600" ' +
      'loading="lazy" style="border:0;border-radius:16px;"></iframe>';
  }

  /* ------------------------------------------------------------------ *
   * Action handlers
   * ------------------------------------------------------------------ */
  async function handleAction(action, card) {
    var result = getResultText(card);
    var pageTitle = document.title || "TheQuantCal Calculator";

    var filename = pageTitle
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "thequantcal-result";

    try {
      switch (action) {
        case "download":
          downloadText(
            pageTitle + "\n" + location.href + "\n\n" + result,
            filename + ".txt"
          );
          showToast("Result downloaded.");
          break;

        case "print":
          printResult(result);
          break;

        case "copy":
          await copyText(result);
          showToast("Result copied.");
          break;

        case "embed":
          await copyText(getEmbedCode());
          showToast("Embed code copied.");
          break;

        case "share": {
          var shareData = {
            title: pageTitle,
            text: result,
            url: location.href
          };

          if (navigator.share) {
            try {
              await navigator.share(shareData);
            } catch (error) {
              if (!error || error.name !== "AbortError") throw error;
            }
          } else {
            await copyText(
              pageTitle + "\n\n" + result + "\n\n" + location.href
            );
            showToast("Share unavailable. Result and link copied.");
          }
          break;
        }

        case "report": {
          var reportText =
            "TheQuantCal issue report\n" +
            "Page: " + location.href + "\n" +
            "Calculator: " + pageTitle + "\n\n" +
            "Describe the issue here:\n";

          // Configure your real support email to enable email reporting.
          var reportEmail = "";

          if (reportEmail) {
            var subject = encodeURIComponent(
              "TheQuantCal issue: " + pageTitle
            );

            location.href =
              "mailto:" + reportEmail +
              "?subject=" + subject +
              "&body=" + encodeURIComponent(reportText);
          } else {
            await copyText(reportText);
            showToast(
              "Report template copied. Configure a support email to enable email reporting."
            );
          }
          break;
        }
      }
    } catch (error) {
      console.error("[TheQuantCal Actions]", error);
      showToast("Could not complete this action. Check browser permissions.");
    }

    closeMenu();
  }

  /* ------------------------------------------------------------------ *
   * Attach a trigger to each detected result card (idempotent)
   * ------------------------------------------------------------------ */
  function attachToCard(card) {
    var existing = hostByCard.get(card);

    if (existing && existing.isConnected && existing.parentElement === card) {
      updateCorner(card, existing);
      return;
    }

    // Defensive: remove any orphaned host left by a re-render.
    card.querySelectorAll(":scope > ." + HOST_CLASS).forEach(function (old) {
      old.remove();
    });

    if (getComputedStyle(card).position === "static") {
      card.style.position = "relative";
    }

    var host = document.createElement("div");
    host.className = HOST_CLASS;

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = TRIGGER_CLASS;
    trigger.textContent = "⋮";
    trigger.title = "Result actions";
    trigger.setAttribute("aria-label", "Open result actions");
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      // event.detail === 0 means the click came from the keyboard.
      openMenu(card, trigger, event.detail === 0);
    });

    host.appendChild(trigger);
    card.appendChild(host);
    hostByCard.set(card, host);

    updateCorner(card, host);
  }

  function scan() {
    addStyles();
    findResultCards().forEach(attachToCard);
    if (activeMenu) scheduleReposition();
  }

  function scheduleScan() {
    if (scanTimer) return;

    scanTimer = setTimeout(function () {
      scanTimer = 0;
      scan();
    }, 200);
  }

  /* ------------------------------------------------------------------ *
   * Global listeners
   * ------------------------------------------------------------------ */
  document.addEventListener("click", function (event) {
    if (!activeMenu) return;

    if (
      activeMenu.contains(event.target) ||
      (activeTrigger && activeTrigger.contains(event.target))
    ) return;

    closeMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && activeMenu) {
      var trigger = activeTrigger;
      closeMenu();

      if (trigger && trigger.isConnected) trigger.focus();
    }
  });

  window.addEventListener("resize", function () {
    scheduleReposition();
    scheduleScan();
  }, { passive: true });

  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      scheduleReposition();
      scheduleScan();
    }, 250);
  }, { passive: true });

  window.addEventListener("scroll", function (event) {
    // Ignore scrolling inside the menu itself.
    if (activeMenu && event.target && activeMenu.contains(event.target)) return;
    scheduleReposition();
  }, { passive: true, capture: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleReposition, {
      passive: true
    });
    window.visualViewport.addEventListener("scroll", scheduleReposition, {
      passive: true
    });
  }

  window.addEventListener("load", scheduleScan);
  window.addEventListener("pageshow", scheduleScan);

  /* ------------------------------------------------------------------ *
   * Initialize and watch dynamically rendered calculators.
   *
   * The observer ignores changes made by this script and by ad code, and
   * scans are debounced, so it cannot loop on its own DOM changes.
   * ------------------------------------------------------------------ */
  function start() {
    scan();

    var observer = new MutationObserver(function (records) {
      var relevant = records.some(function (record) {
        if (isOurNode(record.target) || isAdNode(record.target)) return false;

        if (record.type === "childList") {
          var nodes = Array.from(record.addedNodes)
            .concat(Array.from(record.removedNodes));

          if (
            nodes.length &&
            nodes.every(function (n) {
              return isOurNode(n) || isAdNode(n);
            })
          ) return false;
        }

        return true;
      });

      if (relevant) scheduleScan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden"]
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
