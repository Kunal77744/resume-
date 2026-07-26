(function (root, factory) {
  const attribution = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = attribution;
    return;
  }

  root.PortfolioAttribution = attribution;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const allowedSources = new Set([
    "hiring-review",
    "portfolio-story",
    "frontend-craft",
  ]);

  function getAllowedSource(search) {
    const source = new URLSearchParams(search).get("ref");
    return source && allowedSources.has(source) ? source : null;
  }

  function addSourceToMailto(href, source) {
    if (!source || !allowedSources.has(source)) {
      return href;
    }

    const mailto = new URL(href);

    if (mailto.protocol !== "mailto:") {
      return href;
    }

    const currentBody = mailto.searchParams.get("body");
    const sourceLine = `Portfolio source: ${source}`;
    mailto.searchParams.set(
      "body",
      currentBody ? `${currentBody}\n\n${sourceLine}` : sourceLine,
    );

    return mailto.toString();
  }

  return {
    addSourceToMailto,
    getAllowedSource,
  };
});
