const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("projects/ecotrace/technical-walkthrough/index.html");
const caseStudy = read("projects/ecotrace/index.html");
const proofPage = read("project-proof/index.html");
const sitemap = read("sitemap.xml");

assert.match(html, /<title>EcoTrace technical walkthrough \| Kunal Deshmukh<\/title>/);
assert.match(
  html,
  /rel="canonical" href="https:\/\/resume-sable-phi\.vercel\.app\/projects\/ecotrace\/technical-walkthrough\/"/,
);
assert.match(html, /data-proof-surface="ecotrace-walkthrough"/);
assert.match(html, /responseMimeType: application\/json/);
assert.match(html, /Math\.max\(0, Number\(value\) \|\| 0\)/);
assert.match(html, /Footprint\(\{ userId, \.\.\. \}\)\.save\(\)/);
assert.match(html, /c6b7bd8ec37be2f346d9fba3e92ea3837febe23a/);
assert.equal(
  (html.match(/class="primary-action"/g) || []).length,
  1,
  "the walkthrough should expose one primary hiring action",
);
assert.match(caseStudy, /href="\/projects\/ecotrace\/technical-walkthrough\/"/);
assert.match(proofPage, /href="\/projects\/ecotrace\/technical-walkthrough\/"/);
assert.match(
  sitemap,
  /<loc>https:\/\/resume-sable-phi\.vercel\.app\/projects\/ecotrace\/technical-walkthrough\/<\/loc>/,
);

console.log("EcoTrace technical walkthrough checks passed");
