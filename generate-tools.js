/*
  generate-tools.js - runs on every Cloudflare deploy.
  Scans tools/, finance/, math/, utility/, scientific/, everyday/ (and subfolders).
  Category order: schema applicationCategory -> meta category -> folder name -> utility.
  Writes tools.json, sitemap-pages.xml and the search list inside navigation.js.
*/
const fs = require("fs");
const path = require("path");

const SITE = process.env.SITE_URL || "https://thequantcal.pages.dev";
const ROOT = __dirname;
const IGNORE_FOLDERS = [".git", ".github", "node_modules", "css", "js", "assets", "images","_includes", "_layouts"];
const SCAN_FOLDERS = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !IGNORE_FOLDERS.includes(dirent.name) && !dirent.name.startsWith("."))
  .map(dirent => dirent.name);


const CATEGORY_MAP = {
  finance: "financial", financial: "financial", financeapplication: "financial",
  education: "math", educational: "math", math: "math", mathematics: "math",
  health: "health", healthandfitness: "health", fitness: "health",
  utility: "utility", utilities: "utility", generaltools: "utility"
};
const ACRONYMS = ["Sip", "Emi", "Fd", "Rd", "Ppf", "Gst", "Ipo", "Bmi", "Cagr", "Hra", "Epf", "Nps", "Roi"];

function pretty(s) {
  let t = s.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  ACRONYMS.forEach(a => { t = t.replace(new RegExp("\\b" + a + "\\b", "g"), a.toUpperCase()); });
  return t.trim();
}
function cleanKey(v) {
  return String(v).toLowerCase().replace(/application/g, "").replace(/[^a-z0-9]/g, "");
}
function mapCat(v) {
  const k = cleanKey(v);
  if (!k) return "";
  return CATEGORY_MAP[k] || k;
}
function readSchemas(html) {
  const out = [];
  const re = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) { try { out.push(JSON.parse(m[1])); } catch (e) {} }
  return out;
}
function findApp(node) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) { for (const n of node) { const r = findApp(n); if (r) return r; } return null; }
  const t = node["@type"];
  if (t === "WebApplication" || (Array.isArray(t) && t.includes("WebApplication"))) return node;
  return findApp(node["@graph"]);
}
function metaContent(html, name) {
  const m = html.match(new RegExp("<meta[^>]+name=[\"']" + name + "[\"'][^>]+content=[\"']([^\"']*)[\"']", "i"));
  return m ? m[1].trim() : "";
}

// Added helper to extract data-category from <html> tag
function dataCategory(html) {
  const m = html.match(/<html[^>]+data-category=["']([^"']+)["']/i);
  return m ? mapCat(m[1]) : "";
}

function walk(dir) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  });
  return files;
}

const tools = [];
const seen = {};
SCAN_FOLDERS.forEach(folder => {
  const base = path.join(ROOT, folder);
  if (!fs.existsSync(base)) return;
  walk(base).forEach(full => {
    const rel = path.relative(ROOT, full).split(path.sep).join("/");
    const file = rel.split("/").pop();
    if (!/\.html$/i.test(file) || file.charAt(0) === "_" || /^index\.html$/i.test(file)) return;
    const html = fs.readFileSync(full, "utf8");

    let schemaCat = "", schemaName = "";
    for (const s of readSchemas(html)) {
      const app = findApp(s);
      if (app) {
        if (typeof app.applicationCategory === "string") schemaCat = mapCat(app.applicationCategory);
        if (typeof app.name === "string") schemaName = app.name.trim();
        break;
      }
    }
    const folderCat = folder !== "tools" ? mapCat(folder) : "";
    
    // Updated category priority chain to include dataCategory(html)
    const category = schemaCat || dataCategory(html) || mapCat(metaContent(html, "category")) || folderCat || "utility";
    
    const title = schemaName || pretty(file.replace(/\.html$/i, ""));
    const text = metaContent(html, "description") || "Open this free tool to calculate instantly.";
    const p = "/" + rel;
    if (seen[p.toLowerCase()]) return;
    seen[p.toLowerCase()] = 1;
    
    const pathParts = rel.split("/");
    let subcategory = "";
    if (pathParts.length >= 3) {
      subcategory = pathParts[pathParts.length - 2];
    }
    
    tools.push({ path: p, url: p, title, text, description: text, category, subcategory });

  });
});
tools.sort((a, b) => a.title.localeCompare(b.title));

fs.writeFileSync(path.join(ROOT, "tools.json"), JSON.stringify(tools, null, 2));

const urls = ["/", ...tools.map(t => t.path)].map(p => "  <url><loc>" + SITE + p + "</loc></url>").join("\n");
fs.writeFileSync(path.join(ROOT, "sitemap-pages.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n");

const navPath = path.join(ROOT, "navigation.js");
if (fs.existsSync(navPath)) {
  const nav = fs.readFileSync(navPath, "utf8");
  const arr = JSON.stringify(tools.map(t => ({ name: t.title, url: t.path })), null, 2);
  fs.writeFileSync(navPath, nav.replace(/const allTools = \[[\s\S]*?\];/, () => "const allTools = " + arr + ";"));
}
console.log("Generated " + tools.length + " tools");
tools.forEach(t => console.log(" - " + t.category + " : " + t.title + " (" + t.path + ")"));
