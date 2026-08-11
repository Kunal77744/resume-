const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const guide = read("mern-stack-portfolio-projects/index.html");
const hiringPage = read("hire-full-stack-developer/index.html");
const projectProof = read("project-proof/index.html");
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
assert.match(
  hiringPage,
  /data-contact-location="hiring-page"/,
  "the hiring page should have its own contact location",
);
assert.match(
  script,
  /contactLocation !== "hiring-page"/,
  "the analytics allowlist should accept the hiring page location",
);
assert.match(
  projectProof,
  /data-contact-location="project-proof"/,
  "the project proof page should have its own contact location",
);
assert.match(
  script,
  /contactLocation !== "project-proof"/,
  "the analytics allowlist should accept the project proof location",
);

for (const projectPage of projectPages) {
  const html = read(projectPage);

  assert.match(
    html,
    /data-contact-location="case-study"/,
    `${projectPage} should retain the case-study contact location`,
  );
  assert.match(
    html,
    /aria-label="Discuss a full-stack role with Kunal Deshmukh by email"/,
    `${projectPage} should name the full-stack role in the accessible contact label`,
  );
  assert.match(
    html,
    /Discuss a full-stack role <span aria-hidden="true">↗<\/span>/,
    `${projectPage} should name the full-stack role in the visible contact action`,
  );
  assert.match(
    html,
    /href="mailto:resume-sable-phi@mail\.tin\.computer\?subject=Kunal%20Deshmukh%20portfolio%20inquiry"/,
    `${projectPage} should preserve the verified mailbox and existing subject`,
  );
}

console.log("contact location checks passed");
