const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { getAllowedSource } = require("../source-attribution.js");

const root = path.resolve(__dirname, "..");
const resumeHtml = fs.readFileSync(path.join(root, "resume.html"), "utf8");
const resumePdf = fs.readFileSync(
  path.join(root, "Kunal-Deshmukh-Full-Stack-Developer-Resume.pdf"),
);
const proofLink = resumeHtml.match(
  /class="proof-link"[\s\S]*?href="(https:\/\/[^\"]+)"/,
);

assert.ok(proofLink, "the resume should keep its visible project-proof link");

const proofUrl = new URL(proofLink[1]);

assert.equal(proofUrl.origin, "https://resume-sable-phi.vercel.app");
assert.equal(proofUrl.pathname, "/project-proof/");
assert.equal(proofUrl.searchParams.get("ref"), "hiring-review");
assert.equal(
  getAllowedSource(proofUrl.search),
  "hiring-review",
  "the approved resume source should be recordable by portfolio analytics",
);
assert.equal(
  resumePdf.includes(Buffer.from(proofUrl.href)),
  true,
  "the downloadable resume should preserve the labeled proof URL",
);

console.log("resume proof source checks passed");
