const assert = require("node:assert/strict");

const {
  addSourceToMailto,
  getAllowedSource,
} = require("../source-attribution.js");

const allowedSources = [
  "hiring-review",
  "portfolio-story",
  "frontend-craft",
];

for (const source of allowedSources) {
  assert.equal(getAllowedSource(`?ref=${source}`), source);

  const taggedMailto = new URL(
    addSourceToMailto(
      "mailto:resume-sable-phi@mail.tin.computer?subject=Kunal%20Deshmukh%20portfolio%20inquiry",
      source,
    ),
  );

  assert.equal(
    taggedMailto.pathname,
    "resume-sable-phi@mail.tin.computer",
  );
  assert.equal(
    taggedMailto.searchParams.get("subject"),
    "Kunal Deshmukh portfolio inquiry",
  );
  assert.equal(
    taggedMailto.searchParams.get("body"),
    `Portfolio source: ${source}`,
  );
}

assert.equal(getAllowedSource(""), null);
assert.equal(getAllowedSource("?ref=kruti-shah"), null);
assert.equal(getAllowedSource("?ref=hiring-review-extra"), null);

const untaggedMailto =
  "mailto:resume-sable-phi@mail.tin.computer?subject=Kunal%20Deshmukh%20portfolio%20inquiry";

assert.equal(addSourceToMailto(untaggedMailto, null), untaggedMailto);
assert.equal(
  addSourceToMailto(untaggedMailto, "arbitrary-free-form-value"),
  untaggedMailto,
);

console.log("source attribution checks passed");
