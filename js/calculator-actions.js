
/**
 * TheQuantCal — Global Calculator Actions
 * File: /js/calculator-actions.js
 *
 * Features:
 * 1. Download result
 * 2. Print result
 * 3. Copy result
 * 4. Helpful Yes/No feedback
 * 5. Embed code
 * 6. Share result
 * 7. Report an issue
 *
 * Includes:
 * - Premium dark-glass popup
 * - Responsive positioning and vertical flipping
 * - Ad-container collision checks
 * - Keyboard and outside-click handling
 * - Dynamic calculator result detection
 *
 * No external libraries required.
 */
(function () {
  "use strict";

  if (window.__TQC_CALCULATOR_ACTIONS__) return;
  window.__TQC_CALCULATOR_ACTIONS__ = true;

  const STYLE_ID = "tqc-actions-styles";
  const HOST_CLASS = "tqc-actions-host";
  const TRIGGER_CLASS = "tqc-actions-trigger";
  const MENU_CLASS = "tqc-actions-menu";

  let activeMenu = null;
  let activeTrigger = null;
  let activeCard = null;
  let toastTimer = null;
  let repositionFrame = 0;

  const RESULT_SELECTORS = [
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

  const VALUE_SELECTORS = [
    "[data-result-value]",
    ".result-value",
    ".result-number",
    ".final-result",
    ".percentage-value",
    "output"
  ];

  const ACTIONS = [
    { id: "download", icon: "↓", label: "Download result" },
    { id: "print", icon: "▤", label: "Print result" },
    { id: "copy", icon: "▣", label: "Copy result" },
    { id: "feedback", icon: "♡", label: "Was this helpful?" },
    { id: "embed", icon: "⌘", label: "Embed calculator" },
    { id: "share", icon: "↗", label: "Share result" },
    { id: "report", icon: "⚑", label: "Report an issue" }
  ];

  /*
   * CSS
   */
  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      .${HOST_CLASS} {
        position: absolute !important;
        top: 10px !important;
        right: 10px !important;
        z-index: 30 !important;
        line-height: 1 !important;
      }

      .${TRIGGER_CLASS} {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px !important;
        min-height: 36px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 1px solid rgba(148,163,184,.25) !important;
        border-radius: 12px !important;
        background: rgba(15,23,42,.92) !important;
        color: #f8fafc !important;
        box-shadow: 0 5px 18px rgba(0,0,0,.16) !important;
        font: 700 22px/1 system-ui,sans-serif !important;
        cursor: pointer !important;
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
        outline-offset: 3px !important;
      }

      .${MENU_CLASS} {
        position: fixed;
        z-index: 2147483000;
        box-sizing: border-box;
        width: min(258px, calc(100vw - 24px));
        padding: 8px;
        border: 1px solid rgba(148,163,184,.25);
        border-radius: 17px;
        color: #f8fafc;
        background: rgba(12,19,34,.97);
        box-shadow: 0 18px 50px rgba(0,0,0,.32),
                    inset 0 1px 0 rgba(255,255,255,.055);
        backdrop-filter: blur(24px) saturate(150%);
        -webkit-backdrop-filter: blur(24px) saturate(150%);
        opacity: 0;
        transform: translateY(5px) scale(.985);
        transition: opacity .15s ease, transform .15s ease;
        font: 14px/1.4 system-ui,-apple-system,BlinkMacSystemFont,
              "Segoe UI",sans-serif;
      }

      .${MENU_CLASS}.tqc-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .${MENU_CLASS}.tqc-opening-up {
        transform-origin: bottom right;
      }

      .${MENU_CLASS}.tqc-opening-down {
        transform-origin: top right;
      }

      .tqc-actions-heading {
        padding: 8px 10px 10px;
        color: #94a3b8;
        font-size: 11px;
        font-weight: 750;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .${MENU_CLASS} button {
        display: flex;
        align-items: center;
        gap: 11px;
        box-sizing: border-box;
        width: 100%;
        min-height: 42px;
        margin: 0;
        padding: 9px 10px;
        border: 0;
        border-radius: 10px;
        background: transparent;
        color: #e2e8f0;
        text-align: left;
        font: inherit;
        cursor: pointer;
        transition: background .15s ease, color .15s ease;
      }

      .${MENU_CLASS} button:hover {
        background: rgba(59,130,246,.17);
        color: #fff;
      }

      .tqc-actions-icon {
        display: inline-flex;
        flex: 0 0 25px;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        border-radius: 8px;
        background: rgba(59,130,246,.14);
        color: #7dd3fc;
        font-size: 17px;
      }

      .tqc-actions-divider {
        height: 1px;
        margin: 5px 4px;
        background: rgba(148,163,184,.15);
      }

      .tqc-actions-feedback {
        display: flex;
        gap: 8px;
        padding: 4px 6px 7px;
      }

      .${MENU_CLASS} .tqc-feedback-choice {
        justify-content: center;
        min-height: 35px;
        border: 1px solid rgba(148,163,184,.22);
        background: rgba(255,255,255,.035);
      }

      .${MENU_CLASS} .tqc-feedback-choice[aria-pressed="true"] {
        border-color: #38bdf8;
        background: rgba(14,165,233,.18);
      }

      .tqc-actions-toast {
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

      .tqc-actions-toast.tqc-toast-visible {
        transform: translate(-50%, 0);
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        .${MENU_CLASS},
        .${TRIGGER_CLASS},
        .tqc-actions-toast {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /*
   * Safe text helpers
   */
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
    let toast = document.querySelector(".tqc-actions-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "tqc-actions-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("tqc-toast-visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("tqc-toast-visible");
    }, 2800);
  }

  /*
   * Result detection and extraction
   */
  function findResultCards() {
    const found = new Set();

    RESULT_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (card) {
        if (!(card instanceof HTMLElement)) return;
        if (card.closest("." + MENU_CLASS)) return;
        if (card.dataset.tqcActionsIgnore === "true") return;
        if (!card.isConnected) return;

        const style = getComputedStyle(card);
        const rect = card.getBoundingClientRect();

        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          rect.width < 80 ||
          rect.height < 25
        ) return;

        const text = (card.innerText || "").trim();
        if (text.length < 3) return;

        found.add(card);
      });
    });

    // Avoid attaching duplicate buttons to nested result elements.
    return Array.from(found).filter(function (card) {
      return !Array.from(found).some(function (other) {
        return other !== card && other.contains(card);
      });
    });
  }

  function getResultText(card) {
    const clone = card.cloneNode(true);

    clone.querySelectorAll(
      "." + HOST_CLASS + ", ." + MENU_CLASS +
      ", button, script, style"
    ).forEach(function (node) {
      node.remove();
    });

    return (clone.innerText || clone.textContent || "")
      .replace(/\n{3,}/g, "\n\n")
      .trim() || "No result text was detected.";
  }

  /*
   * Ad collision detection
   *
   * This detects common AdSense elements and common ad wrappers.
   * It cannot guarantee detection of every third-party or cross-origin
   * ad layout. It does not read or modify ad contents.
   */
  function getVisibleAdRects() {
    const selectors = [
      "ins.adsbygoogle",
      "iframe[id^='google_ads_iframe']",
      "iframe[src*='doubleclick.net']",
      "iframe[src*='googlesyndication.com']",
      "[data-ad-client]",
      "[data-ad-slot]",
      ".adsbygoogle",
      ".ad-container",
      ".ad-wrapper",
      ".ads-container",
      ".google-auto-placed"
    ];

    const elements = new Set();

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (element) {
        if (!(element instanceof HTMLElement)) return;

        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity) === 0 ||
          rect.width < 2 ||
          rect.height < 2 ||
          rect.bottom <= 0 ||
          rect.top >= window.innerHeight ||
          rect.right <= 0 ||
          rect.left >= window.innerWidth
        ) return;

        elements.add(element);

        /*
         * Include the parent only if its dimensions are reasonably
         * close to the ad element. This avoids treating the entire
         * page layout as an ad region.
         */
        const parent = element.parentElement;

        if (parent && parent !== document.body) {
          const parentRect = parent.getBoundingClientRect();

          const reasonablyClose =
            parentRect.width <= Math.max(rect.width * 1.8, rect.width + 80) &&
            parentRect.height <= Math.max(rect.height * 1.8, rect.height + 80) &&
            parentRect.width >= rect.width &&
            parentRect.height >= rect.height;

          if (reasonablyClose) elements.add(parent);
        }
      });
    });

    return Array.from(elements).map(function (element) {
      return element.getBoundingClientRect();
    });
  }

  function rectanglesIntersect(a, b, gap) {
    return (
      a.left < b.right + gap &&
      a.right > b.left - gap &&
      a.top < b.bottom + gap &&
      a.bottom > b.top - gap
    );
  }

  /*
   * Menu lifecycle
   */
  function closeMenu() {
    if (activeMenu) activeMenu.remove();

    if (activeTrigger) {
      activeTrigger.setAttribute("aria-expanded", "false");
    }

    activeMenu = null;
    activeTrigger = null;
    activeCard = null;
  }

  /*
   * Collision-aware positioning.
   *
   * Try below and above the trigger. Only use a position that fits
   * within the viewport and does not intersect detected ad regions.
   * If no safe position exists, refuse to display the menu.
   */
  function positionMenu(menu, trigger) {
    const GAP = 12;
    const MARGIN = 12;
    const MIN_HEIGHT = 100;

    if (!trigger.isConnected || !menu.isConnected) {
      closeMenu();
      return false;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;

    menu.style.visibility = "hidden";
    menu.style.left = "0px";
    menu.style.top = "0px";
    menu.style.maxHeight = "none";
    menu.style.width = "min(258px, calc(100vw - 24px))";

    const measured = menu.getBoundingClientRect();
    const menuWidth = Math.min(
      measured.width,
      viewportWidth - MARGIN * 2
    );
    const naturalHeight = measured.height;

    const left = Math.max(
      MARGIN,
      Math.min(
        triggerRect.right - menuWidth,
        viewportWidth - menuWidth - MARGIN
      )
    );

    const spaceBelow = viewportHeight - triggerRect.bottom - MARGIN;
    const spaceAbove = triggerRect.top - MARGIN;

    const directions = spaceBelow >= spaceAbove
      ? ["down", "up"]
      : ["up", "down"];

    const adRects = getVisibleAdRects();
    const candidates = [];

    directions.forEach(function (direction) {
      const available = direction === "down"
        ? spaceBelow
        : spaceAbove;

      const candidateHeight = Math.min(naturalHeight, available);

      if (candidateHeight < MIN_HEIGHT) return;

      const top = direction === "down"
        ? triggerRect.bottom + GAP
        : triggerRect.top - candidateHeight - GAP;

      const candidateRect = {
        left: left,
        right: left + menuWidth,
        top: top,
        bottom: top + candidateHeight
      };

      const insideViewport =
        candidateRect.left >= MARGIN &&
        candidateRect.right <= viewportWidth - MARGIN &&
        candidateRect.top >= MARGIN &&
        candidateRect.bottom <= viewportHeight - MARGIN;

      if (!insideViewport) return;

      const hitsAd = adRects.some(function (adRect) {
        return rectanglesIntersect(candidateRect, adRect, GAP);
      });

      if (!hitsAd) {
        candidates.push({
          direction: direction,
          left: left,
          top: top,
          width: menuWidth,
          height: candidateHeight
        });
      }
    });

    if (!candidates.length) {
      closeMenu();
      showToast(
        "No safe space for the menu. Scroll or close nearby content and try again."
      );
      return false;
    }

    const safe = candidates[0];

    menu.style.left = safe.left + "px";
    menu.style.top = safe.top + "px";
    menu.style.width = safe.width + "px";
    menu.style.maxHeight = safe.height + "px";
    menu.style.overflowY = "auto";
    menu.style.visibility = "visible";

    menu.classList.remove("tqc-opening-up", "tqc-opening-down");
    menu.classList.add(
      safe.direction === "up"
        ? "tqc-opening-up"
        : "tqc-opening-down"
    );

    requestAnimationFrame(function () {
      if (menu.isConnected) {
        menu.classList.add("tqc-visible");
      }
    });

    return true;
  }

  function makeActionButton(action) {
    const button = document.createElement("button");
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

  function openMenu(card, trigger) {
    if (activeTrigger === trigger && activeMenu) {
      closeMenu();
      return;
    }

    closeMenu();

    const menu = document.createElement("div");
    menu.className = MENU_CLASS;
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "Calculator result actions");

    const heading = document.createElement("div");
    heading.className = "tqc-actions-heading";
    heading.textContent = "Result actions";
    menu.appendChild(heading);

    ACTIONS.forEach(function (action) {
      if (["feedback", "embed", "report"].includes(action.id)) {
        const divider = document.createElement("div");
        divider.className = "tqc-actions-divider";
        divider.setAttribute("aria-hidden", "true");
        menu.appendChild(divider);
      }

      const button = makeActionButton(action);

      button.addEventListener("click", function () {
        handleAction(action.id, card);
      });

      menu.appendChild(button);

      if (action.id === "feedback") {
        const choices = document.createElement("div");
        choices.className = "tqc-actions-feedback";

        [
          { value: "yes", label: "👍 Yes" },
          { value: "no", label: "👎 No" }
        ].forEach(function (choice) {
          const choiceButton = document.createElement("button");
          choiceButton.type = "button";
          choiceButton.className = "tqc-feedback-choice";
          choiceButton.textContent = choice.label;
          choiceButton.setAttribute("aria-pressed", "false");

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
              item.setAttribute("aria-pressed", "false");
            });

            choiceButton.setAttribute("aria-pressed", "true");
            showToast("Thanks for your feedback!");
          });

          choices.appendChild(choiceButton);
        });

        menu.appendChild(choices);
      }
    });

    document.body.appendChild(menu);

    activeMenu = menu;
    activeTrigger = trigger;
    activeCard = card;
    trigger.setAttribute("aria-expanded", "true");

    if (!positionMenu(menu, trigger)) return;
  }

  /*
   * Copy, download and print
   */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand("copy");
    textarea.remove();

    if (!success) throw new Error("Copy was denied by the browser.");
  }

  function downloadText(text, filename) {
    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

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
    const printWindow = window.open(
      "",
      "_blank",
      "width=760,height=700"
    );

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
    const url = new URL(location.href);
    url.hash = "";

    return '<iframe src="' + url.href +
      '" title="TheQuantCal calculator" width="100%" height="600" ' +
      'loading="lazy" style="border:0;border-radius:16px;"></iframe>';
  }

  /*
   * Action handlers
   */
  async function handleAction(action, card) {
    const result = getResultText(card);
    const pageTitle = document.title || "TheQuantCal Calculator";

    const filename = pageTitle
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

        case "feedback":
          showToast("Choose Yes or No below this option.");
          return;

        case "embed":
          await copyText(getEmbedCode());
          showToast("Embed code copied.");
          break;

        case "share": {
          const shareData = {
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
          const reportText =
            "TheQuantCal issue report\n" +
            "Page: " + location.href + "\n" +
            "Calculator: " + pageTitle + "\n\n" +
            "Describe the issue here:\n";

          // Configure your real support email to enable email reporting.
          const reportEmail = "";

          if (reportEmail) {
            const subject = encodeURIComponent(
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

    if (action !== "feedback") closeMenu();
  }

  /*
   * Attach a trigger to each detected result card.
   */
  function attachToCard(card) {
    if (card.dataset.tqcActionsAttached === "true") return;

    // Preserve existing positioning if the card already uses it.
    if (getComputedStyle(card).position === "static") {
      card.style.position = "relative";
    }

    const host = document.createElement("div");
    host.className = HOST_CLASS;

    const trigger = document.createElement("button");
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
      openMenu(card, trigger);
    });

    host.appendChild(trigger);
    card.appendChild(host);
    card.dataset.tqcActionsAttached = "true";
  }

  function scan() {
    addStyles();
    findResultCards().forEach(attachToCard);
  }

  /*
   * Close on outside click or Escape.
   */
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
      const trigger = activeTrigger;
      closeMenu();

      if (trigger && trigger.isConnected) trigger.focus();
    }
  });

  /*
   * Re-check placement if the screen moves or changes size.
   * Close the menu if its new position would intersect an ad.
   */
  function scheduleReposition() {
    if (!activeMenu || !activeTrigger) return;

    cancelAnimationFrame(repositionFrame);

    repositionFrame = requestAnimationFrame(function () {
      if (!activeMenu || !activeTrigger) return;

      const menu = activeMenu;
      const trigger = activeTrigger;

      if (!positionMenu(menu, trigger)) {
        closeMenu();
      }
    });
  }

  window.addEventListener("resize", scheduleReposition, {
    passive: true
  });

  window.addEventListener("scroll", scheduleReposition, {
    passive: true,
    capture: true
  });

  /*
   * Initialize and watch dynamically rendered calculators.
   */
  function start() {
    scan();

    const observer = new MutationObserver(function () {
      scan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }
})();
