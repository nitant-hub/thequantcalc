
/**
 * TheQuantCal — Global Calculator Actions
 * File: /js/calculator-actions.js
 *
 * Features:
 * - Download, Print, Copy result
 * - Helpful Yes/No feedback
 * - Embed code generator
 * - Native Share API with clipboard fallback
 * - Report issue helper
 * - Responsive dark-glass dropdown with smart positioning
 *
 * No external libraries required.
 */
(function () {
  "use strict";

  if (window.__TQC_CALCULATOR_ACTIONS__) return;
  window.__TQC_CALCULATOR_ACTIONS__ = true;

  const STYLE_ID = "tqc-actions-styles";
  const MENU_CLASS = "tqc-actions-menu";
  const BUTTON_CLASS = "tqc-actions-trigger";

  const RESULT_SELECTORS = [
    ".results-dashboard",
    "[data-calculator-result]",
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

  let activeMenu = null;
  let activeTrigger = null;
  let toastTimer = null;

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .tqc-actions-host {
        position: absolute !important;
        top: 10px !important;
        right: 10px !important;
        z-index: 30 !important;
      }

      .tqc-actions-trigger {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 36px !important;
        height: 36px !important;
        padding: 0 !important;
        border: 1px solid rgba(148,163,184,.22) !important;
        border-radius: 12px !important;
        background: rgba(15,23,42,.78) !important;
        color: #f8fafc !important;
        box-shadow: 0 5px 18px rgba(0,0,0,.14) !important;
        cursor: pointer !important;
        font: 700 22px/1 system-ui,sans-serif !important;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        transition: background .18s ease, transform .18s ease;
      }

      .tqc-actions-trigger:hover {
        background: rgba(37,99,235,.9) !important;
        transform: translateY(-1px);
      }

      .tqc-actions-trigger:focus-visible,
      .tqc-actions-menu button:focus-visible {
        outline: 2px solid #38bdf8 !important;
        outline-offset: 3px !important;
      }

      .tqc-actions-menu {
        position: fixed;
        z-index: 2147483000;
        width: min(258px, calc(100vw - 24px));
        padding: 8px;
        border: 1px solid rgba(148,163,184,.23);
        border-radius: 17px;
        color: #f8fafc;
        background: rgba(12,19,34,.94);
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

      .tqc-actions-menu.tqc-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .tqc-actions-menu.tqc-opening-up {
        transform-origin: bottom right;
      }

      .tqc-actions-menu.tqc-opening-down {
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

      .tqc-actions-menu button {
        display: flex;
        align-items: center;
        gap: 11px;
        width: 100%;
        min-height: 42px;
        padding: 10px;
        border: 0;
        border-radius: 10px;
        background: transparent;
        color: #e2e8f0;
        text-align: left;
        font: inherit;
        cursor: pointer;
        transition: background .15s ease, color .15s ease;
      }

      .tqc-actions-menu button:hover {
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
        background: rgba(59,130,246,.13);
        color: #7dd3fc;
        font-size: 17px;
      }

      .tqc-actions-divider {
        height: 1px;
        margin: 5px 4px;
        background: rgba(148,163,184,.15);
      }

      .tqc-actions-toast {
        position: fixed;
        left: 50%;
        bottom: max(22px, env(safe-area-inset-bottom));
        z-index: 2147483647;
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
        transition: opacity .2s ease, transform .2s ease;
      }

      .tqc-actions-toast.tqc-toast-visible {
        transform: translate(-50%, 0);
        opacity: 1;
      }

      .tqc-actions-feedback {
        display: flex;
        gap: 8px;
        padding: 4px 6px 7px;
      }

      .tqc-actions-menu .tqc-feedback-choice {
        justify-content: center;
        min-height: 35px;
        border: 1px solid rgba(148,163,184,.2);
        background: rgba(255,255,255,.035);
      }

      .tqc-actions-menu .tqc-feedback-choice[aria-pressed="true"] {
        border-color: #38bdf8;
        background: rgba(14,165,233,.18);
      }

      .tqc-actions-subtitle {
        padding: 0 10px 7px;
        color: #94a3b8;
        font-size: 12px;
      }

      @media (prefers-reduced-motion: reduce) {
        .tqc-actions-menu,
        .tqc-actions-trigger,
        .tqc-actions-toast {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
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
    }, 2600);
  }

  function getResultText(card) {
    const clone = card.cloneNode(true);

    clone.querySelectorAll(
      ".tqc-actions-host, .tqc-actions-menu, button, script, style"
    ).forEach(function (node) {
      node.remove();
    });

    const text = (clone.innerText || clone.textContent || "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return text || "No result text was detected.";
  }

  function getResultValue(card) {
    for (const selector of VALUE_SELECTORS) {
      const element = card.querySelector(selector);
      if (element) {
        const value = (
          element.value ||
          element.innerText ||
          element.textContent ||
          ""
        ).trim();

        if (value) return value;
      }
    }

    return getResultText(card);
  }

  function findResultCards() {
    const found = new Set();

    RESULT_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (card) {
        if (!(card instanceof HTMLElement)) return;
        if (card.closest(".tqc-actions-menu")) return;
        if (card.dataset.tqcActionsIgnore === "true") return;
        if (!card.isConnected) return;

        const text = (card.innerText || "").trim();
        if (!text || text.length < 3) return;

        found.add(card);
      });
    });

    // Remove nested result matches when a larger result panel contains them.
    return Array.from(found).filter(function (card) {
      return !Array.from(found).some(function (other) {
        return other !== card && other.contains(card);
      });
    });
  }

  function makeButton(action) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.tqcAction = action.id;
    button.innerHTML =
      '<span class="tqc-actions-icon" aria-hidden="true">' +
      escapeHTML(action.icon) +
      "</span><span>" +
      escapeHTML(action.label) +
      "</span>";

    return button;
  }

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

  function closeMenu() {
    if (activeMenu) activeMenu.remove();
    if (activeTrigger) {
      activeTrigger.setAttribute("aria-expanded", "false");
    }

    activeMenu = null;
    activeTrigger = null;
  }

  function positionMenu(menu, trigger) {
    const gap = 8;
    const margin = 12;
    const rect = trigger.getBoundingClientRect();

    // Temporarily measure the menu while invisible.
    menu.style.visibility = "hidden";
    menu.style.left = "0px";
    menu.style.top = "0px";
    menu.classList.remove("tqc-visible");
    document.body.appendChild(menu);

    const menuRect = menu.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;
    const openUp = spaceBelow < menuRect.height + gap &&
                   spaceAbove > spaceBelow;

    const maxHeight = Math.max(
      120,
      (openUp ? spaceAbove : spaceBelow) - gap
    );

    menu.style.maxHeight = maxHeight + "px";
    menu.style.overflowY = "auto";

    const measuredHeight = Math.min(menuRect.height, maxHeight);

    let top = openUp
      ? rect.top - measuredHeight - gap
      : rect.bottom + gap;

    let left = rect.right - menuRect.width;

    left = Math.max(
      margin,
      Math.min(left, viewportWidth - menuRect.width - margin)
    );

    top = Math.max(
      margin,
      Math.min(top, viewportHeight - measuredHeight - margin)
    );

    menu.style.left = left + "px";
    menu.style.top = top + "px";
    menu.style.visibility = "visible";
    menu.classList.add(openUp ? "tqc-opening-up" : "tqc-opening-down");

    requestAnimationFrame(function () {
      menu.classList.add("tqc-visible");
    });
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

    ACTIONS.forEach(function (action, index) {
      if (index === 3 || index === 4 || index === 6) {
        const divider = document.createElement("div");
        divider.className = "tqc-actions-divider";
        divider.setAttribute("aria-hidden", "true");
        menu.appendChild(divider);
      }

      const button = makeButton(action);
      button.setAttribute("role", "menuitem");

      button.addEventListener("click", function () {
        handleAction(action.id, card, menu);
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

            // Local event for site integrations; no data is sent or stored
            // by this script on its own.
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

    activeMenu = menu;
    activeTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");

    positionMenu(menu, trigger);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand("copy");
    textarea.remove();

    if (!success) {
      throw new Error("Clipboard access was denied.");
    }
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
    }, 1000);
  }

  function printResult(text) {
    const printWindow = window.open("", "_blank", "width=760,height=700");

    if (!printWindow) {
      showToast("Allow popups to print your result.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(
      "<!doctype html><html><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
      "<title>TheQuantCal — Calculator Result</title>" +
      "<style>body{font:16px/1.6 system-ui,sans-serif;max-width:760px;" +
      "margin:40px auto;padding:0 22px;color:#172033}" +
      "h1{font-size:24px}pre{white-space:pre-wrap;overflow-wrap:anywhere;" +
      "font:inherit}footer{margin-top:28px;color:#64748b;font-size:12px}" +
      "@media print{body{margin:0}}</style></head><body>" +
      "<h1>TheQuantCal — Calculator Result</h1><pre>" +
      escapeHTML(text) +
      "</pre><footer>Generated from " +
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
      'loading="lazy" style="border:0;border-radius:16px;" ' +
      'allow="clipboard-write"></iframe>';
  }

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
          showToast("Choose Yes or No below the feedback option.");
          break;

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
              if (error && error.name !== "AbortError") throw error;
            }
          } else {
            await copyText(
              pageTitle + "\n" + result + "\n" + location.href
            );
            showToast("Sharing isn't available here. Details copied.");
          }
          break;
        }

        case "report": {
          const subject = encodeURIComponent(
            "TheQuantCal calculator issue: " + pageTitle
          );
          const body = encodeURIComponent(
            "Calculator page: " + location.href +
            "\n\nPlease describe the issue below:\n\n"
          );

          // Replace with your real support email when available.
          const reportEmail = "";
          if (!reportEmail) {
            await copyText(
              "Report an issue with TheQuantCal\nPage: " +
              location.href +
              "\n\nDescribe the issue here:\n"
            );
            showToast("Report details copied. Add your support email to enable email reporting.");
          } else {
            location.href =
              "mailto:" + reportEmail +
              "?subject=" + subject + "&body=" + body;
          }
          break;
        }
      }
    } catch (error) {
      console.error("[TheQuantCal Actions]", error);
      showToast("Action could not be completed. Check browser permissions.");
    }

    if (action !== "feedback") closeMenu();
  }

  function attachToCard(card) {
    if (card.dataset.tqcActionsAttached === "true") return;

    const computedPosition = getComputedStyle(card).position;
    if (computedPosition === "static") {
      card.style.position = "relative";
    }

    const host = document.createElement("div");
    host.className = "tqc-actions-host";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = BUTTON_CLASS;
    trigger.textContent = "⋮";
    trigger.setAttribute("aria-label", "Open result actions");
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    trigger.title = "Result actions";

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
      if (trigger) trigger.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (activeMenu && activeTrigger) {
      positionMenu(activeMenu, activeTrigger);
    }
  });

  window.addEventListener("scroll", function () {
    if (activeMenu && activeTrigger) {
      positionMenu(activeMenu, activeTrigger);
    }
  }, true);

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
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
