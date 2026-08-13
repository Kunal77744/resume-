const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("project-proof/index.html");
const homepage = read("index.html");
const sitemap = read("sitemap.xml");

assert.match(
  html,
  /<title>Full Stack Developer Portfolio \| Kunal Deshmukh<\/title>/,
);
assert.match(html, /name="description"[\s\S]*full stack developer portfolio/);
assert.match(html, /A full stack developer portfolio <span>you can inspect\.<\/span>/);
assert.match(html, /id="review"/);
assert.match(html, /id="questions"/);
assert.match(html, /"@type": "FAQPage"/);
assert.match(html, /"dateModified": "2026-08-13"/);
assert.match(
  html,
  /rel="canonical"\s+href="https:\/\/resume-sable-phi\.vercel\.app\/project-proof\/"/,
);
assert.match(html, /data-proof-surface="project-proof"/);
assert.match(html, /href="\/projects\/ecotrace\/"/);
assert.match(html, /href="\/projects\/bookify\/"/);
assert.match(html, /href="\/projects\/ai-study-buddy\/"/);
assert.match(html, /github\.com\/mern2026book-cmd\/CarbonEmission\/tree\/c6b7bd8/);
assert.match(html, /github\.com\/Kunal77744\/Shopify\/tree\/fd6be287/);
assert.match(html, /github\.com\/Kunal77744\/AI-Study-Buddy\/tree\/06114d8/);
assert.equal(
  (html.match(/class="primary-action"/g) || []).length,
  1,
  "the page should expose one primary hiring action",
);
assert.equal(
  (homepage.match(/href="\/project-proof\/"/g) || []).length,
  2,
  "the homepage should link the hero proof action and projects section to the proof page",
);
assert.match(homepage, /Review full stack portfolio/);
assert.match(homepage, /full stack developer portfolio page/);
assert.match(
  sitemap,
  /<loc>https:\/\/resume-sable-phi\.vercel\.app\/project-proof\/<\/loc>\s*<lastmod>2026-08-13<\/lastmod>/,
);

console.log("project proof page checks passed");
