const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  captureProjectProofHubView,
  captureProofDetailClick,
  captureProofView,
  getProofDetailProperties,
  getProofViewProperties,
} = require("../proof-analytics.js");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const script = read("script.js");

const proofPages = new Map([
  ["projects/ecotrace/index.html", "ecotrace"],
  ["projects/ecotrace/technical-walkthrough/index.html", "ecotrace-walkthrough"],
  ["projects/bookify/index.html", "bookify"],
  ["projects/ai-study-buddy/index.html", "ai-study-buddy"],
  ["mern-stack-portfolio-projects/index.html", "mern-projects-guide"],
  ["hire-full-stack-developer/index.html", "hire-full-stack-developer"],
  ["project-proof/index.html", "project-proof"],
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

const hubCaptures = [];
const hubDocumentRoot = { dataset: {} };
const hubPosthog = {
  capture: (event, properties) => hubCaptures.push({ event, properties }),
};

assert.equal(
  captureProjectProofHubView({
    proofSurface: "project-proof",
    evaluatorSource: "portfolio-story",
    posthog: hubPosthog,
    documentRoot: hubDocumentRoot,
  }),
  true,
);
assert.equal(
  captureProjectProofHubView({
    proofSurface: "project-proof",
    evaluatorSource: "portfolio-story",
    posthog: hubPosthog,
    documentRoot: hubDocumentRoot,
  }),
  false,
  "the hub view should emit once per page load",
);
assert.deepEqual(hubCaptures, [
  {
    event: "project_proof_hub_viewed",
    properties: { evaluator_source: "portfolio-story" },
  },
]);
assert.equal(
  captureProjectProofHubView({
    proofSurface: "project-proof",
    posthog: null,
    documentRoot: { dataset: {} },
  }),
  false,
  "analytics=off should suppress the hub view by withholding the client",
);

const proofPage = read("project-proof/index.html");
const detailLinks = Array.from(
  proofPage.matchAll(
    /<a\s+[\s\S]*?data-proof-detail="([^"]+)"[\s\S]*?data-proof-project="([^"]+)"[\s\S]*?href="([^"]+)"[\s\S]*?<\/a>/g,
  ),
);
assert.equal(detailLinks.length, 7, "all seven proof-detail links should be marked");

const expectedDetails = [
  ["case-study", "ecotrace"],
  ["technical-walkthrough", "ecotrace"],
  ["pinned-source", "ecotrace"],
  ["case-study", "bookify"],
  ["pinned-source", "bookify"],
  ["case-study", "ai-study-buddy"],
  ["pinned-source", "ai-study-buddy"],
];
assert.deepEqual(
  detailLinks.map((match) => [match[1], match[2]]),
  expectedDetails,
  "case studies, the walkthrough, and pinned sources should be covered",
);

const detailCaptures = [];
const detailPosthog = {
  capture: (event, properties) => detailCaptures.push({ event, properties }),
};
const detailTarget = {
  closest: (selector) =>
    selector === "[data-proof-detail]"
      ? {
          dataset: {
            proofDetail: "technical-walkthrough",
            proofProject: "ecotrace",
          },
        }
      : null,
};

assert.equal(
  captureProofDetailClick({
    target: detailTarget,
    evaluatorSource: "hiring-review",
    posthog: detailPosthog,
  }),
  true,
);
assert.deepEqual(detailCaptures, [
  {
    event: "proof_detail_clicked",
    properties: {
      detail_type: "technical-walkthrough",
      project: "ecotrace",
      evaluator_source: "hiring-review",
    },
  },
]);
assert.deepEqual(
  getProofDetailProperties("case-study", "bookify", "private-person-name"),
  { detail_type: "case-study", project: "bookify" },
);
assert.equal(
  captureProofDetailClick({
    target: { closest: () => null },
    posthog: detailPosthog,
  }),
  false,
  "unrelated links should not emit proof-detail events",
);
assert.equal(
  captureProofDetailClick({ target: detailTarget, posthog: null }),
  false,
  "analytics=off should suppress detail clicks by withholding the client",
);
assert.equal(detailCaptures.length, 1);

console.log("proof analytics checks passed");
