const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(
  path.join(root, "hire-full-stack-developer/index.html"),
  "utf8",
);
const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const socialPreview = fs.readFileSync(
  path.join(root, "hire-full-stack-developer/social-preview.png"),
);
const socialPreviewSource = fs.readFileSync(
  path.join(root, "hire-full-stack-developer/social-preview.svg"),
  "utf8",
);

assert.match(html, /<title>Hire a Full Stack Developer \| Kunal Deshmukh<\/title>/);
assert.match(
  html,
  /rel="canonical"\s+href="https:\/\/resume-sable-phi\.vercel\.app\/hire-full-stack-developer\/"/,
);
assert.match(html, /<h1[^>]*>[\s\S]*Hire a full-stack developer/);
assert.match(html, /"@type": "ProfilePage"/);
assert.match(html, /"@type": "FAQPage"/);
assert.match(html, /href="\/projects\/ecotrace\/"/);
assert.match(html, /href="\/projects\/bookify\/"/);
assert.match(html, /href="\/projects\/ai-study-buddy\/"/);
assert.match(html, /href="\/mern-stack-portfolio-projects\/"/);
assert.match(
  html,
  /href="\/Kunal-Deshmukh-Full-Stack-Developer-Resume\.pdf"/,
);
assert.match(
  html,
  /download="Kunal-Deshmukh-Full-Stack-Developer-Resume\.pdf"/,
);
assert.match(
  html,
  /property="og:image"\s+content="https:\/\/resume-sable-phi\.vercel\.app\/hire-full-stack-developer\/social-preview\.png"/,
);
assert.match(html, /property="og:image:width" content="1200"/);
assert.match(html, /property="og:image:height" content="630"/);
assert.match(
  html,
  /name="twitter:image"\s+content="https:\/\/resume-sable-phi\.vercel\.app\/hire-full-stack-developer\/social-preview\.png"/,
);
assert.match(html, /content="Kunal Deshmukh, MERN \/ Full Stack Developer"/);
assert.doesNotMatch(
  html,
  /(?:property="og:image"|name="twitter:image")\s+content="https:\/\/resume-sable-phi\.vercel\.app\/social-preview\.png"/,
);
assert.equal(socialPreview.readUInt32BE(16), 1200);
assert.equal(socialPreview.readUInt32BE(20), 630);
assert.match(socialPreviewSource, />\s*Kunal\s*</);
assert.match(socialPreviewSource, />\s*Deshmukh\s*</);
assert.match(socialPreviewSource, /MERN \/ Full Stack Developer/);
assert.match(
  homepage,
  /href="\/hire-full-stack-developer\/">proof-first hiring brief<\/a>/,
);
assert.match(
  sitemap,
  /<loc>https:\/\/resume-sable-phi\.vercel\.app\/hire-full-stack-developer\/<\/loc>/,
);

console.log("full-stack hiring page checks passed");
