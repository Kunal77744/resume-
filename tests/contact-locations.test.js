const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const guide = read("mern-stack-portfolio-projects/index.html");
const script = read("script.js");
const projectPages = [
  "projects/ecotrace/index.html",
  "projects/bookify/index.html",
  "projects/ai-study-buddy/index.html",
];

assert.match(
  guide,
  /data-contact-location="mern-projects-guide"/,
  "the MERN projects guide should have its own contact location",
);
assert.doesNotMatch(
  guide,
  /data-contact-location="case-study"/,
  "the MERN projects guide should not share the case-study location",
);
assert.match(
  guide,
  /href="mailto:resume-sable-phi@mail\.tin\.computer\?subject=MERN%20and%20full-stack%20role%20inquiry"/,
  "the guide should preserve its mailbox and role-inquiry subject",
);
assert.match(
  script,
  /contactLocation !== "mern-projects-guide"/,
  "the analytics allowlist should accept the MERN projects guide location",
);

for (const projectPage of projectPages) {
  assert.match(
    read(projectPage),
    /data-contact-location="case-study"/,
    `${projectPage} should retain the case-study contact location`,
  );
}

console.log("contact location checks passed");
