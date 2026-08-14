const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { getAllowedSource } = require("../source-attribution.js");

const root = path.resolve(__dirname, "..");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const proofLink = readme.match(
  /\[Review all three projects in one proof summary\]\((https:\/\/[^)]+)\)/,
);

assert.ok(proofLink, "the GitHub README should keep its main proof link");

const proofUrl = new URL(proofLink[1]);

assert.equal(proofUrl.origin, "https://resume-sable-phi.vercel.app");
assert.equal(proofUrl.pathname, "/project-proof/");
assert.equal(proofUrl.searchParams.get("ref"), "portfolio-story");
assert.equal(
  getAllowedSource(proofUrl.search),
  "portfolio-story",
  "the approved GitHub source should be recordable by portfolio analytics",
);

console.log("GitHub proof source checks passed");
