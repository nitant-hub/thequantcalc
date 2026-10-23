
/* =====================================================
   TheQuantCal - Universal Calculator Actions
   File: /js/calculator-actions.js
   ===================================================== */

(() => {
  "use strict";

  if (window.__TQC_ACTIONS_LOADED__) return;
  window.__TQC_ACTIONS_LOADED__ = true;

  const RESULT_SELECTOR = [
    "[data-calculator-result]",
    ".calculator-result",
    ".result-card",
    ".result-box",
    ".result-container",
    ".calculation-result",
    "#result",
    "#results",
    ".result"
  ].join(",");

  const VALUE_SELECTOR = [
    "[data-result-value]",
    ".result-value",
    ".result-number",
    ".percentage-value",
    ".final-result",
    "output"
  ].join(",");

  const MENU_CLASS = "tqc-actions-menu";
  let activeMenu = null;

  /* ---------- Premium dark-glass design ---------- */

  const style = document.createElement("style");

  style.textContent = `
    .tqc-actions-host {
      position: relative !important;
      overflow: visible !important;
    }

    .tqc-actions-anchor {
      position: relative;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 5px;
      z-index: 100;
    }

    .tqc-actions-trigger {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid rgba(130,190,255,.3);
      background: rgba(100,150,210,.22);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background .2s, border-color .2s;
      -webkit-tap-highlight-color: transparent;
    }

    .tqc-actions-trigger:hover,
    .tqc-actions-trigger[aria-expanded="true"] {
      background: rgba(35,190,255,.23);
      border-color: #32baff;
    }

    .tqc-actions-trigger svg {
      width: 23px;
      height: 23px;
      fill: currentColor;
    }

    .${MENU_CLASS} {
      position: absolute;
      top: calc(100% + 7px);
      right: 0;
      width: min(250px, calc(100vw - 32px));
      box-sizing: border-box;
      padding: 8px;
      border: 1px solid rgba(90,160,235,.7);
      border-radius: 14px;
      background: linear-gradient(
        150deg,
        rgba(24,57,94,.99),
        rgba(5,20,41,.99)
      );
      color: #f1f7ff;
      box-shadow:
        0 15px 38px rgba(0,0,0,.35),
        0 0 22px rgba(30,140,255,.12);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      font: 14px/1.4 system-ui, sans-serif;
      text-align: left;
      z-index: 99999;
    }

    .${MENU_CLASS}[hidden] {
      display: none !important;
    }

    .${MENU_CLASS} button {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 10px 8px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .${MENU_CLASS} button:hover {
      background: rgba(120,180,245,.15);
    }

    .${MENU_CLASS} button:focus-visible {
      outline: 2px solid #26c8f4;
      outline-offset: 2px;
    }

    .${MENU_CLASS} .tqc-icon {
      width: 21px;
      min-width: 21px;
      text-align: center;
      font-size: 18px;
    }

    .${MENU_CLASS} .tqc-divider {
      height: 1px;
      margin: 5px 3px;
      background: rgba(160,195,235,.23);
    }

    .${MENU_CLASS} .tqc-label {
      padding: 6px 8px 3px;
      color: #abc5e5;
      font-size: 12px;
    }

    .${MENU_CLASS} .tqc-feedback {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
    }

    .${MENU_CLASS} .tqc-feedback button {
      justify-content: center;
    }

    .${MENU_CLASS} .tqc-feedback button[aria-pressed="true"] {
      color: #70e3ff;
      background: rgba(35,190,255,.17);
    }

    .${MENU_CLASS} .tqc-feedback-status {
      padding: 3px 8px;
      color: #abc5e5;
      font-size: 11px;
    }

    .tqc-actions-toast {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translateX(-50%);
      max-width: calc(100vw - 32px);
      padding: 11px 16px;
      border: 1px solid #426b98;
      border-radius: 12px;
      background: #102b4c;
      color: white;
      box-shadow: 0 8px 28px #0004;
      font: 14px system-ui, sans-serif;
      z-index: 100000;
    }

    @media (max-width: 420px) {
      .${MENU_CLASS} {
        width: min(244px, calc(100vw - 28px));
      }
    }
  `;

  document.head.appendChild(style);

  /* ---------- Notifications ---------- */

  function notify(message) {
    document.querySelectorAll(".tqc-actions-toast")
      .forEach(el => el.remove());

    const toast = document.createElement("div");
    toast.className = "tqc-actions-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  /* ---------- Calculator result detection ---------- */

  function getResult(card) {
    if (!card) return "";

    const value = card.querySelector(VALUE_SELECTOR);

    if (value && value.innerText.trim()) {
      return value.innerText.trim();
    }

    const candidates = card.querySelectorAll(
      "output, strong, b, [aria-live], .answer, .value"
    );

    for (const element of candidates) {
      const text = (element.innerText || "").trim();

      if (text && /\d/.test(text) && text.length < 500) {
        return text;
      }
    }

    return (card.innerText || "").trim().slice(0, 1200);
  }

  function getCalculatorName() {
    return document.title || "Calculator";
  }

  function getResultText(card) {
    return [
      getCalculatorName(),
      "Result: " + (getResult(card) || "Not detected"),
      "Page: " + location.href
    ].join("\n");
  }

  /* ---------- Copy result ---------- */

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand("copy");
    textarea.remove();

    if (!success) throw new Error("Copy failed");
  }

  /* ---------- Download result ---------- */

  function downloadResult(card) {
    const blob = new Blob(
      [getResultText(card) + "\n"],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const filename = getCalculatorName()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "calculator";

    link.href = url;
    link.download = filename + "-result.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Result downloaded.");
  }

  /* ---------- Print result ---------- */

  function printResult(card) {
    const popup = window.open(
      "",
      "_blank",
      "width=700,height=700"
    );

    if (!popup) {
      notify("Allow pop-ups to print the result.");
      return;
    }

    const title = getCalculatorName()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const result = (getResult(card) || "No result detected")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    popup.document.write(`
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title} - Result</title>
        <style>
          body {
            font: 16px/1.6 system-ui, sans-serif;
            max-width: 700px;
            margin: 40px auto;
            padding: 20px;
            color: #14253a;
          }
          .result {
            padding: 20px;
            border: 1px solid #ccd8e6;
            border-radius: 12px;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <h2>Calculator result</h2>
        <div class="result">${result}</div>
        <script>
          window.onload = () => window.print();
        <\/script>
      </body>
      </html>
    `);

    popup.document.close();
  }

  /* ---------- Share result ---------- */

  async function shareResult(card) {
    const result = getResult(card);

    const data = {
      title: getCalculatorName(),
      text: result
        ? getCalculatorName() + "\nResult: " + result
        : getCalculatorName(),
      url: location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          notify("Sharing was not completed.");
        }
      }
    } else {
      await copyText(data.text + "\n" + data.url);
      notify("Result and link copied.");
    }
  }

  /* ---------- Embed code ---------- */

  async function embedResult() {
    const title = getCalculatorName().replace(/"/g, "&quot;");
    const url = location.href.split("#")[0];

    const code =
      '<iframe src="' + url +
      '" title="' + title +
      '" loading="lazy" style="width:100%;min-height:600px;border:0;border-radius:12px;"></iframe>';

    try {
      await copyText(code);
      notify("Embed code copied.");
    } catch {
      window.prompt("Copy the embed code:", code);
    }
  }

  /* ---------- Report ---------- */

  function reportResult(card) {
    const email = ""; // Add your real support email here.

    const subject = encodeURIComponent(
      "Calculator report: " + getCalculatorName()
    );

    const body = encodeURIComponent(
      "Calculator: " + getCalculatorName() +
      "\nPage: " + location.href +
      "\nResult: " + getResult(card) +
      "\n\nDescribe the problem:\n"
    );

    if (email) {
      location.href =
        "mailto:" + email +
        "?subject=" + subject +
        "&body=" + body;
    } else {
      copyText(
        "Calculator report\n" +
        decodeURIComponent(body)
      ).then(() => {
        notify("Report details copied. Send them to the site owner.");
      }).catch(() => {
        window.prompt(
          "Copy these report details:",
          decodeURIComponent(body)
        );
      });
    }
  }

  /* ---------- Close popup ---------- */

  function closeMenu() {
    if (!activeMenu) return;

    activeMenu.menu.hidden = true;
    activeMenu.button.setAttribute("aria-expanded", "false");
    activeMenu = null;
  }

  document.addEventListener("click", event => {
    if (!activeMenu) return;

    if (
      activeMenu.menu.contains(event.target) ||
      activeMenu.button.contains(event.target)
    ) return;

    closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  /* ---------- Create the three-dot menu ---------- */

  function createMenu(card, button) {
    const menu = document.createElement("div");

    menu.className = MENU_CLASS;
    menu.hidden = true;
    menu.setAttribute("role", "menu");

    menu.innerHTML = `
      <button type="button" data-action="download">
        <span class="tqc-icon">⇩</span>
        <span>Download result</span>
      </button>

      <button type="button" data-action="print">
        <span class="tqc-icon">▣</span>
        <span>Print result</span>
      </button>

      <button type="button" data-action="copy">
        <span class="tqc-icon">▢</span>
        <span>Copy result</span>
      </button>

      <div class="tqc-divider"></div>

      <div class="tqc-label">Was this helpful?</div>

      <div class="tqc-feedback">
        <button type="button" data-action="yes"
                aria-pressed="false">
          <span>☻</span> Yes
        </button>

        <button type="button" data-action="no"
                aria-pressed="false">
          <span>☹</span> No
        </button>
      </div>

      <div class="tqc-feedback-status" aria-live="polite"></div>

      <div class="tqc-divider"></div>

      <button type="button" data-action="embed">
        <span class="tqc-icon">&lt;/&gt;</span>
        <span>Embed</span>
      </button>

      <button type="button" data-action="share">
        <span class="tqc-icon">♧</span>
        <span>Share</span>
      </button>

      <button type="button" data-action="report">
        <span class="tqc-icon">⚠</span>
        <span>Report</span>
      </button>
    `;

    menu.addEventListener("click", async event => {
      const control = event.target.closest("[data-action]");
      if (!control) return;

      const action = control.dataset.action;

      try {
        if (action === "download") {
          downloadResult(card);
        }

        if (action === "print") {
          printResult(card);
        }

        if (action === "copy") {
          await copyText(getResultText(card));
          notify("Result copied.");
        }

        if (action === "share") {
          await shareResult(card);
        }

        if (action === "embed") {
          await embedResult();
        }

        if (action === "report") {
          reportResult(card);
        }

        if (action === "yes" || action === "no") {
          menu.querySelectorAll("[data-action='yes'], [data-action='no']")
            .forEach(button => {
              button.setAttribute(
                "aria-pressed",
                String(button.dataset.action === action)
              );
            });

          menu.querySelector(".tqc-feedback-status").textContent =
            "Thanks for your feedback.";

          // Hook for a future analytics or feedback backend.
          window.dispatchEvent(new CustomEvent(
            "tqc:calculator-feedback",
            {
              detail: {
                helpful: action === "yes",
                page: location.href,
                calculator: getCalculatorName()
              }
            }
          ));
        }
      } catch (error) {
        console.error("TheQuantCal action error:", error);
        notify("This action could not be completed.");
      }
    });

    button.addEventListener("click", event => {
      event.stopPropagation();

      if (activeMenu && activeMenu.menu !== menu) {
        closeMenu();
      }

      const shouldOpen = menu.hidden;
      menu.hidden = !shouldOpen;

      button.setAttribute(
        "aria-expanded",
        String(shouldOpen)
      );

      activeMenu = shouldOpen ? { menu, button } : null;
    });

    return menu;
  }

  /* ---------- Find calculator result cards ---------- */

  function findResultCards() {
    return Array.from(
      document.querySelectorAll(RESULT_SELECTOR)
    ).filter(card => {
      if (card.dataset.tqcActionsInjected === "true") {
        return false;
      }

      // Avoid adding a menu to a parent that contains
      // another matching result card.
      return !Array.from(card.children).some(child =>
        child.matches &&
        child.matches(RESULT_SELECTOR)
      );
    });
  }

  function addMenu(card) {
    if (card.dataset.tqcActionsInjected === "true") return;

    card.dataset.tqcActionsInjected = "true";
    card.classList.add("tqc-actions-host");

    const anchor = document.createElement("div");
    anchor.className = "tqc-actions-anchor";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "tqc-actions-trigger";
    button.setAttribute("aria-label", "Calculator actions");
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="5" r="1.8"></circle>
        <circle cx="12" cy="12" r="1.8"></circle>
        <circle cx="12" cy="19" r="1.8"></circle>
      </svg>
    `;

    const menu = createMenu(card, button);

    anchor.append(button, menu);
    card.insertBefore(anchor, card.firstChild);
  }

  function scan() {
    findResultCards().forEach(addMenu);
  }

  /* ---------- Support dynamically updated pages ---------- */

  function start() {
    scan();

    const observer = new MutationObserver(() => {
      scan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.TQC_CALCULATOR_ACTIONS_API = {
      refresh: scan,
      close: closeMenu
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }
})();
