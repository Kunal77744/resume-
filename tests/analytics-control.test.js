const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { isEnabled } = require("../analytics-control.js");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const instrumentedPages = [
  "index.html",
  "projects/ecotrace/index.html",
  "projects/bookify/index.html",
  "projects/ai-study-buddy/index.html",
  "mern-stack-portfolio-projects/index.html",
  "hire-full-stack-developer/index.html",
];

assert.equal(isEnabled(""), true);
assert.equal(isEnabled("?ref=portfolio-story"), true);
assert.equal(isEnabled("?analytics=on"), true);
assert.equal(isEnabled("?analytics=OFF"), true);
assert.equal(isEnabled("?analytics=off"), false);
assert.equal(isEnabled("?ref=hiring-review&analytics=off"), false);
assert.equal(isEnabled("?analytics=on&analytics=off"), false);

for (const page of instrumentedPages) {
  const html = read(page);
  const controlIndex = html.indexOf('<script src="/analytics-control.js"></script>');
  const enabledIndex = html.indexOf("window.__portfolioAnalyticsEnabled =");
  const bootstrapIndex = html.indexOf("window.posthog?.init(");

  assert.ok(controlIndex >= 0, `${page} should load the analytics control`);
  assert.ok(
    controlIndex < enabledIndex && enabledIndex < bootstrapIndex,
    `${page} should resolve analytics=off before PostHog initializes`,
  );
  assert.match(
    html,
    /if \(!window\.__portfolioAnalyticsEnabled \|\| posthog\.__SV\) return;[\s\S]*window\.posthog\?\.init\(/,
    `${page} should stop PostHog initialization when the opt-out is active`,
  );
}

const sharedScript = read("script.js");

assert.match(
  sharedScript,
  /const analyticsEnabled = window\.__portfolioAnalyticsEnabled !== false;/,
  "manual analytics should share the same page-level opt-out",
);
assert.match(
  sharedScript,
  /posthog: analyticsEnabled \? window\.posthog : null/,
  "proof views should receive no analytics client when the opt-out is active",
);
assert.equal(
  (sharedScript.match(/window\.posthog\.capture\(/g) || []).length,
  4,
  "the shared script should keep the known four manual capture paths",
);
assert.equal(
  (sharedScript.match(/analyticsEnabled/g) || []).length,
  6,
  "the opt-out should guard proof, Signal Desk, copy, resume, and contact events",
);

console.log("analytics control checks passed");
