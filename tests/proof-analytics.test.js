const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  captureProofView,
  getProofViewProperties,
} = require("../proof-analytics.js");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const script = read("script.js");

const proofPages = new Map([
  ["projects/ecotrace/index.html", "ecotrace"],
  ["projects/bookify/index.html", "bookify"],
  ["projects/ai-study-buddy/index.html", "ai-study-buddy"],
  ["mern-stack-portfolio-projects/index.html", "mern-projects-guide"],
  ["hire-full-stack-developer/index.html", "hire-full-stack-developer"],
]);

for (const [page, proofSurface] of proofPages) {
  const html = read(page);

  assert.match(
    html,
    new RegExp(`data-proof-surface="${proofSurface}"`),
    `${page} should declare its stable proof surface`,
  );
  assert.match(
    html,
    /<script src="\/proof-analytics\.js" defer><\/script>\s*<script src="\/script\.js" defer><\/script>/,
    `${page} should load proof analytics before the shared script`,
  );
  assert.deepEqual(getProofViewProperties(proofSurface), {
    proof_surface: proofSurface,
  });
}

assert.match(
  script,
  /PortfolioProofAnalytics\?\.captureProofView\(\{\s*proofSurface: document\.body\?\.dataset\.proofSurface,\s*evaluatorSource,\s*posthog: analyticsEnabled \? window\.posthog : null,\s*documentRoot: document\.documentElement,\s*\}\);/,
  "the shared script should capture the declared surface with only allowlisted attribution",
);

assert.equal(getProofViewProperties("portfolio-home"), null);
for (const evaluatorSource of [
  "hiring-review",
  "portfolio-story",
  "frontend-craft",
]) {
  assert.deepEqual(
    getProofViewProperties("ecotrace", evaluatorSource),
    {
      proof_surface: "ecotrace",
      evaluator_source: evaluatorSource,
    },
  );
}
assert.deepEqual(
  getProofViewProperties("bookify", "private-person-name"),
  {
    proof_surface: "bookify",
  },
);

const captures = [];
const documentRoot = { dataset: {} };
const posthog = {
  capture: (event, properties) => captures.push({ event, properties }),
};

assert.equal(
  captureProofView({
    proofSurface: "ai-study-buddy",
    evaluatorSource: "frontend-craft",
    ignoredProperty: "must-not-be-captured",
    posthog,
    documentRoot,
  }),
  true,
);
assert.equal(
  captureProofView({
    proofSurface: "ai-study-buddy",
    evaluatorSource: "frontend-craft",
    posthog,
    documentRoot,
  }),
  false,
  "the same page load should not emit a duplicate event",
);
assert.deepEqual(captures, [
  {
    event: "portfolio_proof_viewed",
    properties: {
      proof_surface: "ai-study-buddy",
      evaluator_source: "frontend-craft",
    },
  },
]);

assert.equal(
  captureProofView({
    proofSurface: "unknown-proof",
    posthog,
    documentRoot: { dataset: {} },
  }),
  false,
);
assert.equal(captures.length, 1);

console.log("proof analytics checks passed");
