/* =====================================================
   TheQuantCal - Universal Calculator Actions
   File: /js/calculator-actions.js
   ===================================================== */
(() => {
  "use strict";
  if (window.__TQC_ACTIONS_LOADED__) return;
  window.__TQC_ACTIONS_LOADED__ = true;

  // Updated to include .results-dashboard for the Exam Marks Calculator
  const RESULT_SELECTOR = "[data-calculator-result], .calculator-result, .result-card, .result-box, .result-container, .calculation-result, #result, #results, .result, .results-dashboard";
  const VALUE_SELECTOR = "[data-result-value], .result-value, .result-number, .percentage-value, .final-result, output";
  const MENU_CLASS = "tqc-actions-menu";

  const style = document.createElement("style");
  style.textContent = `
    .tqc-actions-host { position: relative !important; overflow: visible !important; }
    .tqc-actions-anchor { position: relative; display: flex; justify-content: flex-end; margin-bottom: 5px; z-index: 100; }
    .tqc-actions-trigger { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(130,190,255,.3); background: rgba(100,150,210,.22); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .2s; }
    .tqc-actions-trigger:hover, .tqc-actions-trigger[aria-expanded="true"] { background: rgba(35,190,255,.23); border-color: #32baff; }
    .tqc-actions-trigger svg { width: 23px; height: 23px; fill: currentColor; }
    .${MENU_CLASS} { position: absolute; top: calc(100% + 7px); right: 0; width: min(250px, calc(100vw - 32px)); padding: 8px; border: 1px solid rgba(90,160,235,.7); border-radius: 14px; background: linear-gradient(150deg, rgba(24,57,94,.99), rgba(5,20,41,.99)); color: #f1f7ff; box-shadow: 0 15px 38px rgba(0,0,0,.35); backdrop-filter: blur(18px); font: 14px/1.4 system-ui, sans-serif; z-index: 99999; }
    .${MENU_CLASS}[hidden] { display: none !important; }
    .${MENU_CLASS} button { width: 100%; display: flex; align-items: center; gap: 11px; padding: 10px 8px; border: 0; border-radius: 8px; background: transparent; color: inherit; font: inherit; cursor: pointer; }
    .${MENU_CLASS} button:hover { background: rgba(120,180,245,.15); }
    .${MENU_CLASS} .tqc-divider { height: 1px; margin: 5px 3px; background: rgba(160,195,235,.23); }
    .${MENU_CLASS} .tqc-label { padding: 6px 8px 3px; color: #abc5e5; font-size: 12px; }
    .${MENU_CLASS} .tqc-feedback { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
    .${MENU_CLASS} .tqc-feedback button { justify-content: center; }
    .${MENU_CLASS} .tqc-feedback button[aria-pressed="true"] { color: #70e3ff; background: rgba(35,190,255,.17); }
    .tqc-actions-toast { position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%); padding: 11px 16px; border-radius: 12px; background: #102b4c; color: white; box-shadow: 0 8px 28px #0004; font: 14px system-ui, sans-serif; z-index: 100000; }
  `;
  document.head.appendChild(style);

  function notify(msg) {
    document.querySelectorAll(".tqc-actions-toast").forEach(el => el.remove());
    const toast = document.createElement("div");
    toast.className = "tqc-actions-toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  function getResult(card) {
    const val = card.querySelector(VALUE_SELECTOR);
    if (val && val.innerText.trim()) return val.innerText.trim();
    for (const el of card.querySelectorAll("output, strong, b, .answer, .value")) {
      const txt = (el.innerText || "").trim();
      if (txt && /\d/.test(txt)) return txt;
    }
    return (card.innerText || "").trim().slice(0, 1200);
  }

  function getTitle() { return document.title || "Calculator"; }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); }
    else {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
  }

  function downloadResult(card) {
    const blob = new Blob([getTitle() + "\nResult: " + getResult(card) + "\n"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = getTitle().replace(/[^a-z0-9]/gi, "-") + ".txt";
    a.click(); URL.revokeObjectURL(url); notify("Result downloaded.");
  }

  function printResult(card) {
    const p = window.open("", "_blank", "width=700,height=700");
    if (!p) return notify("Allow pop-ups to print.");
    p.document.write(`<html><body style="font:16px system-ui;padding:20px;"><h2>${getTitle()}</h2><pre>${getResult(card)}</pre><script>window.onload=()=>window.print();</script></body></html>`);
    p.document.close();
  }

  async function shareResult(card) {
    const data = { title: getTitle(), text: "Result: " + getResult(card), url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch(e){} }
    else { await copyText(data.text + " " + data.url); notify("Link copied."); }
  }

  function createMenu(card, btn) {
    const menu = document.createElement("div");
    menu.className = MENU_CLASS; menu.hidden = true;
    menu.innerHTML = `
      <button data-act="download">Download result</button>
      <button data-act="print">Print result</button>
      <button data-act="copy">Copy result</button>
      <div class="tqc-divider"></div>
      <div class="tqc-label">Was this helpful?</div>
      <div class="tqc-feedback">
        <button data-act="yes">Yes</button>
        <button data-act="no">No</button>
      </div>
      <div class="tqc-divider"></div>
      <button data-act="embed">Embed</button>
      <button data-act="share">Share</button>
      <button data-act="report">Report</button>
    `;
    
    menu.addEventListener("click", async e => {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (!act) return;
      if (act === "download") downloadResult(card);
      if (act === "print") printResult(card);
      if (act === "copy") { await copyText(getResult(card)); notify("Copied."); }
      if (act === "share") await shareResult(card);
      if (act === "embed") { await copyText(`<iframe src="${location.href.split('#')[0]}" style="width:100%;min-height:600px;border:0;border-radius:12px;"></iframe>`); notify("Embed code copied."); }
      if (act === "report") { await copyText("Report for: " + location.href); notify("Report details copied to clipboard."); }
      if (act === "yes" || act === "no") notify("Thanks for your feedback.");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (evt) => {
      if (!menu.hidden && !btn.contains(evt.target) && !menu.contains(evt.target)) {
        menu.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      }
    });

    btn.addEventListener("click", e => { 
      e.stopPropagation(); 
      menu.hidden = !menu.hidden; 
      btn.setAttribute("aria-expanded", !menu.hidden); 
    });
    
    return menu;
  }

  function addMenu(card) {
    if (card.dataset.tqcInjected) return;
    card.dataset.tqcInjected = "true"; 
    card.classList.add("tqc-actions-host");
    
    const anchor = document.createElement("div"); 
    anchor.className = "tqc-actions-anchor";
    
    const btn = document.createElement("button"); 
    btn.className = "tqc-actions-trigger"; 
    btn.setAttribute("aria-label", "Calculator actions");
    btn.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
    
    anchor.append(btn, createMenu(card, btn));
    card.insertBefore(anchor, card.firstChild);
  }

  const scan = () => document.querySelectorAll(RESULT_SELECTOR).forEach(addMenu);
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }

  // Support calculators that update their HTML dynamically
  const observer = new MutationObserver(scan);
  observer.observe(document.body, { childList: true, subtree: true });
})();
