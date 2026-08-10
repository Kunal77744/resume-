const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const brokenLinkedInUrl = "https://www.linkedin.com/in/kunal-deshmukh-77744";
const publicDocuments = [
  "index.html",
  "hire-full-stack-developer/index.html",
  "resume.html",
];

for (const file of publicDocuments) {
  const contents = fs.readFileSync(path.join(root, file), "utf8");
  assert.doesNotMatch(
    contents,
    new RegExp(brokenLinkedInUrl.replaceAll(".", "\\.")),
    `${file} should not expose the unverified LinkedIn route`,
  );
}

const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.match(homepage, /href="https:\/\/github\.com\/Kunal77744"/);
assert.match(
  homepage,
  /href="\/Kunal-Deshmukh-Full-Stack-Developer-Resume\.pdf"/,
);
assert.match(
  homepage,
  /download="Kunal-Deshmukh-Full-Stack-Developer-Resume\.pdf"/,
);
assert.match(homepage, /href="mailto:resume-sable-phi@mail\.tin\.computer/);

const resumePdf = fs.readFileSync(
  path.join(root, "Kunal-Deshmukh-Full-Stack-Developer-Resume.pdf"),
);
assert.equal(
  resumePdf.includes(Buffer.from(brokenLinkedInUrl)),
  false,
  "the downloadable resume should not link to the unverified LinkedIn route",
);

console.log("public profile route checks passed");
