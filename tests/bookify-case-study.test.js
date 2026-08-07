import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("projects/bookify/index.html", "utf8");
const homepage = fs.readFileSync("index.html", "utf8");

assert.match(
  page,
  /Carry one title\.\s*<span>From discovery to cart\.<\/span>/,
  "Bookify should lead with the checked catalog-to-cart story",
);
assert.match(
  page,
  /home shelf and full-catalog surface each request the book\s+collection/i,
  "Bookify should avoid claiming the catalog is fetched once",
);
assert.match(
  page,
  /Login reads the saved password before checking whether the email\s+exists/i,
  "Bookify should state the missing-user login boundary",
);
assert.match(
  page,
  /No working public Bookify demo is linked/i,
  "Bookify should identify source-observed behavior",
);

const caseStudyMailtos = page.match(/href="mailto:/g) ?? [];
assert.equal(
  caseStudyMailtos.length,
  1,
  "Bookify should preserve one clear hiring contact action",
);
assert.match(
  homepage,
  /href="\/projects\/bookify\/"/,
  "The homepage should keep Bookify one click away",
);
assert.match(
  homepage,
  /<p class="project-subtitle">MERN bookstore prototype<\/p>/,
  "The homepage should describe Bookify as a prototype",
);

console.log("Bookify case-study checks passed");
